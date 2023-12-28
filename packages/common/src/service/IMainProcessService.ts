import UploadFileDto from '../dto/UploadFileDto';

export default interface IMainProcessService {
    isProduct: () => boolean;
    getPlatform: () => string;
    getAssetsRoot: () => string;
    getAppAssetsRoot: () => string;
    getDatabasePath: () => string;
    upload: (file: UploadFileDto) => string;
    exportNote: (noteId: number) => Promise<boolean>;
    openLink: (link: string) => Promise<void>;
    closeWindow: () => Promise<void>;
}
