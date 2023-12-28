import {
    ArrayUtils,
    AssertUtils,
    INoteService,
    Note,
    NoteVo,
    SaveNoteDto,
    TimeUtils,
    UpdateNoteDto,
} from '@clamcurry/common';
import log from 'electron-log';
import noteDao from '../dao/NoteDao';
import noteContentService from './NoteContentService';

class NoteService implements INoteService {
    async findById(id: number): Promise<NoteVo> {
        if (AssertUtils.isNotNumber(id) || AssertUtils.lt(id, 1)) {
            throw 'invalid id';
        }
        let note: Note;
        try {
            note = await noteDao.findById(id);
        } catch (e) {
            throw 'database error';
        }
        return note as NoteVo;
    }

    async listByNotebookId(notebookId: number): Promise<NoteVo[]> {
        let notes: Note[];
        try {
            notes = await noteDao.listByNotebookId(notebookId);
        } catch (e) {
            log.error('list notes by notebookId error', e);
            throw 'database error';
        }
        if (!notes) {
            return [];
        }
        return notes;
    }

    async save(dto: SaveNoteDto): Promise<number> {
        const { title, parentId, notebookId } = dto;
        if (AssertUtils.isBlank(title)) {
            throw 'invalid title';
        }
        if (AssertUtils.isNotNumber(parentId) || AssertUtils.lt(parentId, 0)) {
            throw 'invalid parentId';
        }
        if (AssertUtils.isNotNumber(notebookId) || AssertUtils.le(notebookId, 0)) {
            throw 'invalid notebookId';
        }
        let maxOrdinal: number;
        try {
            maxOrdinal = await noteDao.findMaxOrdinal(notebookId, parentId);
        } catch (e) {
            log.error('find max ordinal error', e);
            throw 'database error';
        }
        const now = TimeUtils.currentTimeMillis();
        const note = new Note();
        note.title = title;
        note.parentId = parentId;
        note.notebookId = notebookId;
        note.ordinal = maxOrdinal + 1;
        note.createTime = now;
        note.updateTime = now;
        note.visitTime = now;
        try {
            return await noteDao.save(note);
        } catch (e) {
            log.error('save note error', e);
            throw 'database error';
        }
    }

    async update(dto: UpdateNoteDto): Promise<void> {
        if (AssertUtils.isNotNumber(dto.id) || AssertUtils.lt(dto.id, 1)) {
            throw 'invalid id';
        }
        const now = TimeUtils.currentTimeMillis();
        const note = {
            ...dto,
            updateTime: now,
        } as Note;
        try {
            await noteDao.update(note);
        } catch (e) {
            log.error('update note error', e);
            throw 'database error';
        }
    }

    async updateBatch(dtoList: UpdateNoteDto[]): Promise<void> {
        const now = TimeUtils.currentTimeMillis();
        const notes = dtoList.map((dto) => {
            if (AssertUtils.isNotNumber(dto.id) || AssertUtils.lt(dto.id, 1)) {
                throw 'invalid id';
            }
            return {
                ...dto,
                updateTime: now,
            } as Note;
        });
        try {
            await noteDao.updateBatch(notes);
        } catch (e) {
            log.error('batch update note error', e);
            throw 'database error';
        }
    }

    async delete(id: number): Promise<number[]> {
        if (AssertUtils.isNotNumber(id) || AssertUtils.lt(id, 1)) {
            throw 'invalid id';
        }
        try {
            let note = await noteDao.findById(id);
            if (!note) {
                return;
            }
            const notes = await this.listByNotebookId(note.notebookId);
            ArrayUtils.toTree(notes, 'id', 'parentId', 'children', 0);
            note = notes.find((n) => n.id === id);
            const ids = this.getDescendantAndSelfIds(note);
            const assets = await noteContentService.getAssets(ids);
            await noteDao.delete(ids, assets);
            return ids;
        } catch (e) {
            log.error('delete note error', e);
            throw 'database error';
        }
    }

    private getDescendantAndSelfIds(note: NoteVo): number[] {
        const children = note.children;
        if (!children || !children.length) {
            return [note.id];
        }
        const ids = [note.id];
        for (const child of children) {
            ids.push(...this.getDescendantAndSelfIds(child));
        }
        return ids;
    }

    async refreshVisitTime(id: number): Promise<void> {
        const now = TimeUtils.currentTimeMillis();
        const note = new Note();
        note.id = id;
        note.visitTime = now;
        note.updateTime = now;
        try {
            await noteDao.update(note);
        } catch (e) {
            log.error('refresh visitTime error', e);
            throw 'database error';
        }
    }

    async searchByKeyword(notebookId: number, keyword: string, limit: number): Promise<NoteVo[]> {
        if (AssertUtils.isNotNumber(notebookId) || AssertUtils.le(notebookId, 0)) {
            throw 'invalid notebookId';
        }
        if (AssertUtils.isBlank(keyword)) {
            throw 'invalid keyword';
        }
        if (AssertUtils.isNotNumber(limit) || AssertUtils.le(limit, 0)) {
            limit = 100;
        }
        try {
            const notes = await noteDao.searchByKeyword(notebookId, keyword, limit);
            return notes as NoteVo[];
        } catch (e) {
            throw 'database error';
        }
    }

    async getContent(id: number): Promise<string> {
        return noteContentService.getContent(id);
    }

    updateContent(id: number, content: string): void {
        if (AssertUtils.isNotNumber(id) || AssertUtils.lt(id, 1)) {
            throw 'invalid id';
        }
        noteContentService.addBuffer(id, content);
    }

    async handleCloseNote(id: number): Promise<void> {
        await noteContentService.removeBuffer(id);
    }
}

export default new NoteService();
