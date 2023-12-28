import NotebookVo from '../vo/NotebookVo';
import SaveNotebookDto from '../dto/SaveNotebookDto';
import UpdateNotebookDto from '../dto/UpdateNotebookDto';

export default interface INotebookService {
    findAll: () => Promise<NotebookVo[]>;
    findById: (id: number) => Promise<NotebookVo>;
    enable: (id: number) => Promise<void>;
    save: (dto: SaveNotebookDto) => Promise<number>;
    update: (dto: UpdateNotebookDto) => Promise<void>;
    delete: (id: number) => Promise<void>;
}
