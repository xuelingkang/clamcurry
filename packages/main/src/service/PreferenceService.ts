import { IPreferenceService, Preference, PreferenceVo, TimeUtils, UpdatePreferenceDto } from '@clamcurry/common';
import log from 'electron-log';
import themeService from './ThemeService';
import preferenceDao from '../dao/PreferenceDao';

class PreferenceService implements IPreferenceService {
    async find(): Promise<PreferenceVo> {
        let preference: Preference;
        try {
            preference = await preferenceDao.findById(1);
        } catch (e) {
            log.error('find preference error', e);
            throw 'database error';
        }
        const theme = await themeService.findById(preference.themeId);
        return {
            ...preference,
            theme,
        } as PreferenceVo;
    }

    async update(dto: UpdatePreferenceDto): Promise<void> {
        const now = TimeUtils.currentTimeMillis();
        const preference = new Preference();
        preference.id = 1;
        preference.language = dto.language;
        preference.editorMode = dto.editorMode;
        preference.sidebarWidth = dto.sidebarWidth;
        preference.outlineWidth = dto.outlineWidth;
        preference.maxOpen = dto.maxOpen;
        preference.fontSize = dto.fontSize;
        preference.tabSize = dto.tabSize;
        preference.vimMode = dto.vimMode;
        preference.relativeLineNumber = dto.relativeLineNumber;
        preference.searchNoteLimit = dto.searchNoteLimit;
        preference.themeId = dto.themeId;
        preference.updateTime = now;
        try {
            await preferenceDao.update(preference);
        } catch (e) {
            log.error('update preference error', e);
            throw 'database error';
        }
    }
}

export default new PreferenceService();
