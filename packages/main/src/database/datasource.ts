import { DataSource } from 'typeorm';
import { Note, Notebook, NoteContent, Preference, Theme } from '@clamcurry/common';
import log from 'electron-log';
import mainProcessService from '../service/MainProcessService';
import M1697914252167 from './migrations/M1697914252167';
import M1717512613677 from './migrations/M1717512613677';

const product = mainProcessService.isProduct();
const databasePath = mainProcessService.getDatabasePath();
log.info('databasePath', databasePath);

const datasource = new DataSource({
    type: 'sqlite',
    database: databasePath,
    entities: [Preference, Theme, Notebook, Note, NoteContent],
    migrations: [M1697914252167, M1717512613677],
    migrationsRun: true,
    logger: 'advanced-console',
    logging: !product,
    dropSchema: !product,
});

export default datasource;
