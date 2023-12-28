import ThemeBaseEnum from '../enums/ThemeBaseEnum';

export default class SaveThemeDto {
    name: string;
    base: ThemeBaseEnum;
    foreground1: string;
    foreground2: string;
    foreground3: string;
    foreground4: string;
    background1: string;
    background2: string;
    background3: string;
    background4: string;
    divider1: string;
    divider2: string;
    scrollbar: string;
    selection: string;
    activeLine: string;
    lineNumber1: string;
    lineNumber2: string;
    highlighter1: string;
    highlighter2: string;
    highlighter3: string;
    highlighter4: string;
    highlighter5: string;
    highlighter6: string;
    primary: string;
    secondary: string;
    success: string;
    info: string;
    warning: string;
    error: string;
}
