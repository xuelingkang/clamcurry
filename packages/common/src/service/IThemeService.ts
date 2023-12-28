import ThemeVo from '../vo/ThemeVo';
import SaveThemeDto from '../dto/SaveThemeDto';
import UpdateThemeDto from '../dto/UpdateThemeDto';

export default interface IThemeService {
    findAll: () => Promise<ThemeVo[]>;
    findById: (id: number) => Promise<ThemeVo>;
    save: (dto: SaveThemeDto) => Promise<number>;
    update: (dto: UpdateThemeDto) => Promise<void>;
    delete: (id: number) => Promise<void>;
}
