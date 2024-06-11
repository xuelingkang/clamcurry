import datasource from '../database/datasource';
import { Note, NoteContent, NullsEnum, OrderEnum } from '@clamcurry/common';
import TrashUtils from '../utils/TrashUtils';

class NoteDao {
    private repository = () => datasource.getRepository(Note);

    async findById(id: number): Promise<Note> {
        return await this.repository().findOneBy({ id });
    }

    async listByNotebookId(notebookId: number): Promise<Note[]> {
        return await this.repository()
            .createQueryBuilder()
            .where('notebook_id = :notebookId', { notebookId })
            .addOrderBy('ordinal', OrderEnum.ASC, NullsEnum.LAST)
            .getMany();
    }

    async findMaxOrdinal(notebookId: number, parentId: number): Promise<number> {
        const lastNote = await this.repository()
            .createQueryBuilder()
            .where('notebook_id = :notebookId and parent_id = :parentId', { notebookId, parentId })
            .addOrderBy('ordinal', OrderEnum.DESC, NullsEnum.LAST)
            .limit(1)
            .getOne();
        if (lastNote) {
            return lastNote.ordinal;
        }
        return 0;
    }

    async save(note: Note): Promise<number> {
        return await datasource.transaction(async (manager) => {
            await manager.getRepository(Note).save(note);
            const noteContent = new NoteContent();
            noteContent.id = note.id;
            noteContent.notebookId = note.notebookId;
            noteContent.content = '';
            await manager.getRepository(NoteContent).save(noteContent);
            return note.id;
        });
    }

    async update(note: Note): Promise<void> {
        await this.repository().update({ id: note.id }, note);
    }

    async updateBatch(notes: Note[]): Promise<void> {
        await this.repository().save(notes);
    }

    async delete(ids: number[], assets: string[]): Promise<void> {
        await datasource.transaction(async (manager) => {
            const noteRepository = manager.getRepository(Note);
            const contentRepository = manager.getRepository(NoteContent);
            await noteRepository
                .createQueryBuilder()
                .delete()
                .where(`id in (${ids.join(',')})`)
                .execute();
            await contentRepository
                .createQueryBuilder()
                .delete()
                .where(`id in (${ids.join(',')})`)
                .execute();
            TrashUtils.cleanImmediately(assets);
        });
    }

    async searchByKeyword(notebookId: number, keyword: string, limit: number): Promise<Note[]> {
        const words = keyword.split(/\s+/);
        const builder = this.repository()
            .createQueryBuilder('note')
            .innerJoin(NoteContent, 'content', 'note.id = content.id')
            .andWhere('note.notebook_id = :notebookId', { notebookId });
        for (const word of words) {
            builder.andWhere(`(note.title like '%${word}%' or content.content like '%${word}%')`);
        }
        builder.addOrderBy('note.visit_time', OrderEnum.DESC, NullsEnum.LAST);
        builder.addOrderBy('note.id', OrderEnum.DESC);
        builder.limit(limit);
        return await builder.getMany();
    }
}

export default new NoteDao();
