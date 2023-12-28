import { IMainProcessService, NoteVo, ProtocolNameEnum, TimeUtils, UploadFileDto } from '@clamcurry/common';
import { app, BrowserWindow, dialog, SaveDialogOptions, shell } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import noteService from './NoteService';
import noteContentService from './NoteContentService';

class MainProcessService implements IMainProcessService {
    isProduct(): boolean {
        return app.isPackaged;
    }

    getPlatform(): string {
        return process.platform;
    }

    getAssetsRoot(): string {
        if (this.isProduct()) {
            return path.join(app.getPath('userData'), 'assets');
        }
        return path.join(process.cwd(), '..', '..', '.assets');
    }

    getAppAssetsRoot(): string {
        if (this.isProduct()) {
            return path.join(process.resourcesPath, 'assets');
        }
        return path.join(process.cwd(), 'assets');
    }

    getDatabasePath(): string {
        return path.join(this.getAssetsRoot(), 'data');
    }

    upload(file: UploadFileDto): string {
        const assetsRoot = this.getAssetsRoot();
        let timestamp = TimeUtils.currentTimeMillis();
        let shortPath = path.join(file.prefix, timestamp.toString() + '_' + file.name);
        while (fs.existsSync(path.join(assetsRoot, shortPath))) {
            timestamp++;
            shortPath = path.join(file.prefix, timestamp.toString() + '_' + file.name);
        }
        fs.cpSync(file.path, path.join(assetsRoot, shortPath));
        return `http://${ProtocolNameEnum.LOCAL_ASSETS}/${shortPath}`;
    }

    async exportNote(noteId: number): Promise<boolean> {
        const note = await noteService.findById(noteId);
        const options: SaveDialogOptions = {
            title: 'Export Note',
            defaultPath: note.title + ' - ' + TimeUtils.now('YYYYMMDDHHmmss'),
            properties: ['showOverwriteConfirmation'],
        };
        const { canceled, filePath } = await dialog.showSaveDialog(BrowserWindow.getAllWindows()[0], options);
        if (canceled) {
            return false;
        }
        await this.doExportNote(note, filePath);
        return true;
    }

    async openLink(link: string): Promise<void> {
        await shell.openExternal(link);
    }

    async closeWindow(): Promise<void> {
        BrowserWindow.getFocusedWindow().close();
    }

    private async doExportNote(note: NoteVo, outputDir: string): Promise<void> {
        const { content, assetsDir, assets } = await noteContentService.getContentForExport(note.id);

        // create outputDir
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // create assetsDir
        if (assets && assets.length) {
            const absoluteAssetsDir = path.join(outputDir, assetsDir);
            if (!fs.existsSync(absoluteAssetsDir)) {
                fs.mkdirSync(absoluteAssetsDir);
            }
        }

        // write note content
        const noteFilePath = path.join(outputDir, note.title + '.md');
        fs.writeFileSync(noteFilePath, content, 'utf-8');

        // copy assets
        const assetsRoot = this.getAssetsRoot();
        for (const asset of assets) {
            const from = path.join(assetsRoot, asset.from);
            const to = path.join(outputDir, asset.to);
            fs.copyFileSync(from, to);
        }
    }
}

export default new MainProcessService();
