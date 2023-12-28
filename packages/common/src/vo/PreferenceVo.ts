import LanguageEnum from '../enums/LanguageEnum';
import EditorModeEnum from '../enums/EditorModeEnum';
import ThemeVo from './ThemeVo';

export default class PreferenceVo {
    id: number;
    language: LanguageEnum;
    editorMode: EditorModeEnum;
    sidebarWidth: number;
    outlineWidth: number;
    maxOpen: number;
    fontSize: number;
    tabSize: number;
    vimMode: boolean;
    searchNoteLimit: number;
    themeId: number;
    createTime: number;
    updateTime: number;
    theme: ThemeVo;
}
