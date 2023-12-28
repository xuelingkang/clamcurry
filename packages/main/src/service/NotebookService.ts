import {
    AssertUtils,
    INotebookService,
    Notebook,
    NotebookVo,
    SaveNotebookDto,
    TimeUtils,
    UpdateNotebookDto,
} from '@clamcurry/common';
import log from 'electron-log';
import notebookDao from '../dao/NotebookDao';
import noteService from './NoteService';
import noteContentService from './NoteContentService';

class NotebookService implements INotebookService {
    async findAll(): Promise<NotebookVo[]> {
        let notebooks: Notebook[];
        try {
            notebooks = await notebookDao.findAll();
        } catch (e) {
            log.error('find all notebooks error', e);
            throw 'database error';
        }
        return notebooks as NotebookVo[];
    }

    async findById(id: number): Promise<NotebookVo> {
        let notebook: Notebook;
        try {
            notebook = await notebookDao.findById(id);
        } catch (e) {
            log.error('find notebook by id error', id, e);
            throw 'database error';
        }
        return notebook as NotebookVo;
    }

    async enable(id: number): Promise<void> {
        if (AssertUtils.isNotNumber(id) || AssertUtils.le(id, 0)) {
            throw 'invalid id';
        }
        try {
            await notebookDao.enable(id);
        } catch (e) {
            log.error('update enabled notebook error', e);
            throw 'database error';
        }
    }

    async save(dto: SaveNotebookDto): Promise<number> {
        const { name } = dto;
        if (AssertUtils.isBlank(name)) {
            throw 'invalid name';
        }
        const now = TimeUtils.currentTimeMillis();
        const notebook = new Notebook();
        notebook.name = name;
        notebook.enabled = true;
        notebook.createTime = now;
        notebook.updateTime = now;
        try {
            return await notebookDao.save(notebook);
        } catch (e) {
            log.error('save notebook error', e);
            throw 'database error';
        }
    }

    async update(dto: UpdateNotebookDto): Promise<void> {
        const { id, name } = dto;
        if (AssertUtils.isNotNumber(id) || AssertUtils.le(id, 0)) {
            throw 'invalid id';
        }
        if (AssertUtils.isBlank(name)) {
            throw 'invalid name';
        }
        const now = TimeUtils.currentTimeMillis();
        const notebook = new Notebook();
        notebook.id = id;
        notebook.name = name;
        notebook.updateTime = now;
        await notebookDao.update(notebook);
    }

    async delete(id: number): Promise<void> {
        if (AssertUtils.isNotNumber(id) || AssertUtils.le(id, 0)) {
            throw 'invalid id';
        }
        let noteIds: number[];
        let assets: string[];
        const notes = await noteService.listByNotebookId(id);
        if (notes && notes.length) {
            noteIds = notes.map(({ id }) => id);
            assets = await noteContentService.getAssets(noteIds);
        }
        await notebookDao.delete(id, noteIds, assets);
    }
}

export default new NotebookService();
