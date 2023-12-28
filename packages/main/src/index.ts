// Modules to control application life and create native browser window
import { app, BrowserWindow, net, protocol, session } from 'electron';
import * as path from 'path';
import * as url from 'url';
import datasource from './database/datasource';
import { ProtocolNameEnum } from '@clamcurry/common';
import TrashUtils from './utils/TrashUtils';
import noteContentService from './service/NoteContentService';
import mainProcessService from './service/MainProcessService';

function createWindow() {
    // Create the browser window.
    const window = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    window.maximize();
    window.show();

    // and load the index.html of the app.
    const startUrl =
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '..', 'renderer', 'index.html'),
            protocol: 'file:',
            slashes: true,
        });

    require('./menu');

    window.loadURL(startUrl);

    // Open the DevTools.
    // window.webContents.openDevTools()

    window.on('close', async function () {
        await noteContentService.flushBuffers().then(TrashUtils.clean);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady()
    .then(() => {
        if (!app.isPackaged) {
            return require('./devtools');
        }
    })
    .then(() => datasource.initialize())
    .then(() => {
        createWindow();

        app.on('activate', function () {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    })
    .then(() => {
        /*
         * 1. Main process can intercept http request, but cannot redirect it to a local file.
         * 2. Main process can customize a protocol to access the image file.
         * 3. Image element in markdown file does not support custom protocol.
         * In summary:
         * Visit image files by http url with a special prefix.
         * Main process intercept this request then redirects it to the custom protocol.
         */
        const assetsRoot = mainProcessService.getAssetsRoot();
        const protocolPrefix = `${ProtocolNameEnum.LOCAL_ASSETS}://`;
        const protocolPrefixLength = protocolPrefix.length;
        const httpPrefix = `http://${ProtocolNameEnum.LOCAL_ASSETS}/`;
        const httpPrefixLength = httpPrefix.length;
        protocol.handle(ProtocolNameEnum.LOCAL_ASSETS, (request) => {
            const url = path.join(assetsRoot, request.url.substring(protocolPrefixLength));
            return net.fetch('file://' + url);
        });
        const filter = {
            urls: [`${httpPrefix}*`],
        };
        session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
            const name = details.url.substring(httpPrefixLength);
            const redirectURL = protocolPrefix + name;
            callback({ redirectURL: redirectURL });
        });
    });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
require('./controller/PreferenceController');
require('./controller/ThemeController');
require('./controller/NotebookController');
require('./controller/NoteController');
require('./controller/MainProcessController');
