import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import ThemeBaseEnum from '../enums/ThemeBaseEnum';

@Entity({ name: 'theme' })
export default class Theme {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'base' })
    base: ThemeBaseEnum;

    @Column({ name: 'foreground1' })
    foreground1: string;

    @Column({ name: 'foreground2' })
    foreground2: string;

    @Column({ name: 'foreground3' })
    foreground3: string;

    @Column({ name: 'foreground4' })
    foreground4: string;

    @Column({ name: 'background1' })
    background1: string;

    @Column({ name: 'background2' })
    background2: string;

    @Column({ name: 'background3' })
    background3: string;

    @Column({ name: 'background4' })
    background4: string;

    @Column({ name: 'divider1' })
    divider1: string;

    @Column({ name: 'divider2' })
    divider2: string;

    @Column({ name: 'scrollbar' })
    scrollbar: string;

    @Column({ name: 'selection' })
    selection: string;

    @Column({ name: 'active_line' })
    activeLine: string;

    @Column({ name: 'line_number1' })
    lineNumber1: string;

    @Column({ name: 'line_number2' })
    lineNumber2: string;

    @Column({ name: 'highlighter1' })
    highlighter1: string;

    @Column({ name: 'highlighter2' })
    highlighter2: string;

    @Column({ name: 'highlighter3' })
    highlighter3: string;

    @Column({ name: 'highlighter4' })
    highlighter4: string;

    @Column({ name: 'highlighter5' })
    highlighter5: string;

    @Column({ name: 'highlighter6' })
    highlighter6: string;

    @Column({ name: 'primary' })
    primary: string;

    @Column({ name: 'secondary' })
    secondary: string;

    @Column({ name: 'success' })
    success: string;

    @Column({ name: 'info' })
    info: string;

    @Column({ name: 'warning' })
    warning: string;

    @Column({ name: 'error' })
    error: string;

    @Column({ name: 'preset' })
    preset: boolean;

    @Column({ name: 'create_time' })
    createTime: number;

    @Column({ name: 'update_time' })
    updateTime: number;
}
