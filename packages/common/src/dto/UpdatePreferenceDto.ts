import LanguageEnum from '../enums/LanguageEnum';
import EditorModeEnum from '../enums/EditorModeEnum';

export default class UpdatePreferenceDto {
    language: LanguageEnum;
    editorMode: EditorModeEnum;
    sidebarWidth: number;
    outlineWidth: number;
    maxOpen: number;
    fontSize: number;
    tabSize: number;
    vimMode: boolean;
    relativeLineNumber: boolean;
    searchNoteLimit: number;
    themeId: number;
}
