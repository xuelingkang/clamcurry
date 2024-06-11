import React, { FC, useCallback, useContext, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import { NoteVo } from '@clamcurry/common';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { standardKeymap, emacsStyleKeymap } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { vim } from '@replit/codemirror-vim';
import CodeMirror from '@uiw/react-codemirror';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror/src';
import { createTheme } from '@uiw/codemirror-themes';
import { ThemeContext } from '@/components/ThemeProvider';
import style from '@/App/Main/NotePanel/Editor/style';

interface IProps {
    note: NoteVo;
    content: string;
    onChange: (value: string) => void;
    onScroll?: (firstVisibleLineNumber: number) => void;
}

const Editor: FC<IProps> = (props: IProps) => {
    const { note, content, onChange, onScroll } = props;
    const { theme } = useContext(ThemeContext);
    const tabSize = useAppSelector((state) => state.appState.tabSize);
    const vimMode = useAppSelector((state) => state.appState.vimMode);
    const relativeLineNumber = useAppSelector((state) => state.appState.relativeLineNumber);
    const fontSize = useAppSelector((state) => state.appState.fontSize);
    const activePanelId = useAppSelector((state) => state.panelsState.activePanelId);
    const codeMirrorInstanceRef = useRef<ReactCodeMirrorRef | null>(null);
    useEffect(() => {
        if (note.id !== activePanelId) {
            return;
        }
        const editorView = codeMirrorInstanceRef.current?.view;
        if (!editorView) {
            return;
        }
        // auto focus
        editorView.focus();
    }, [activePanelId]);
    const editorThemeOptions = useCallback(() => style(theme, fontSize), [theme, fontSize]);
    const editorTheme = useCallback(() => createTheme(editorThemeOptions()), [editorThemeOptions]);
    const extensions = useCallback(() => {
        // exclude emacs keymap from standardKeymap
        const emacsKeys = emacsStyleKeymap.map((keymap) => keymap.key).filter((key) => !!key);
        const standardKeymapWithoutEmacs = standardKeymap.filter(
            (keymap) =>
                !emacsKeys.includes(keymap.key) &&
                !emacsKeys.includes(keymap.mac) &&
                !emacsKeys.includes(keymap.win) &&
                !emacsKeys.includes(keymap.linux),
        );
        const extensions = [
            keymap.of([...standardKeymapWithoutEmacs]),
            EditorView.lineWrapping,
            markdown({ addKeymap: true, base: markdownLanguage, codeLanguages: languages }),
            EditorView.domEventHandlers({
                scroll: (_event, view) => {
                    if (!onScroll) {
                        return;
                    }
                    const scrollTop = view.scrollDOM.scrollTop;
                    // find the visible top position
                    const blockInfo = view.lineBlockAtHeight(scrollTop);
                    // find the visible top absolute line number
                    const lineNumber = view.state.doc.lineAt(blockInfo.from).number;
                    onScroll(lineNumber);
                },
                paste: (event, view) => {
                    // paste image
                    const items = event.clipboardData?.items || [];
                    for (let i = 0; i < items.length; i++) {
                        const item = items[i];
                        if (item.kind === 'file' && item.type.startsWith('image/')) {
                            const image = item.getAsFile() as File;
                            const name = image.name;
                            const prefix = note.id.toString();
                            const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
                            const fileReader = new FileReader();
                            fileReader.onload = (event: ProgressEvent<FileReader>) => {
                                const data = (event.target && event.target.result) as ArrayBuffer;
                                const url = window.mainProcessService.upload({ name, prefix, data });
                                view.dispatch(view.state.replaceSelection(`![${name}](${url} "${nameWithoutExt}")\n`));
                            };
                            fileReader.readAsArrayBuffer(image);
                        }
                    }
                },
            }),
        ];
        if (vimMode) {
            extensions.push(vim({ status: true }));
        }
        if (relativeLineNumber) {
            extensions.push(
                lineNumbers({
                    formatNumber: (lineNo, state) => {
                        const cursorLine = state.doc.lineAt(state.selection.asSingle().ranges[0].to).number;
                        if (lineNo === cursorLine) {
                            return lineNo.toString();
                        } else {
                            return Math.abs(cursorLine - lineNo).toString();
                        }
                    },
                }),
            );
        }
        return extensions;
    }, [vimMode, relativeLineNumber]);
    return (
        <Box
            sx={{
                height: '100%',
                '>div': {
                    height: '100%',
                },
                '.cm-vim-panel.cm-panel': {
                    background: `#${theme.background2}`,
                    color: `#${theme.foreground1}`,
                },
                '.cm-vim-panel.cm-panel input': {
                    color: `#${theme.foreground1}`,
                },
                '.cm-fat-cursor': {
                    background: `${editorThemeOptions().settings.caret}!important`,
                },
                '.cm-editor:not(.cm-focused) .cm-fat-cursor': {
                    outline: `1px solid ${editorThemeOptions().settings.caret}!important`,
                    background: 'none!important',
                },
            }}
        >
            <CodeMirror
                ref={codeMirrorInstanceRef}
                value={content}
                height={'100%'}
                width={'100%'}
                autoFocus
                basicSetup={{
                    tabSize,
                    defaultKeymap: false,
                    lintKeymap: false,
                    searchKeymap: !vimMode,
                }}
                theme={editorTheme()}
                extensions={extensions()}
                onChange={onChange}
            />
        </Box>
    );
};

export default Editor;
