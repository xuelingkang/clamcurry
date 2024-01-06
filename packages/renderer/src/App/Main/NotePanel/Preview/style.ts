import { ThemeVo } from '@clamcurry/common';

const style = (theme: ThemeVo, markdownPaddingRight: string) => {
    const {
        foreground1,
        foreground2,
        foreground3,
        foreground4,
        background2,
        background3,
        background4,
        divider1,
        divider2,
        selection,
        lineNumber1,
        highlighter1,
        highlighter2,
        highlighter3,
        highlighter4,
        highlighter5,
        highlighter6,
    } = theme;
    return {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: `#${background2}`,
        '*::selection': {
            backgroundColor: `#${selection}`,
        },
        '.markdown': {
            position: 'relative',
            width: '100%',
            height: '100%',
            userSelect: 'text',
            paddingLeft: '0.5rem',
            paddingRight: markdownPaddingRight,
            overflow: 'auto',
            wordBreak: 'break-word',
            wordWrap: 'break-word',
            color: `#${foreground2}`,
            fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
            fontSize: '1rem',
            lineHeight: 1.5,
            'details,figcaption,figure': {
                display: 'block',
            },
            summary: {
                display: 'list-item',
            },
            '[hidden]': {
                display: 'none!important',
            },
            a: {
                backgroundColor: 'transparent',
                color: `#${foreground4}`,
                textDecoration: 'none',
            },
            'abbr[title]': {
                borderBottom: 'none',
                WebkitTextDecoration: 'underline dotted',
                textDecoration: 'underline dotted',
            },
            'b,strong': {
                fontWeight: 600,
            },
            dfn: {
                fontStyle: 'italic',
            },
            h1: {
                margin: '0.67rem 0',
                fontWeight: 600,
                paddingBottom: '0.3rem',
                fontSize: '2rem',
                borderBottom: `1px solid #${divider2}`,
            },
            small: {
                fontSize: '0.9rem',
            },
            'sub,sup': {
                fontSize: '0.75rem',
                lineHeight: 0,
                position: 'relative',
                verticalAlign: 'baseline',
            },
            sub: {
                bottom: '-0.25rem',
            },
            sup: {
                top: '-0.5rem',
            },
            img: {
                borderStyle: 'none',
                maxWidth: '100%',
                boxSizing: 'content-box',
                backgroundColor: `#${background2}`,
            },
            'kbd,samp': {
                fontFamily: 'monospace',
                fontSize: '1rem',
            },
            figure: {
                margin: '1rem 2.5rem',
            },
            hr: {
                boxSizing: 'content-box',
                overflow: 'hidden',
                background: 'transparent',
                border: 0,
                backgroundColor: `#${divider1}`,
                borderBottom: `1px solid #${divider2}`,
                height: '0.25rem',
                padding: 0,
                margin: '1.5rem 0',
            },
            input: {
                font: 'inherit',
                margin: 0,
                overflow: 'visible',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
            },
            '[type=button],[type=reset],[type=submit]': {
                WebkitAppearance: 'button',
            },
            '[type=checkbox],[type=radio]': {
                boxSizing: 'border-box',
                padding: 0,
            },
            '[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button': {
                height: 'auto',
            },
            '[type=search]::-webkit-search-cancel-button,[type=search]::-webkit-search-decoration': {
                WebkitAppearance: 'none',
            },
            '::-webkit-input-placeholder': {
                WebkitAppearance: 'button',
            },
            'a:hover': {
                textDecoration: 'underline',
            },
            '::placeholder': {
                color: `#${foreground3}`,
                opacity: 1,
            },
            'hr::before': {
                display: 'table',
                content: '""',
            },
            'hr::after': {
                display: 'table',
                clear: 'both',
                content: '""',
            },
            table: {
                borderSpacing: 0,
                borderCollapse: 'collapse',
                display: 'block',
                width: 'max-content',
                maxWidth: '100%',
                overflow: 'auto',
                th: {
                    fontWeight: 600,
                },
                tr: {
                    backgroundColor: `#${background2}`,
                    borderTop: `1px solid #${divider2}`,
                },
                'th,td': {
                    padding: '0.375rem 0.8125rem',
                    border: `1px solid #${divider1}`,
                },
                'td > :last-child': {
                    marginBottom: 0,
                },
                'tr:nth-of-type(2n)': {
                    backgroundColor: `#${background3}`,
                },
                img: {
                    backgroundColor: 'transparent',
                },
            },
            'td,th': {
                padding: 0,
            },
            details: {
                summary: {
                    cursor: 'pointer',
                },
            },
            'details:not([open]) > *:not(summary)': {
                display: 'none!important',
            },
            'a:focus,[role=button]:focus,input[type=radio]:focus,input[type=checkbox]:focus': {
                outline: `2px solid #${foreground4}`,
                outlineOffset: '-2px',
                boxShadow: 'none',
            },
            'a:focus:not(:focus-visible),[role=button]:focus:not(:focus-visible),input[type=radio]:focus:not(:focus-visible),input[type=checkbox]:focus:not(:focus-visible)':
                {
                    outline: 'solid 1px transparent',
                },
            'a:focus-visible,[role=button]:focus-visible,input[type=radio]:focus-visible,input[type=checkbox]:focus-visible':
                {
                    outline: `2px solid #${foreground4}`,
                    outlineOffset: '-2px',
                    boxShadow: 'none',
                },
            'a:not([class]):focus,a:not([class]):focus-visible,input[type=radio]:focus,input[type=radio]:focus-visible,input[type=checkbox]:focus,input[type=checkbox]:focus-visible':
                {
                    outlineOffset: 0,
                },
            kbd: {
                display: 'inline-block',
                padding: '0.1875rem 0.3125rem',
                fontSize: '0.6875rem',
                fontFamily: 'monospace',
                lineHeight: '0.625rem',
                color: `#${foreground2}`,
                verticalAlign: 'middle',
                backgroundColor: `#${background3}`,
                border: `solid 1px #${background4}`,
                borderBottomColor: `#${background4}`,
                borderRadius: '0.375rem',
                boxShadow: `inset 0 -1px 0 #${background4}`,
            },
            'h1,h2,h3,h4,h5,h6': {
                marginTop: '1.5rem',
                marginBottom: '1rem',
                fontWeight: 600,
                lineHeight: 1.25,
            },
            h2: {
                fontWeight: 600,
                paddingBottom: '0.3rem',
                fontSize: '1.5rem',
                borderBottom: `1px solid #${divider2}`,
            },
            h3: {
                fontWeight: 600,
                fontSize: '1.25rem',
            },
            h4: {
                fontWeight: 600,
                fontSize: '1rem',
            },
            h5: {
                fontWeight: 600,
                fontSize: '0.875rem',
            },
            h6: {
                fontWeight: 600,
                fontSize: '0.85rem',
                color: `#${foreground3}`,
            },
            p: {
                marginTop: 0,
                marginBottom: '0.625rem',
            },
            blockquote: {
                margin: 0,
                padding: '0 1rem',
                color: `#${foreground3}`,
                borderLeft: `0.25rem solid #${divider1}`,
                '> :first-of-type': {
                    marginTop: 0,
                },
                '> :last-child': {
                    marginBottom: 0,
                },
            },
            'ul,ol': {
                marginTop: 0,
                marginBottom: 0,
                paddingLeft: '2rem',
            },
            'ol ol, ul ul': {
                listStyleType: 'lower-roman',
            },
            'ul ul ol,ul ol ol,ol ul ol,ol ol ol': {
                listStyleType: 'lower-alpha',
            },
            dd: {
                marginLeft: 0,
            },
            'tt,samp': {
                fontFamily: 'monospace',
                fontSize: '0.75rem',
            },
            'input::-webkit-outer-spin-button,input::-webkit-inner-spin-button': {
                margin: 0,
                WebkitAppearance: 'none',
                appearance: 'none',
            },
            '> *:first-of-type': {
                marginTop: '0!important',
            },
            '> *:last-child': {
                marginBottom: '0!important',
            },
            'a:not([href])': {
                color: 'inherit',
                textDecoration: 'none',
            },
            'p,blockquote,ul,ol,dl,table,pre,details': {
                marginTop: 0,
                marginBottom: '1rem',
            },
            'h1 tt,h1 code,h2 tt,h2 code,h3 tt,h3 code,h4 tt,h4 code,h5 tt,h5 code,h6 tt,h6 code': {
                padding: '0 0.2rem',
                fontSize: 'inherit',
            },
            'summary h1,summary h2,summary h3,summary h4,summary h5,summary h6': {
                display: 'inline-block',
            },
            'summary h1, summary h2': {
                paddingBottom: 0,
                borderBottom: 0,
            },
            'ol[type="a s"]': {
                listStyleType: 'lower-alpha',
            },
            'ol[type="A s"]': {
                listStyleType: 'upper-alpha',
            },
            'ol[type="i s"]': {
                listStyleType: 'lower-roman',
            },
            'ol[type="I s"]': {
                listStyleType: 'upper-roman',
            },
            'ol[type="1"]': {
                listStyleType: 'decimal',
            },
            div: {
                '> ol:not([type])': {
                    listStyleType: 'decimal',
                },
            },
            'ul ul,ul ol,ol ol,ol ul': {
                marginTop: 0,
                marginBottom: 0,
            },
            li: {
                '> p': {
                    marginTop: '1rem',
                },
                '+ li': {
                    marginTop: '0.25rem',
                },
            },
            dl: {
                padding: 0,
                dt: {
                    padding: 0,
                    marginTop: '1rem',
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    fontWeight: 600,
                },
                dd: {
                    padding: '0 1rem',
                    marginBottom: '1rem',
                },
            },
            'img[align=right]': {
                paddingLeft: '1.25rem',
            },
            'img[align=left]': {
                paddingRight: '1.25rem',
            },
            tt: {
                padding: '0.2rem 0.4rem',
                margin: 0,
                fontSize: '0.85rem',
                whiteSpace: 'break-space',
                backgroundColor: `#${background4}`,
                borderRadius: '0.375rem',
                br: {
                    display: 'none',
                },
            },
            del: {
                code: {
                    textDecoration: 'inherit',
                },
            },
            samp: {
                fontSize: '0.85rem',
            },
            pre: {
                tt: {
                    display: 'inline',
                    padding: 0,
                    margin: 0,
                    overflow: 'visible',
                    lineHeight: 'inherit',
                    wordWrap: 'normal',
                    backgroundColor: 'transparent',
                    border: 0,
                },
            },
            '[data-footnote-ref]::before': {
                content: '"["',
            },
            '[data-footnote-ref]::after': {
                content: '"]"',
            },
            '::-webkit-calendar-picker-indicator': {
                filter: 'invert(50%)',
            },
            '.inline-code': {
                color: `#${foreground1}`,
                backgroundColor: `#${background3}`,
                padding: '0.15rem 0.3rem',
                borderRadius: '0.3rem',
            },
            '.highlighter-box': {
                width: '100%',
                overflow: 'hidden',
                border: `1px solid #${divider2}`,
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                '.highlighter-head': {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.2rem 0.5rem 0.2rem 0.3rem',
                    '.icon': {
                        height: '1.5rem',
                        lineHeight: '1.5rem',
                        cursor: 'pointer',
                    },
                    '.language,.copy': {
                        '*': {
                            color: `#${foreground3}`,
                            backgroundColor: 'inherit',
                        },
                    },
                    '.copy': {
                        button: {
                            padding: 0,
                        },
                    },
                    '.space': {
                        flex: 1,
                    },
                },
                '.highlighter': {
                    color: `#${foreground1}`,
                    '.prismjs': {
                        backgroundColor: `#${background3}`,
                        'code[class*="language-"],pre[class*="language-"]': {
                            display: 'flex',
                            textAlign: 'left',
                            whiteSpace: 'pre',
                            wordSpacing: 'normal',
                            wordBreak: 'normal',
                            wordWrap: 'normal',
                            lineHeight: '1.5',
                            tabSize: '4',
                            hyphens: 'none',
                            br: {
                                display: 'none',
                            },
                        },
                        'pre[class*="language-"]': {
                            padding: '1rem',
                            margin: 0,
                            overflow: 'auto',
                            borderRadius: '0.3rem',
                        },
                        '.react-syntax-highlighter-line-number': {
                            display: 'block',
                            minWidth: '2.25em',
                            paddingRight: '1em',
                            paddingLeft: '0.5em',
                            textAlign: 'right',
                            userSelect: 'none',
                        },
                        ':not(pre) > code[class*="language-"]': {
                            padding: '0.1rem',
                            borderRadius: '0.3rem',
                            whiteSpace: 'normal',
                        },
                        '.linenumber,.react-syntax-highlighter-line-number': {
                            color: `#${lineNumber1}`,
                        },
                        '.code': {
                            flex: 1,
                            overflow: 'auto',
                        },
                        '.token.string': {
                            color: `#${highlighter1}`,
                        },
                        '.token.number': {
                            color: `#${highlighter2}`,
                        },
                        '.token.boolean,.token.keyword': {
                            color: `#${highlighter3}`,
                            fontWeight: 'bold',
                        },
                        '.token.class-name,.token.maybe-class-name,.token.atrule': {
                            color: `#${highlighter4}`,
                        },
                        '.token.property,.token.attr-value,.token.function': {
                            color: `#${highlighter5}`,
                        },
                        '.token.comment,.token.prolog,.token.doctype,.token.cdata': {
                            color: `#${highlighter6}`,
                            fontStyle: 'italic',
                        },
                    },
                },
            },
        },
        '.markdown::before': {
            display: 'table',
            content: '""',
        },
        '.markdown::after': {
            display: 'table',
            clear: 'both',
            content: '""',
        },
        '.outline': {
            position: 'absolute!important',
            right: '0.5rem',
            top: '5%',
            userSelect: 'none!important',
            overflowX: 'hidden',
            overflowY: 'hidden',
            paddingLeft: '0.5rem',
            borderLeft: `1px solid #${divider1}`,
            color: `#${foreground2}`,
        },
        '.outline-button-box': {
            position: 'absolute',
            right: 0,
            top: 0,
            width: '2.375rem',
            height: '100%',
            button: {
                display: 'none',
            },
            ':hover': {
                button: {
                    display: 'block',
                    position: 'absolute',
                    top: '5%',
                    right: '0.5rem',
                },
            },
        },
    };
};

export default style;
