import { Preference } from '@clamcurry/common';
import datasource from '../database/datasource';

class PreferenceDao {
    private repository = () => datasource.getRepository(Preference);

    async findById(id: number): Promise<Preference> {
        return await this.repository().findOneBy({ id });
    }

    async update(preference: Preference): Promise<void> {
        await this.repository().update({ id: preference.id }, preference);
    }
}

export default new PreferenceDao();
