import { Column, Entity, PrimaryColumn } from 'typeorm';
import LanguageEnum from '../enums/LanguageEnum';
import EditorModeEnum from '../enums/EditorModeEnum';

@Entity({ name: 'preference' })
export default class Preference {
    @PrimaryColumn({ name: 'id' })
    id: number;

    @Column({ name: 'language' })
    language: LanguageEnum;

    @Column({ name: 'editor_mode' })
    editorMode: EditorModeEnum;

    @Column({ name: 'sidebar_width' })
    sidebarWidth: number;

    @Column({ name: 'outline_width' })
    outlineWidth: number;

    @Column({ name: 'max_open' })
    maxOpen: number;

    @Column({ name: 'font_size' })
    fontSize: number;

    @Column({ name: 'tab_size' })
    tabSize: number;

    @Column({ name: 'vim_mode' })
    vimMode: boolean;

    @Column({ name: 'search_note_limit' })
    searchNoteLimit: number;

    @Column({ name: 'theme_id' })
    themeId: number;

    @Column({ name: 'create_time' })
    createTime: number;

    @Column({ name: 'update_time' })
    updateTime: number;
}
