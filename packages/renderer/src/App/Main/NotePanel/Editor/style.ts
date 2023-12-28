import { ThemeBaseEnum, ThemeVo } from '@clamcurry/common';

const style = (theme: ThemeVo) => {
    const {
        base,
        foreground1,
        background2,
        background3,
        scrollbar,
        selection,
        activeLine,
        lineNumber1,
        lineNumber2,
        highlighter1,
        highlighter2,
        highlighter3,
        highlighter4,
        highlighter5,
        highlighter6,
    } = theme;
    // reverse background color
    const cursor = (0xffffff - parseInt(background2.substring(0, 6), 16)).toString(16).padStart(6, '0');
    return {
        base: base === ThemeBaseEnum.LIGHT ? 'vs' : 'vs-dark',
        inherit: false,
        rules: [
            {
                foreground: highlighter1,
                token: 'string',
            },
            {
                foreground: highlighter1,
                token: 'attribute.value',
            },
            {
                foreground: highlighter2,
                token: 'number',
            },
            {
                foreground: highlighter2,
                token: 'attribute.value.number',
            },
            {
                foreground: highlighter3,
                fontStyle: 'bold',
                token: 'keyword',
            },
            {
                foreground: highlighter4,
                token: 'type',
            },
            {
                foreground: highlighter5,
                token: 'attribute.name',
            },
            {
                foreground: highlighter6,
                fontStyle: 'italic',
                token: 'comment',
            },
        ],
        colors: {
            'editor.foreground': `#${foreground1}`,
            'editor.background': `#${background2}`,
            'input.foreground': `#${foreground1}`,
            'input.background': `#${background3}`,
            'editor.selectionBackground': `#${selection}`,
            'editor.lineHighlightBackground': `#${activeLine}`,
            'editorCursor.foreground': `#${cursor}`,
            'editorWhitespace.foreground': `#${selection}`,
            'editorLineNumber.foreground': `#${lineNumber1}`,
            'editorLineNumber.activeForeground': `#${lineNumber2}`,
            'scrollbarSlider.background': `#${scrollbar}`,
            'scrollbarSlider.hoverBackground': `#${scrollbar}`,
            'scrollbarSlider.activeBackground': `#${scrollbar}`,
        },
    };
};

export default style;
