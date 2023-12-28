import { NoteContent } from '@clamcurry/common';
import datasource from '../database/datasource';

class NoteContentDao {
    private repository = () => datasource.getRepository(NoteContent);

    async findById(id: number): Promise<NoteContent> {
        return await this.repository().findOneBy({ id });
    }

    async listByIds(ids: number[]): Promise<NoteContent[]> {
        return await this.repository()
            .createQueryBuilder()
            .where(`id in (${ids.join(',')})`)
            .getMany();
    }

    async save(noteContent: NoteContent): Promise<void> {
        await this.repository().save(noteContent);
    }

    async updateById(noteContent: NoteContent): Promise<void> {
        await this.repository().update({ id: noteContent.id }, noteContent);
    }
}

export default new NoteContentDao();
