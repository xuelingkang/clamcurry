import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'notebook' })
export default class Notebook {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'enabled' })
    enabled: boolean;

    @Column({ name: 'create_time' })
    createTime: number;

    @Column({ name: 'update_time' })
    updateTime: number;
}
