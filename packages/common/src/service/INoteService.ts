import NoteVo from '../vo/NoteVo';
import SaveNoteDto from '../dto/SaveNoteDto';
import UpdateNoteDto from '../dto/UpdateNoteDto';

export default interface INoteService {
    findById: (id: number) => Promise<NoteVo>;
    listByNotebookId: (notebookId: number) => Promise<NoteVo[]>;
    save: (dto: SaveNoteDto) => Promise<number>;
    update: (dto: UpdateNoteDto) => Promise<void>;
    updateBatch: (dtoList: UpdateNoteDto[]) => Promise<void>;
    delete: (id: number) => Promise<number[]>;
    refreshVisitTime: (id: number) => Promise<void>;
    searchByKeyword: (notebookId: number, keyword: string, limit: number) => Promise<NoteVo[]>;
    getContent: (id: number) => Promise<string>;
    updateContent: (id: number, content: string) => void;
    handleCloseNote: (id: number) => Promise<void>;
}
