import { Note, Notebook, NoteContent } from '@clamcurry/common';
import datasource from '../database/datasource';
import TrashUtils from '../utils/TrashUtils';

class NotebookDao {
    private repository = () => datasource.getRepository(Notebook);

    async findAll(): Promise<Notebook[]> {
        return await this.repository().find();
    }

    async findById(id: number): Promise<Notebook> {
        return await this.repository().findOneBy({ id: id });
    }

    async findEnabled(): Promise<Notebook> {
        return await this.repository().findOneBy({ enabled: true });
    }

    async enable(id: number): Promise<void> {
        const enabledNotebook = await this.findEnabled();
        if (enabledNotebook && enabledNotebook.id === id) {
            return;
        }
        await datasource.transaction(async (manager) => {
            const notebookRepository = manager.getRepository(Notebook);
            await notebookRepository
                .createQueryBuilder()
                .update()
                .set({ enabled: false })
                .where('id = :id', { id: enabledNotebook.id })
                .execute();
            await notebookRepository
                .createQueryBuilder()
                .update()
                .set({ enabled: true })
                .where('id = :id', { id })
                .execute();
        });
    }

    async save(notebook: Notebook): Promise<number> {
        const enabledNotebook = await this.findEnabled();
        return await datasource.transaction(async (manager) => {
            const notebookRepository = manager.getRepository(Notebook);
            if (enabledNotebook) {
                await notebookRepository
                    .createQueryBuilder()
                    .update()
                    .set({ enabled: false })
                    .where('id = :id', { id: enabledNotebook.id })
                    .execute();
            }
            await notebookRepository.save(notebook);
            return notebook.id;
        });
    }

    async update(notebook: Notebook): Promise<void> {
        await this.repository().update({ id: notebook.id }, notebook);
    }

    async delete(id: number, noteIds: number[], assets: string[]): Promise<void> {
        const notebook = await this.findById(id);
        await datasource.transaction(async (manager) => {
            const notebookRepository = manager.getRepository(Notebook);
            const noteRepository = manager.getRepository(Note);
            const contentRepository = manager.getRepository(NoteContent);
            if (notebook.enabled) {
                const newEnable = await notebookRepository
                    .createQueryBuilder()
                    .where('id <> :id', { id })
                    .limit(1)
                    .getOne();
                if (newEnable) {
                    await notebookRepository
                        .createQueryBuilder()
                        .update()
                        .set({ enabled: true })
                        .where('id = :id', { id: newEnable.id })
                        .execute();
                }
            }
            await notebookRepository.delete({ id });
            if (noteIds && noteIds.length) {
                await noteRepository
                    .createQueryBuilder()
                    .delete()
                    .where(`id in (${noteIds.join(',')})`)
                    .execute();
                await contentRepository
                    .createQueryBuilder()
                    .delete()
                    .where(`id in (${noteIds.join(',')})`)
                    .execute();
            }
            TrashUtils.cleanImmediately(assets);
        });
    }
}

export default new NotebookDao();
