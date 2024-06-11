import { ThemeVo } from '@clamcurry/common';
import { tags } from '@lezer/highlight';

const style = (theme: ThemeVo, fontSize: number) => {
    const {
        base,
        foreground1,
        foreground4,
        background2,
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
        theme: base,
        settings: {
            background: `#${background2}`,
            foreground: `#${foreground1}`,
            caret: `#${cursor}`,
            selection: `#${selection}`,
            selectionMatch: `#${selection}`,
            lineHighlight: `#${activeLine}`,
            gutterBackground: `#${background2}`,
            gutterForeground: `#${lineNumber1}`,
            gutterActiveForeground: `#${lineNumber2}`,
            gutterBorder: 'transparent',
            fontSize: `#${fontSize}px`,
        },
        styles: [
            { tag: tags.meta, color: `#${foreground1}` },
            { tag: tags.link, color: `#${foreground4}`, textDecoration: 'underline' },
            { tag: [tags.invalid], color: `#${highlighter1}` },
            {
                tag: [
                    tags.null,
                    tags.literal,
                    tags.moduleKeyword,
                    tags.controlKeyword,
                    tags.punctuation,
                    tags.separator,
                    tags.url,
                    tags.escape,
                    tags.regexp,
                ],
                color: `#${highlighter2}`,
            },
            {
                tag: [
                    tags.operator,
                    tags.keyword,
                    tags.operatorKeyword,
                    tags.modifier,
                    tags.color,
                    tags.name,
                    tags.constant(tags.name),
                    tags.standard(tags.name),
                    tags.definition(tags.name),
                    tags.standard(tags.tagName),
                    tags.special(tags.brace),
                    tags.atom,
                    tags.bool,
                    tags.variableName,
                    tags.special(tags.variableName),
                    tags.deleted,
                    tags.character,
                    tags.macroName,
                    tags.labelName,
                ],
                color: `#${highlighter3}`,
            },
            { tag: tags.heading, color: `#${highlighter3}`, fontWeight: 'bold' },
            {
                tag: [
                    tags.propertyName,
                    tags.function(tags.propertyName),
                    tags.definition(tags.typeName),
                    tags.string,
                    tags.special(tags.string),
                    tags.processingInstruction,
                    tags.inserted,
                ],
                color: `#${highlighter4}`,
            },
            {
                tag: [
                    tags.definition(tags.variableName),
                    tags.function(tags.variableName),
                    tags.attributeName,
                    tags.typeName,
                    tags.className,
                    tags.tagName,
                    tags.number,
                    tags.changed,
                    tags.annotation,
                    tags.self,
                    tags.namespace,
                ],
                color: `#${highlighter5}`,
            },
            { tag: [tags.angleBracket], color: `#${highlighter6}` },
            { tag: tags.comment, color: `#${highlighter6}`, fontStyle: 'italic' },
            { tag: tags.strong, fontWeight: 'bold' },
            { tag: tags.emphasis, fontStyle: 'italic' },
            { tag: tags.strikethrough, textDecoration: 'line-through' },
        ],
    };
};

export default style;
