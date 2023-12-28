import { AssertUtils, IThemeService, SaveThemeDto, Theme, ThemeVo, TimeUtils, UpdateThemeDto } from '@clamcurry/common';
import log from 'electron-log';
import themeDao from '../dao/ThemeDao';

class ThemeService implements IThemeService {
    async findAll(): Promise<ThemeVo[]> {
        try {
            return await themeDao.findAll();
        } catch (e) {
            log.error('find all theme error', e);
            throw 'database error';
        }
    }

    async findById(id: number): Promise<ThemeVo> {
        try {
            return await themeDao.findById(id);
        } catch (e) {
            log.error('find theme error', e);
            throw 'database error';
        }
    }

    async save(dto: SaveThemeDto): Promise<number> {
        const { name } = dto;
        if (AssertUtils.isBlank(name)) {
            throw 'invalid name';
        }
        const now = TimeUtils.currentTimeMillis();
        const theme = this.createTheme(dto);
        theme.createTime = now;
        theme.updateTime = now;
        try {
            return await themeDao.save(theme);
        } catch (e) {
            log.error('save theme error', e);
            throw 'database error';
        }
    }

    async update(dto: UpdateThemeDto): Promise<void> {
        const { id, name } = dto;
        if (AssertUtils.isNotNumber(id) || AssertUtils.le(id, 0)) {
            throw 'invalid id';
        }
        if (AssertUtils.isBlank(name)) {
            throw 'invalid name';
        }
        const themeInDB = await themeDao.findById(id);
        if (!themeInDB) {
            throw 'not found';
        }
        if (themeInDB.preset) {
            throw 'not allowed';
        }
        const now = TimeUtils.currentTimeMillis();
        const theme = this.createTheme(dto);
        theme.id = id;
        theme.updateTime = now;
        try {
            await themeDao.updateById(theme);
        } catch (e) {
            log.error('update theme error', e);
            throw 'database error';
        }
    }

    async delete(id: number): Promise<void> {
        if (AssertUtils.isNotNumber(id) || AssertUtils.le(id, 0)) {
            throw 'invalid id';
        }
        const themeInDB = await themeDao.findById(id);
        if (!themeInDB) {
            throw 'not found';
        }
        if (themeInDB.preset) {
            throw 'not allowed';
        }
        try {
            await themeDao.deleteById(id);
        } catch (e) {
            log.error('delete theme error', e);
            throw 'database error';
        }
    }

    private createTheme(dto: SaveThemeDto | UpdateThemeDto): Theme {
        const theme = new Theme();
        theme.name = dto.name;
        theme.base = dto.base;
        theme.foreground1 = dto.foreground1;
        theme.foreground2 = dto.foreground2;
        theme.foreground3 = dto.foreground3;
        theme.foreground4 = dto.foreground4;
        theme.background1 = dto.background1;
        theme.background2 = dto.background2;
        theme.background3 = dto.background3;
        theme.background4 = dto.background4;
        theme.divider1 = dto.divider1;
        theme.divider2 = dto.divider2;
        theme.scrollbar = dto.scrollbar;
        theme.selection = dto.selection;
        theme.activeLine = dto.activeLine;
        theme.lineNumber1 = dto.lineNumber1;
        theme.lineNumber2 = dto.lineNumber2;
        theme.highlighter1 = dto.highlighter1;
        theme.highlighter2 = dto.highlighter2;
        theme.highlighter3 = dto.highlighter3;
        theme.highlighter4 = dto.highlighter4;
        theme.highlighter5 = dto.highlighter5;
        theme.highlighter6 = dto.highlighter6;
        theme.primary = dto.primary;
        theme.secondary = dto.secondary;
        theme.success = dto.success;
        theme.info = dto.info;
        theme.warning = dto.warning;
        theme.error = dto.error;
        theme.preset = false;
        return theme;
    }
}

export default new ThemeService();
