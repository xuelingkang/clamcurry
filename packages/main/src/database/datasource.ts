import { DataSource } from 'typeorm';
import { Note, Notebook, NoteContent, Preference, Theme } from '@clamcurry/common';
import log from 'electron-log';
import M1697914252167 from './migrations/M1697914252167';
import mainProcessService from '../service/MainProcessService';

const product = mainProcessService.isProduct();
const databasePath = mainProcessService.getDatabasePath();
log.info('databasePath', databasePath);

const datasource = new DataSource({
    type: 'sqlite',
    database: databasePath,
    entities: [Preference, Theme, Notebook, Note, NoteContent],
    migrations: [M1697914252167],
    migrationsRun: true,
    logger: 'advanced-console',
    logging: !product,
    dropSchema: !product,
});

export default datasource;
