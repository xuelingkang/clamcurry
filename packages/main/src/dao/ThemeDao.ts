import datasource from '../database/datasource';
import { Theme } from '@clamcurry/common';

class ThemeDao {
    private repository = () => datasource.getRepository(Theme);

    async findAll(): Promise<Theme[]> {
        return await this.repository().find();
    }

    async findById(id: number): Promise<Theme> {
        return await this.repository().findOneBy({ id });
    }

    async save(theme: Theme): Promise<number> {
        await this.repository().save(theme);
        return theme.id;
    }

    async updateById(theme: Theme): Promise<void> {
        await this.repository().update({ id: theme.id }, theme);
    }

    async deleteById(id: number): Promise<void> {
        await this.repository().delete({ id });
    }
}

export default new ThemeDao();
