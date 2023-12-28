import fs from 'node:fs';
import path from 'node:path';
import mainProcessService from '../service/MainProcessService';

class TrashUtils {
    private static assetsForClean = new Set<string>();

    static add(assets: string[]): void {
        for (const asset of assets) {
            TrashUtils.assetsForClean.add(asset);
        }
    }

    static delete(assets: string[]): void {
        for (const asset of assets) {
            TrashUtils.assetsForClean.delete(asset);
        }
    }

    static clean(): void {
        const assetsRoot = mainProcessService.getAssetsRoot();
        TrashUtils.assetsForClean.forEach((asset) => {
            const url = path.join(assetsRoot, asset);
            if (fs.existsSync(url)) {
                fs.unlinkSync(url);
            }
        });
    }

    static cleanImmediately(assets: string[]): void {
        if (!assets || !assets.length) {
            return;
        }
        const assetsRoot = mainProcessService.getAssetsRoot();
        assets.forEach((asset) => {
            const url = path.join(assetsRoot, asset);
            if (fs.existsSync(url)) {
                fs.unlinkSync(url);
            }
        });
    }
}

export default TrashUtils;
