import { ipcMain } from 'electron';
import { UploadFileDto } from '@clamcurry/common';
import mainProcessService from '../service/MainProcessService';

ipcMain.on('mainProcessService.isProduct', (event) => (event.returnValue = mainProcessService.isProduct()));
ipcMain.on('mainProcessService.getPlatform', (event) => (event.returnValue = mainProcessService.getPlatform()));
ipcMain.on('mainProcessService.getAssetsRoot', (event) => (event.returnValue = mainProcessService.getAssetsRoot()));
ipcMain.on(
    'mainProcessService.getAppAssetsRoot',
    (event) => (event.returnValue = mainProcessService.getAppAssetsRoot()),
);
ipcMain.on('mainProcessService.getDatabasePath', (event) => (event.returnValue = mainProcessService.getDatabasePath()));
ipcMain.on(
    'mainProcessService.upload',
    (event, file: UploadFileDto) => (event.returnValue = mainProcessService.upload(file)),
);
ipcMain.handle('mainProcessService.exportNote', (_event, noteId: number) => mainProcessService.exportNote(noteId));
ipcMain.handle('mainProcessService.openLink', (_event, link: string) => mainProcessService.openLink(link));
ipcMain.handle('mainProcessService.closeWindow', () => mainProcessService.closeWindow());
