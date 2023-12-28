/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
import { contextBridge, ipcRenderer } from 'electron';
import {
    SaveNotebookDto,
    SaveNoteDto,
    SaveThemeDto,
    UpdateNotebookDto,
    UpdateNoteDto,
    UpdatePreferenceDto,
    UpdateThemeDto,
    UploadFileDto,
} from '@clamcurry/common';

contextBridge.exposeInMainWorld('preferenceService', {
    find: (id: number) => ipcRenderer.invoke('preferenceService.find', id),
    update: (dto: UpdatePreferenceDto) => ipcRenderer.invoke('preferenceService.update', dto),
});

contextBridge.exposeInMainWorld('themeService', {
    findAll: () => ipcRenderer.invoke('themeService.findAll'),
    findById: (id: number) => ipcRenderer.invoke('themeService.findById', id),
    save: (dto: SaveThemeDto) => ipcRenderer.invoke('themeService.save', dto),
    update: (dto: UpdateThemeDto) => ipcRenderer.invoke('themeService.update', dto),
    delete: (id: number) => ipcRenderer.invoke('themeService.delete', id),
});

contextBridge.exposeInMainWorld('notebookService', {
    findAll: () => ipcRenderer.invoke('notebookService.findAll'),
    findById: (id: number) => ipcRenderer.invoke('notebookService.findById', id),
    enable: (id: number) => ipcRenderer.invoke('notebookService.enable', id),
    save: (dto: SaveNotebookDto) => ipcRenderer.invoke('notebookService.save', dto),
    update: (dto: UpdateNotebookDto) => ipcRenderer.invoke('notebookService.update', dto),
    delete: (id: number) => ipcRenderer.invoke('notebookService.delete', id),
});

contextBridge.exposeInMainWorld('noteService', {
    findById: (id: number) => ipcRenderer.invoke('noteService.findById', id),
    listByNotebookId: (notebookId: number) => ipcRenderer.invoke('noteService.listByNotebookId', notebookId),
    save: (dto: SaveNoteDto) => ipcRenderer.invoke('noteService.save', dto),
    update: (dto: UpdateNoteDto) => ipcRenderer.invoke('noteService.update', dto),
    updateBatch: (dtoList: UpdateNoteDto[]) => ipcRenderer.invoke('noteService.updateBatch', dtoList),
    delete: (id: number) => ipcRenderer.invoke('noteService.delete', id),
    refreshVisitTime: (id: number) => ipcRenderer.invoke('noteService.refreshVisitTime', id),
    searchByKeyword: (notebookId: number, keyword: string, limit: number) =>
        ipcRenderer.invoke('noteService.searchByKeyword', notebookId, keyword, limit),
    getContent: (id: number) => ipcRenderer.invoke('noteService.getContent', id),
    updateContent: (id: number, content: string) => ipcRenderer.invoke('noteService.updateContent', id, content),
    handleCloseNote: (id: number) => ipcRenderer.invoke('noteService.handleCloseNote', id),
});

contextBridge.exposeInMainWorld('mainProcessService', {
    isProduct: () => ipcRenderer.sendSync('mainProcessService.isProduct'),
    getPlatform: () => ipcRenderer.sendSync('mainProcessService.getPlatform'),
    getAssetsRoot: () => ipcRenderer.sendSync('mainProcessService.getAssetsRoot'),
    getAppAssetsRoot: () => ipcRenderer.sendSync('mainProcessService.getAppAssetsRoot'),
    getDatabasePath: () => ipcRenderer.sendSync('mainProcessService.getDatabasePath'),
    upload: (file: UploadFileDto) => ipcRenderer.sendSync('mainProcessService.upload', file),
    exportNote: (noteId: number) => ipcRenderer.invoke('mainProcessService.exportNote', noteId),
    openLink: (link: string) => ipcRenderer.invoke('mainProcessService.openLink', link),
    closeWindow: () => ipcRenderer.invoke('mainProcessService.closeWindow'),
});

contextBridge.exposeInMainWorld('mainEventService', {
    handlePreferenceMenuEvent: (handler: () => void) =>
        ipcRenderer.on('mainEventService.handlePreferenceMenuEvent', handler),
    handleThemeMenuEvent: (handler: () => void) => ipcRenderer.on('mainEventService.handleThemeMenuEvent', handler),
    handleNewNoteMenuEvent: (handler: () => void) => ipcRenderer.on('mainEventService.handleNewNoteMenuEvent', handler),
    handleSearchNoteMenuEvent: (handler: () => void) =>
        ipcRenderer.on('mainEventService.handleSearchNoteMenuEvent', handler),
    handleCloseNoteMenuEvent: (handler: () => void) =>
        ipcRenderer.on('mainEventService.handleCloseNoteMenuEvent', handler),
    handleToggleSidebarMenuEvent: (handler: () => void) =>
        ipcRenderer.on('mainEventService.handleToggleSidebarMenuEvent', handler),
    handleToggleOutlineMenuEvent: (handler: () => void) =>
        ipcRenderer.on('mainEventService.handleToggleOutlineMenuEvent', handler),
    removePreferenceMenuEventListener: () =>
        ipcRenderer.removeAllListeners('mainEventService.handlePreferenceMenuEvent'),
    removeThemeMenuEventListener: () => ipcRenderer.removeAllListeners('mainEventService.handleThemeMenuEvent'),
    removeNewNoteMenuEventListener: () => ipcRenderer.removeAllListeners('mainEventService.handleNewNoteMenuEvent'),
    removeSearchNoteMenuEventListener: () =>
        ipcRenderer.removeAllListeners('mainEventService.handleSearchNoteMenuEvent'),
    removeCloseNoteMenuEvent: () => ipcRenderer.removeAllListeners('mainEventService.handleCloseNoteMenuEvent'),
    removeToggleSidebarMenuEventListener: () =>
        ipcRenderer.removeAllListeners('mainEventService.handleToggleSidebarMenuEvent'),
    removeToggleOutlineMenuEventListener: () =>
        ipcRenderer.removeAllListeners('mainEventService.handleToggleOutlineMenuEvent'),
});

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
    }
});
