import fs from 'node:fs';
import path from 'node:path';
import mainProcessService from '../service/MainProcessService';

class TrashUtils {
    private static readonly MAX_LENGTH = 1000;
    private static assetsForClean = new Array<string>();

    static add(assets: string[]): void {
        TrashUtils.delete(assets);
        for (const asset of assets) {
            TrashUtils.assetsForClean.push(asset);
            // check length
            while (TrashUtils.assetsForClean.length > TrashUtils.MAX_LENGTH) {
                const deleted = TrashUtils.assetsForClean.splice(0, 1);
                TrashUtils.unlink(deleted[0]);
            }
        }
    }

    static delete(assets: string[]): void {
        for (const asset of assets) {
            const index = TrashUtils.assetsForClean.findIndex((value) => value === asset);
            if (index < 0) {
                continue;
            }
            TrashUtils.assetsForClean.splice(index, 1);
        }
    }

    static clean(): void {
        TrashUtils.assetsForClean.forEach(TrashUtils.unlink);
    }

    static cleanImmediately(assets: string[]): void {
        if (!assets || !assets.length) {
            return;
        }
        assets.forEach(TrashUtils.unlink);
    }

    private static unlink(asset: string): void {
        const assetsRoot = mainProcessService.getAssetsRoot();
        const url = path.join(assetsRoot, asset);
        if (fs.existsSync(url)) {
            fs.unlinkSync(url);
        }
    }
}

export default TrashUtils;
