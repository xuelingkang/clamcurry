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

if (process.platform === 'darwin') {
    // MacOS
    const menuTemplate = [
        new MenuItem({
            label: app.name,
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
                    label: 'New Note',
                    accelerator: 'command+n',
                    click: handleNewNoteEvent,
                },
                {
                    label: 'Search In Notebook',
                    accelerator: 'command+shift+f',
                    click: handleSearchNoteEvent,
                },
                {
                    label: 'Close Note',
                    accelerator: 'command+w',
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
                    accelerator: 'command+1',
                    click: handleToggleSidebarEvent,
                },
                {
                    label: 'Toggle Outline',
                    accelerator: 'command+2',
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
                },
                {
                    role: 'togglefullscreen',
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
} else {
    // Windows/Linux
    const menuTemplate = [
        new MenuItem({
            label: 'File',
            submenu: [
                {
                    label: 'Preference Settings',
                    accelerator: 'ctrl+p',
                    click: handlePreferenceMenuEvent,
                },
                {
                    label: 'Theme Settings',
                    accelerator: 'ctrl+t',
                    click: handleThemeMenuEvent,
                },
                {
                    type: 'separator',
                },
                {
                    label: 'New Note',
                    accelerator: 'ctrl+n',
                    click: handleNewNoteEvent,
                },
                {
                    label: 'Search In Notebook',
                    accelerator: 'ctrl+shift+f',
                    click: handleSearchNoteEvent,
                },
                {
                    label: 'Close Note',
                    accelerator: 'ctrl+w',
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
                    accelerator: 'ctrl+1',
                    click: handleToggleSidebarEvent,
                },
                {
                    label: 'Toggle Outline',
                    accelerator: 'ctrl+2',
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
            ],
        }),
        new MenuItem({
            label: 'Window',
            submenu: [
                {
                    role: 'minimize',
                },
                {
                    role: 'zoom',
                },
            ],
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
}
