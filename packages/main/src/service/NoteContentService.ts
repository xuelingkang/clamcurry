import { NoteContent, ProtocolNameEnum, TimeUtils } from '@clamcurry/common';
import log from 'electron-log';
import path from 'node:path';
import TrashUtils from '../utils/TrashUtils';
import noteContentDao from '../dao/NoteContentDao';

export class ExportAssetData {
    from: string;
    to: string;
}

export class ExportData {
    content: string;
    assetsDir: string;
    assets: ExportAssetData[];
}

class NoteContentService {
    private contents = new Map<number, string>();
    private changeTimes = new Map<number, number>();
    private flushTimes = new Map<number, number>();
    private flushing = false;

    private assetRegex = new RegExp(
        `!\\[(.*?)]\\((http:\\/\\/${ProtocolNameEnum.LOCAL_ASSETS}\\/)(\\S*?)(\\s+("(.*)")?)?\\)`,
        'mg',
    );

    constructor() {
        setInterval(() => {
            if (this.flushing) {
                return;
            }
            this.flushing = true;
            this.flushBuffers().then(() => (this.flushing = false));
        }, 5000);
    }

    addBuffer(id: number, content: string): void {
        this.contents.set(id, content);
        this.changeTimes.set(id, TimeUtils.currentTimeMillis());
    }

    async removeBuffer(id: number): Promise<void> {
        await this.flushBuffer(id);
        this.contents.delete(id);
        this.changeTimes.delete(id);
        this.flushTimes.delete(id);
    }

    async getContent(id: number): Promise<string> {
        const content = this.contents.get(id);
        if (content !== undefined) {
            return content;
        }
        const contentInDB = await this.getContentFromDB(id);
        this.contents.set(id, contentInDB);
        return contentInDB;
    }

    async getContentForExport(id: number): Promise<ExportData> {
        let content = await this.getContent(id);
        const assets: ExportAssetData[] = [];
        let index = 0;
        const assetsDir = 'assets';
        content = content.replace(this.assetRegex, (_matched, ...args) => {
            const imageName = args[0];
            const imagePath = args[2];
            const imageTitle = args[3];
            const targetImagePath = path.join(assetsDir, ++index + imagePath.substring(imagePath.lastIndexOf('.')));
            assets.push({
                from: imagePath,
                to: targetImagePath,
            });
            return `![${imageName}](./${targetImagePath}${imageTitle || ''})`;
        });
        return { content, assetsDir, assets };
    }

    async flushBuffers(): Promise<void> {
        const promises = [];
        for (const id of this.contents.keys()) {
            promises.push(this.flushBuffer(id));
        }
        await Promise.all(promises);
    }

    async getAssets(ids: number[]): Promise<string[]> {
        const promises = [];
        for (const id of ids) {
            const content = this.contents.get(id);
            if (content !== undefined) {
                promises.push(this.flushBuffer(id));
            }
        }
        if (promises.length) {
            await Promise.all(promises);
        }
        const assets: string[] = [];
        const noteContents = await noteContentDao.listByIds(ids);
        for (const noteContent of noteContents) {
            let matcher: RegExpExecArray | null;
            while ((matcher = this.assetRegex.exec(noteContent.content)) !== null) {
                const asset = matcher[3];
                assets.push(asset);
            }
        }
        return assets;
    }

    private async flushBuffer(id: number): Promise<void> {
        // get current time before get content
        const now = TimeUtils.currentTimeMillis();
        const content = this.contents.get(id);
        if (content === undefined) {
            return;
        }
        const changeTime = this.changeTimes.get(id) || 0;
        const flushTime = this.flushTimes.get(id) || 0;
        if (flushTime >= changeTime) {
            return;
        }
        // trash assets
        const originalContent = await this.getContentFromDB(id);
        const originalAssets: string[] = [];
        let matcher: RegExpExecArray | null;
        while ((matcher = this.assetRegex.exec(originalContent)) !== null) {
            const asset = matcher[3];
            originalAssets.push(asset);
        }
        const newAssets: string[] = [];
        while ((matcher = this.assetRegex.exec(content)) !== null) {
            const asset = matcher[3];
            newAssets.push(asset);
        }
        if (originalAssets.length) {
            TrashUtils.add(originalAssets);
        }
        if (newAssets.length) {
            TrashUtils.delete(newAssets);
        }
        const noteContent = new NoteContent();
        noteContent.id = id;
        noteContent.content = content;
        try {
            await noteContentDao.updateById(noteContent);
            this.flushTimes.set(id, now);
        } catch (e) {
            log.error('update note content error', e);
        }
    }

    private async getContentFromDB(id: number): Promise<string> {
        try {
            const noteContent = await noteContentDao.findById(id);
            return noteContent.content;
        } catch (e) {
            throw 'database error';
        }
    }
}

export default new NoteContentService();
