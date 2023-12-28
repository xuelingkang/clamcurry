import { ipcMain } from 'electron';
import { SaveNotebookDto, UpdateNotebookDto } from '@clamcurry/common';
import notebookService from '../service/NotebookService';

ipcMain.handle('notebookService.findAll', () => notebookService.findAll());
ipcMain.handle('notebookService.findById', (_event, id: number) => notebookService.findById(id));
ipcMain.handle('notebookService.enable', (_event, id: number) => notebookService.enable(id));
ipcMain.handle('notebookService.save', (_event, dto: SaveNotebookDto) => notebookService.save(dto));
ipcMain.handle('notebookService.update', (_event, dto: UpdateNotebookDto) => notebookService.update(dto));
ipcMain.handle('notebookService.delete', (_event, id: number) => notebookService.delete(id));
