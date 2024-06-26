import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
    EditorModeEnum,
    LanguageEnum,
    Note,
    Notebook,
    NoteContent,
    Preference,
    Theme,
    ThemeBaseEnum,
    TimeUtils,
} from '@clamcurry/common';
import { app, nativeTheme } from 'electron';
import * as fs from 'node:fs';
import path from 'node:path';
import log from 'electron-log';
import mainProcessService from '../../service/MainProcessService';

export default class M1697914252167 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        log.info('start init table');
        await this.initTable(queryRunner);
        log.info('finish init table');

        log.info('start init file');
        const readme = this.initReadmeNote();
        log.info('finish init file');

        log.info('start init data');
        await this.initData(queryRunner, readme);
        log.info('finish init data');
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        log.info('start drop table');
        await queryRunner.dropTable('note_content');
        await queryRunner.dropTable('note');
        await queryRunner.dropTable('notebook');
        await queryRunner.dropTable('theme');
        await queryRunner.dropTable('preference');
        log.info('finish drop table');
    }

    async initTable(queryRunner: QueryRunner) {
        const preferenceTable = new Table({
            name: 'preference',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'language',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'editor_mode',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'sidebar_width',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'outline_width',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'max_open',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'font_size',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'tab_size',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'vim_mode',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'search_note_limit',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'theme_id',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'create_time',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'update_time',
                    type: 'integer',
                    isNullable: true,
                },
            ],
            indices: [
                {
                    name: 'preference_idx_enabled',
                    columnNames: ['enabled'],
                },
            ],
        });
        const themeTable = new Table({
            name: 'theme',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isUnique: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'base',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'foreground1',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'foreground2',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'foreground3',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'foreground4',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'background1',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'background2',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'background3',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'background4',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'divider1',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'divider2',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'scrollbar',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'selection',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'active_line',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'line_number1',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'line_number2',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'highlighter1',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'highlighter2',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'highlighter3',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'highlighter4',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'highlighter5',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'highlighter6',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'primary',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'secondary',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'success',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'info',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'warning',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'error',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'preset',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'create_time',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'update_time',
                    type: 'integer',
                    isNullable: true,
                },
            ],
            indices: [
                {
                    name: 'theme_idx_dark_mode',
                    columnNames: ['dark_mode'],
                },
            ],
        });
        const notebookTable = new Table({
            name: 'notebook',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isUnique: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'enabled',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'create_time',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'update_time',
                    type: 'integer',
                    isNullable: true,
                },
            ],
            indices: [
                {
                    name: 'notebook_idx_enabled',
                    columnNames: ['enabled'],
                },
            ],
        });
        const noteTable = new Table({
            name: 'note',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isUnique: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'title',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'parent_id',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'notebook_id',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'ordinal',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'create_time',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'update_time',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'visit_time',
                    type: 'integer',
                    isNullable: true,
                },
            ],
            indices: [
                {
                    name: 'note_idx_parent_id',
                    columnNames: ['parent_id'],
                },
                {
                    name: 'note_idx_notebook_id',
                    columnNames: ['notebook_id'],
                },
                {
                    name: 'note_idx_ordinal',
                    columnNames: ['ordinal'],
                },
            ],
        });
        const noteContentTable = new Table({
            name: 'note_content',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isUnique: true,
                    isNullable: false,
                },
                {
                    name: 'notebook_id',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'content',
                    type: 'text',
                    isNullable: true,
                },
            ],
            indices: [
                {
                    name: 'note_content_notebook_id',
                    columnNames: ['notebook_id'],
                },
            ],
        });

        await queryRunner.createTable(preferenceTable, true);
        await queryRunner.createTable(themeTable, true);
        await queryRunner.createTable(notebookTable, true);
        await queryRunner.createTable(noteTable, true);
        await queryRunner.createTable(noteContentTable, true);
    }

    initReadmeNote() {
        const appAssetsRoot = mainProcessService.getAppAssetsRoot();
        const assetsRoot = mainProcessService.getAssetsRoot();
        fs.cpSync(path.join(appAssetsRoot, 'readme'), path.join(assetsRoot, 'readme'), { recursive: true });
        return fs.readFileSync(path.join(appAssetsRoot, 'readme', 'README.md'), 'utf-8');
    }

    async initData(queryRunner: QueryRunner, readme: string) {
        const now = TimeUtils.currentTimeMillis();

        const presetLightTheme = new Theme();
        presetLightTheme.id = 1;
        presetLightTheme.name = 'Preset Light';
        presetLightTheme.base = ThemeBaseEnum.LIGHT;
        presetLightTheme.foreground1 = '000000FF';
        presetLightTheme.foreground2 = '1F2328FF';
        presetLightTheme.foreground3 = '656D76FF';
        presetLightTheme.foreground4 = '0969DAFF';
        presetLightTheme.background1 = 'F8F8F8FF';
        presetLightTheme.background2 = 'FFFFFFFF';
        presetLightTheme.background3 = 'F6F8FAFF';
        presetLightTheme.background4 = 'AFB8C133';
        presetLightTheme.divider1 = 'D0D7DEFF';
        presetLightTheme.divider2 = 'D8DEE4FF';
        presetLightTheme.scrollbar = '64646466';
        presetLightTheme.selection = 'B4D5FEFF';
        presetLightTheme.activeLine = 'FFFEEBFF';
        presetLightTheme.lineNumber1 = '237893FF';
        presetLightTheme.lineNumber2 = '0B216FFF';
        presetLightTheme.highlighter1 = 'DD1144FF';
        presetLightTheme.highlighter2 = '098658FF';
        presetLightTheme.highlighter3 = '0000FFFF';
        presetLightTheme.highlighter4 = '990000FF';
        presetLightTheme.highlighter5 = '008080FF';
        presetLightTheme.highlighter6 = '999988FF';
        presetLightTheme.primary = '42A5F5FF';
        presetLightTheme.secondary = 'AB47BCFF';
        presetLightTheme.success = '388E3CFF';
        presetLightTheme.info = '0288D1FF';
        presetLightTheme.warning = 'F57C00FF';
        presetLightTheme.error = 'D32F2FFF';
        presetLightTheme.preset = true;
        presetLightTheme.createTime = now;
        presetLightTheme.updateTime = now;
        await queryRunner.query(
            'INSERT INTO theme (id, name, base, foreground1, foreground2, foreground3, foreground4, background1, background2, background3, background4, divider1, divider2, scrollbar, selection, active_line, line_number1, line_number2, highlighter1, highlighter2, highlighter3, highlighter4, highlighter5, highlighter6, `primary`, secondary, success, info, warning, error, preset, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                presetLightTheme.id,
                presetLightTheme.name,
                presetLightTheme.base,
                presetLightTheme.foreground1,
                presetLightTheme.foreground2,
                presetLightTheme.foreground3,
                presetLightTheme.foreground4,
                presetLightTheme.background1,
                presetLightTheme.background2,
                presetLightTheme.background3,
                presetLightTheme.background4,
                presetLightTheme.divider1,
                presetLightTheme.divider2,
                presetLightTheme.scrollbar,
                presetLightTheme.selection,
                presetLightTheme.activeLine,
                presetLightTheme.lineNumber1,
                presetLightTheme.lineNumber2,
                presetLightTheme.highlighter1,
                presetLightTheme.highlighter2,
                presetLightTheme.highlighter3,
                presetLightTheme.highlighter4,
                presetLightTheme.highlighter5,
                presetLightTheme.highlighter6,
                presetLightTheme.primary,
                presetLightTheme.secondary,
                presetLightTheme.success,
                presetLightTheme.info,
                presetLightTheme.warning,
                presetLightTheme.error,
                presetLightTheme.preset,
                presetLightTheme.createTime,
                presetLightTheme.updateTime,
            ],
        );

        const presetDarkTheme = new Theme();
        presetDarkTheme.id = 2;
        presetDarkTheme.name = 'Preset Dark';
        presetDarkTheme.base = ThemeBaseEnum.DARK;
        presetDarkTheme.foreground1 = 'F8F8F2FF';
        presetDarkTheme.foreground2 = 'ADBAC7FF';
        presetDarkTheme.foreground3 = '768390FF';
        presetDarkTheme.foreground4 = '539BF5FF';
        presetDarkTheme.background1 = '21222BFF';
        presetDarkTheme.background2 = '282A35FF';
        presetDarkTheme.background3 = '353745FF';
        presetDarkTheme.background4 = '636E7B66';
        presetDarkTheme.divider1 = '444C56FF';
        presetDarkTheme.divider2 = '373E47FF';
        presetDarkTheme.scrollbar = '79797966';
        presetDarkTheme.selection = '44475AFF';
        presetDarkTheme.activeLine = '44475AFF';
        presetDarkTheme.lineNumber1 = '858585FF';
        presetDarkTheme.lineNumber2 = 'C6C6C6FF';
        presetDarkTheme.highlighter1 = 'F1FA8CFF';
        presetDarkTheme.highlighter2 = 'B5CEA8FF';
        presetDarkTheme.highlighter3 = 'FF79C6FF';
        presetDarkTheme.highlighter4 = '00E0E0FF';
        presetDarkTheme.highlighter5 = '8BE9FDFF';
        presetDarkTheme.highlighter6 = '6272A4FF';
        presetDarkTheme.primary = '42A5F5FF';
        presetDarkTheme.secondary = 'AB47BCFF';
        presetDarkTheme.success = '388E3CFF';
        presetDarkTheme.info = '0288D1FF';
        presetDarkTheme.warning = 'F57C00FF';
        presetDarkTheme.error = 'D32F2FFF';
        presetDarkTheme.preset = true;
        presetDarkTheme.createTime = now;
        presetDarkTheme.updateTime = now;
        await queryRunner.query(
            'INSERT INTO theme (id, name, base, foreground1, foreground2, foreground3, foreground4, background1, background2, background3, background4, divider1, divider2, scrollbar, selection, active_line, line_number1, line_number2, highlighter1, highlighter2, highlighter3, highlighter4, highlighter5, highlighter6, `primary`, secondary, success, info, warning, error, preset, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                presetDarkTheme.id,
                presetDarkTheme.name,
                presetDarkTheme.base,
                presetDarkTheme.foreground1,
                presetDarkTheme.foreground2,
                presetDarkTheme.foreground3,
                presetDarkTheme.foreground4,
                presetDarkTheme.background1,
                presetDarkTheme.background2,
                presetDarkTheme.background3,
                presetDarkTheme.background4,
                presetDarkTheme.divider1,
                presetDarkTheme.divider2,
                presetDarkTheme.scrollbar,
                presetDarkTheme.selection,
                presetDarkTheme.activeLine,
                presetDarkTheme.lineNumber1,
                presetDarkTheme.lineNumber2,
                presetDarkTheme.highlighter1,
                presetDarkTheme.highlighter2,
                presetDarkTheme.highlighter3,
                presetDarkTheme.highlighter4,
                presetDarkTheme.highlighter5,
                presetDarkTheme.highlighter6,
                presetDarkTheme.primary,
                presetDarkTheme.secondary,
                presetDarkTheme.success,
                presetDarkTheme.info,
                presetDarkTheme.warning,
                presetDarkTheme.error,
                presetDarkTheme.preset,
                presetDarkTheme.createTime,
                presetDarkTheme.updateTime,
            ],
        );

        const defaultPreference = new Preference();
        defaultPreference.id = 1;
        defaultPreference.language = this.getDefaultLanguage();
        defaultPreference.editorMode = EditorModeEnum.EDITOR_PREVIEW;
        defaultPreference.sidebarWidth = 300;
        defaultPreference.outlineWidth = 200;
        defaultPreference.maxOpen = 5;
        defaultPreference.fontSize = 16;
        defaultPreference.tabSize = 4;
        defaultPreference.vimMode = false;
        defaultPreference.searchNoteLimit = 50;
        defaultPreference.themeId = nativeTheme.shouldUseDarkColors ? presetDarkTheme.id : presetLightTheme.id;
        defaultPreference.createTime = now;
        defaultPreference.updateTime = now;
        await queryRunner.query(
            'INSERT INTO preference (id, language, editor_mode, sidebar_width, outline_width, max_open, font_size, tab_size, vim_mode, search_note_limit, theme_id, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                defaultPreference.id,
                defaultPreference.language,
                defaultPreference.editorMode,
                defaultPreference.sidebarWidth,
                defaultPreference.outlineWidth,
                defaultPreference.maxOpen,
                defaultPreference.fontSize,
                defaultPreference.tabSize,
                defaultPreference.vimMode,
                defaultPreference.searchNoteLimit,
                defaultPreference.themeId,
                defaultPreference.createTime,
                defaultPreference.updateTime,
            ],
        );

        const defaultNotebook = new Notebook();
        defaultNotebook.id = 1;
        defaultNotebook.name = 'Default Notebook';
        defaultNotebook.enabled = true;
        defaultNotebook.createTime = now;
        defaultNotebook.updateTime = now;
        await queryRunner.query(
            'INSERT INTO notebook (id, name, enabled, create_time, update_time) VALUES (?, ?, ?, ?, ?)',
            [
                defaultNotebook.id,
                defaultNotebook.name,
                defaultNotebook.enabled,
                defaultNotebook.createTime,
                defaultNotebook.updateTime,
            ],
        );

        const readmeNote = new Note();
        readmeNote.id = 1;
        readmeNote.title = 'README';
        readmeNote.parentId = 0;
        readmeNote.notebookId = defaultNotebook.id;
        readmeNote.ordinal = 1;
        readmeNote.createTime = now;
        readmeNote.updateTime = now;
        readmeNote.visitTime = now;
        await queryRunner.query(
            'INSERT INTO note (id, title, parent_id, notebook_id, ordinal, create_time, update_time, visit_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                readmeNote.id,
                readmeNote.title,
                readmeNote.parentId,
                readmeNote.notebookId,
                readmeNote.ordinal,
                readmeNote.createTime,
                readmeNote.updateTime,
                readmeNote.visitTime,
            ],
        );

        const readmeNoteContent = new NoteContent();
        readmeNoteContent.id = readmeNote.id;
        readmeNoteContent.notebookId = defaultNotebook.id;
        readmeNoteContent.content = readme;
        await queryRunner.query('INSERT INTO note_content (id, notebook_id, content) VALUES (?, ?, ?)', [
            readmeNoteContent.id,
            readmeNoteContent.notebookId,
            readmeNoteContent.content,
        ]);
    }

    getDefaultLanguage(): LanguageEnum {
        const languages = app.getPreferredSystemLanguages();
        if (!languages || !languages.length) {
            return LanguageEnum.en_US;
        }
        let language = languages[0];
        if (!language) {
            return LanguageEnum.en_US;
        }
        language = language.toLowerCase();
        if (language.startsWith('zh-hans')) {
            return LanguageEnum.zh_CN;
        }
        return LanguageEnum.en_US;
    }
}
