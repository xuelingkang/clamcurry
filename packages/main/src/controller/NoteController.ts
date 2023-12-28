import { ipcMain } from 'electron';
import { SaveNoteDto, UpdateNoteDto } from '@clamcurry/common';
import noteService from '../service/NoteService';

ipcMain.handle('noteService.findById', (_event, id: number) => noteService.findById(id));
ipcMain.handle('noteService.listByNotebookId', (_event, notebookId: number) =>
    noteService.listByNotebookId(notebookId),
);
ipcMain.handle('noteService.save', (_event, dto: SaveNoteDto) => noteService.save(dto));
ipcMain.handle('noteService.update', (_event, dto: UpdateNoteDto) => noteService.update(dto));
ipcMain.handle('noteService.updateBatch', (_event, dtoList: UpdateNoteDto[]) => noteService.updateBatch(dtoList));
ipcMain.handle('noteService.delete', (_event, id: number) => noteService.delete(id));
ipcMain.handle('noteService.refreshVisitTime', (_event, id: number) => noteService.refreshVisitTime(id));
ipcMain.handle('noteService.searchByKeyword', (_event, notebookId: number, keyword: string, limit: number) =>
    noteService.searchByKeyword(notebookId, keyword, limit),
);
ipcMain.handle('noteService.getContent', (_event, id: number) => noteService.getContent(id));
ipcMain.handle('noteService.updateContent', (_event, id: number, content: string) =>
    noteService.updateContent(id, content),
);
ipcMain.handle('noteService.handleCloseNote', (_event, id: number) => noteService.handleCloseNote(id));
