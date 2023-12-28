import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'note_content' })
export default class NoteContent {
    @PrimaryColumn({ name: 'id' })
    id: number;

    @Column({ name: 'notebook_id' })
    notebookId: number;

    @Column({ name: 'content' })
    content: string;
}
