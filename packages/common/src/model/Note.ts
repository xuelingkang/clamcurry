import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'note' })
export default class Note {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'parent_id' })
    parentId: number;

    @Column({ name: 'notebook_id' })
    notebookId: number;

    @Column({ name: 'ordinal' })
    ordinal: number;

    @Column({ name: 'create_time' })
    createTime: number;

    @Column({ name: 'update_time' })
    updateTime: number;

    @Column({ name: 'visit_time' })
    visitTime: number;
}
