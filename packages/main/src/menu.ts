import { app, BrowserWindow, Menu, MenuItem } from 'electron';
import mainProcessService from './service/MainProcessService';

const handlePreferenceMenuEvent = (menuItem: MenuItem, browserWindow: BrowserWindow) => {
    if (!menuItem.enabled) {
        return;
    }
    browserWindow?.webContents?.send('mainEventService.handlePreferenceMenuEvent');
};

const handleThemeMenuEvent = (menuItem: MenuItem, browserWindow: BrowserWindow) => {
    if (!menuItem.enabled) {
        return;
    }
    browserWindow?.webContents?.send('mainEventService.handleThemeMenuEvent');
};

const handleNewNoteEvent = (menuItem: MenuItem, browserWindow: BrowserWindow) => {
    if (!menuItem.enabled) {
        return;
    }
    browserWindow?.webContents?.send('mainEventService.handleNewNoteMenuEvent');
};

const handleSearchNoteEvent = (menuItem: MenuItem, browserWindow: BrowserWindow) => {
    if (!menuItem.enabled) {
        return;
    }
    browserWindow?.webContents?.send('mainEventService.handleSearchNoteMenuEvent');
};

const handleCloseNoteEvent = (menuItem: MenuItem, browserWindow: BrowserWindow) => {
    if (!menuItem.enabled) {
        return;
    }
    browserWindow?.webContents?.send('mainEventService.handleCloseNoteMenuEvent');
};

const handleToggleSidebarEvent = (menuItem: MenuItem, browserWindow: BrowserWindow) => {
    if (!menuItem.enabled) {
        return;
    }
    browserWindow?.webContents?.send('mainEventService.handleToggleSidebarMenuEvent');
};

const handleToggleOutlineEvent = (menuItem: MenuItem, browserWindow: BrowserWindow) => {
    if (!menuItem.enabled) {
        return;
    }
    browserWindow?.webContents?.send('mainEventService.handleToggleOutlineMenuEvent');
};

const handleFeedbackEvent = (menuItem: MenuItem) => {
    if (!menuItem.enabled) {
        return;
    }
    mainProcessService.openLink('https://github.com/xuelingkang/clamcurry/issues');
};

const isMac = process.platform === 'darwin';

const menuTemplate = [
    new MenuItem({
        label: app.name,
        visible: isMac,
        enabled: isMac,
        submenu: [
            {
                label: `About ${app.name}`,
                role: 'about',
            },
            {
                type: 'separator',
            },
            {
                label: 'Preference Settings',
                accelerator: 'command+,',
                click: handlePreferenceMenuEvent,
            },
            {
                label: 'Theme Settings',
                accelerator: 'command+t',
                click: handleThemeMenuEvent,
            },
            {
                type: 'separator',
            },
            {
                label: `Hide ${app.name}`,
                role: 'hide',
            },
            {
                type: 'separator',
            },
            {
                label: `Quit ${app.name}`,
                role: 'quit',
            },
        ],
    }),
    new MenuItem({
        label: 'File',
        submenu: [
            {
                label: 'Preference Settings',
                visible: !isMac,
                enabled: !isMac,
                accelerator: 'ctrl+p',
                click: handlePreferenceMenuEvent,
            },
            {
                label: 'Theme Settings',
                visible: !isMac,
                enabled: !isMac,
                accelerator: 'ctrl+t',
                click: handleThemeMenuEvent,
            },
            {
                type: 'separator',
                visible: !isMac,
            },
            {
                label: 'New Note',
                accelerator: isMac ? 'command+n' : 'ctrl+n',
                click: handleNewNoteEvent,
            },
            {
                label: 'Search In Notebook',
                accelerator: isMac ? 'command+shift+f' : 'ctrl+shift+f',
                click: handleSearchNoteEvent,
            },
            {
                label: 'Close Note',
                accelerator: isMac ? 'command+w' : 'ctrl+w',
                click: handleCloseNoteEvent,
            },
        ],
    }),
    new MenuItem({
        label: 'Edit',
        submenu: [
            {
                role: 'undo',
            },
            {
                role: 'redo',
            },
            {
                type: 'separator',
            },
            {
                role: 'cut',
            },
            {
                role: 'copy',
            },
            {
                role: 'paste',
            },
            {
                role: 'selectAll',
            },
        ],
    }),
    new MenuItem({
        label: 'View',
        submenu: [
            {
                label: 'Toggle Sidebar',
                accelerator: isMac ? 'command+1' : 'ctrl+1',
                click: handleToggleSidebarEvent,
            },
            {
                label: 'Toggle Outline',
                accelerator: isMac ? 'command+2' : 'ctrl+2',
                click: handleToggleOutlineEvent,
            },
            {
                type: 'separator',
            },
            {
                role: 'reload',
            },
            {
                role: 'forceReload',
            },
            {
                role: 'toggleDevTools',
            },
            {
                type: 'separator',
            },
            {
                role: 'resetZoom',
            },
            {
                role: 'zoomIn',
            },
            {
                role: 'zoomOut',
            },
            {
                type: 'separator',
                visible: isMac,
            },
            {
                role: 'togglefullscreen',
                visible: isMac,
                enabled: isMac,
            },
        ],
    }),
    new MenuItem({
        role: 'windowMenu',
    }),
    new MenuItem({
        label: 'Help',
        submenu: [
            {
                label: 'Feedback',
                click: handleFeedbackEvent,
            },
        ],
    }),
];

const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);
