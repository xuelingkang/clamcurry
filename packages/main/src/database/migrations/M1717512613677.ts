import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import log from 'electron-log';

export default class M1717512613677 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        log.info('start update preference');
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
                    name: 'relative_line_number',
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
        const result = await queryRunner.query(
            'SELECT id, language, editor_mode, sidebar_width, outline_width, max_open, font_size, tab_size, vim_mode, search_note_limit, theme_id, create_time, update_time FROM preference WHERE id = ?',
            [1],
        );
        const preference = result[0];
        await queryRunner.dropTable('preference');
        await queryRunner.createTable(preferenceTable, true);
        await queryRunner.query(
            'INSERT INTO preference (id, language, editor_mode, sidebar_width, outline_width, max_open, font_size, tab_size, vim_mode, relative_line_number, search_note_limit, theme_id, create_time, update_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                preference.id,
                preference.language,
                preference.editor_mode,
                preference.sidebar_width,
                preference.outline_width,
                preference.max_open,
                preference.font_size,
                preference.tab_size,
                preference.vim_mode,
                0,
                preference.search_note_limit,
                preference.theme_id,
                preference.create_time,
                preference.update_time,
            ],
        );
        log.info('finish update preference');

        log.info('start update theme');
        await queryRunner.query('UPDATE theme SET active_line = ? WHERE id = ?', ['FFFEEB99', 1]);
        await queryRunner.query(
            'UPDATE theme SET selection = ?, active_line = ?, line_number1 = ?, highlighter2 = ?, highlighter4 = ?, highlighter5 = ? WHERE id = ?',
            ['FFFFFF33', 'FFFFFF1A', '6D8A88FF', 'BD93F9FF', '66D9EFFF', '50FA7BFF', 2],
        );
        log.info('finish update theme');
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        log.info('start rollback preference');
        const table = await queryRunner.getTable('preference');
        if (table.columns.some((column) => column.name === 'relative_line_number')) {
            await queryRunner.dropColumn('preference', 'relative_line_number');
        }
        log.info('finish rollback preference');

        log.info('start rollback theme');
        await queryRunner.query('UPDATE theme SET active_line = ? WHERE id = ?', ['FFFEEBFF', 1]);
        await queryRunner.query(
            'UPDATE theme SET selection = ?, active_line = ?, line_number1 = ?, highlighter2 = ?, highlighter4 = ?, highlighter5 = ? WHERE id = ?',
            ['44475AFF', '44475AFF', '858585FF', 'B5CEA8FF', '00E0E0FF', '8BE9FDFF', 2],
        );
        log.info('finish rollback theme');
    }
}
