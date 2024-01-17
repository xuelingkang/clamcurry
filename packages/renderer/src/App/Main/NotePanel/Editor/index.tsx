import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import loader from '@monaco-editor/loader';
import * as monaco from 'monaco-editor';
import * as MonacoVim from 'monaco-vim';
import { Box } from '@mui/material';
import { NoteVo } from '@clamcurry/common';
import { useAppSelector } from '../../../../store/hooks';
import { ThemeContext } from '../../../../components/ThemeProvider';
import style from './style';

// load monaco sources from local instead of cdn
loader.config({ monaco });

interface IProps {
    note: NoteVo;
    content: string;
    onChange: (value: string) => void;
    onScroll?: (firstVisibleLine: number) => void;
}

interface VimAdapter {
    dispose: () => void;
}

const remFontSize = 0.875;

const Editor: FC<IProps> = (props: IProps) => {
    const { note, content, onChange, onScroll } = props;
    const { theme } = useContext(ThemeContext);
    const vimStatusBarRef = useRef<HTMLDivElement | null>(null);
    const [vimModeEnabled, setVimModeEnabled] = useState(false);
    const [editor, setEditor] = useState(null as monaco.editor.IStandaloneCodeEditor | null);
    const [vimAdapter, setVimAdapter] = useState(null as VimAdapter | null);
    const [themeName, setThemeName] = useState('');
    const [initialized, setInitialized] = useState(false);
    const fontSize = useAppSelector((state) => state.appState.fontSize);
    const tabSize = useAppSelector((state) => state.appState.tabSize);
    const vimMode = useAppSelector((state) => state.appState.vimMode);
    const activePanelId = useAppSelector((state) => state.panelsState.activePanelId);
    useEffect(() => {
        if (note.id !== activePanelId) {
            return;
        }
        if (!editor) {
            return;
        }
        // auto focus
        editor.focus();
    }, [editor, activePanelId]);
    useEffect(() => {
        const themeName = theme.name.replace(/\s+/g, '-');
        const themeData = style(theme) as monaco.editor.IStandaloneThemeData;
        monaco.editor.defineTheme(themeName, themeData);
        setThemeName(themeName);
    }, [theme]);
    useEffect(() => {
        if (!editor) {
            return;
        }
        const keyDownEventDisposer = editor.onKeyDown((event: monaco.IKeyboardEvent) => {
            // before initVimMode
            // disable keyMap while input method processing
            if (event.keyCode >= 114) {
                event.preventDefault();
            }
        });
        if (vimMode) {
            if (vimModeEnabled) {
                return;
            }
            const vimStatusBarInstance = vimStatusBarRef.current;
            const vimAdapter = MonacoVim.initVimMode(editor, vimStatusBarInstance);
            setVimAdapter(vimAdapter);
            setVimModeEnabled(true);
        } else {
            if (!vimModeEnabled) {
                return;
            }
            vimAdapter && vimAdapter.dispose();
            setVimModeEnabled(false);
        }
        return () => {
            keyDownEventDisposer.dispose();
        };
    }, [editor, vimMode]);
    useEffect(() => {
        if (initialized) {
            return;
        }
        if (!editor) {
            return;
        }
        editor.setSelection(new monaco.Selection(1, 0, 1, 0));
        setInitialized(true);
    }, [editor, content]);
    const handlePaste = (event: ClipboardEvent) => {
        if (!editor) {
            return;
        }
        event.stopPropagation();
        event.preventDefault();
        const items = event.clipboardData?.items || [];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let selection = editor.getSelection() as monaco.Selection;
            if (item.kind === 'file' && item.type.startsWith('image/')) {
                const image = item.getAsFile() as File;
                const name = image.name;
                const prefix = note.id.toString();
                const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
                const fileReader = new FileReader();
                fileReader.onload = (event: ProgressEvent<FileReader>) => {
                    const data = (event.target && event.target.result) as ArrayBuffer;
                    const url = window.mainProcessService.upload({ name, prefix, data });
                    editor.executeEdits('', [
                        {
                            range: monaco.Range.lift(selection),
                            text: `![${name}](${url} "${nameWithoutExt}")\n`,
                        },
                    ]);
                };
                fileReader.readAsArrayBuffer(image);
            } else if (item.kind === 'string' && item.type === 'text/plain') {
                item.getAsString((data) => {
                    editor.executeEdits('', [
                        {
                            range: monaco.Range.lift(selection),
                            text: data,
                        },
                    ]);
                });
            } else {
                continue;
            }
            selection = editor.getSelection() as monaco.Selection;
            const lineNumber = selection.endLineNumber;
            const column = selection.endColumn;
            editor.setSelection(new monaco.Selection(lineNumber, column, lineNumber, column));
        }
    };
    useEffect(() => {
        if (!editor) {
            return;
        }
        editor.getDomNode()?.addEventListener('paste', handlePaste, true);
        const scrollEventDisposer = editor.onDidScrollChange(() => {
            if (!onScroll) {
                return;
            }
            window.setTimeout(() => {
                const lineNumberElements = editor.getDomNode()?.querySelectorAll('.margin-view-overlays .line-numbers');
                let firstVisibleLine: number = -1;
                lineNumberElements &&
                    lineNumberElements.forEach((lineNumberElement) => {
                        const text = (lineNumberElement as HTMLElement).innerText;
                        if (text) {
                            const lineNumber = parseInt(text);
                            if (firstVisibleLine === -1 || lineNumber < firstVisibleLine) {
                                firstVisibleLine = lineNumber;
                            }
                        }
                    });
                if (firstVisibleLine > 0) {
                    onScroll(firstVisibleLine);
                }
            });
        }, 10);
        const keyDownEventDisposer = editor.onKeyDown((event: monaco.IKeyboardEvent) => {
            // disable Command Palette
            if (event.code === 'F1') {
                event.stopPropagation();
            }
        });
        return () => {
            editor.getDomNode()?.removeEventListener('paste', handlePaste, true);
            scrollEventDisposer.dispose();
            keyDownEventDisposer.dispose();
        };
    }, [editor]);
    const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        // store editor instance for further usage
        setEditor(editor);
    };
    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    '.monaco-editor': {
                        '[class*="bracket-highlighting-"]': {
                            color: `#${theme.foreground1}`,
                        },
                        '.find-widget': {
                            backgroundColor: `#${theme.background2}`,
                            '.monaco-sash': {
                                backgroundColor: `#${theme.background3}`,
                            },
                        },
                    },
                }}
            >
                <MonacoEditor
                    theme={themeName}
                    language={'markdown'}
                    value={content}
                    onMount={handleMount}
                    onChange={(value) => {
                        if (!value) {
                            value = '';
                        }
                        onChange(value);
                    }}
                    options={{
                        wordWrap: 'on',
                        fontFamily: 'monospace',
                        tabSize: tabSize,
                        minimap: {
                            enabled: false,
                        },
                        pasteAs: {
                            enabled: false,
                        },
                        contextmenu: false,
                        overviewRulerBorder: false,
                        scrollbar: {
                            verticalScrollbarSize: 5,
                            horizontalScrollbarSize: 5,
                            useShadows: false,
                        },
                        fontSize: (fontSize || 16) * remFontSize,
                        suggestOnTriggerCharacters: false,
                        quickSuggestions: false,
                    }}
                />
            </Box>
            <Box
                ref={vimStatusBarRef}
                sx={{
                    background: theme.background2,
                    color: theme.foreground1,
                    fontSize: `${remFontSize}rem`,
                    fontFamily: 'monospace',
                    input: {
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        writingMode: 'horizontal-tb',
                        paddingBlock: '1px',
                        paddingInline: '2px',
                        color: theme.foreground1,
                    },
                }}
            />
        </Box>
    );
};

export default Editor;
