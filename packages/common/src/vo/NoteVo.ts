export default class NoteVo {
    id: number;
    title: string;
    parentId: number;
    notebookId: number;
    ordinal: number;
    createTime: number;
    updateTime: number;
    visitTime: number;
    children?: NoteVo[];
}
