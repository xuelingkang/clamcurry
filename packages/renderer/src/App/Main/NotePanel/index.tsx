import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Box, Grid } from '@mui/material';
import Editor from '@/App/Main/NotePanel/Editor';
import Preview, { IPreview } from '@/App/Main/NotePanel/Preview';
import { EditorModeEnum, NoteVo } from '@clamcurry/common';
import PromiseUtils from '@/utils/PromiseUtils';
import { useAppSelector } from '@/store/hooks';
import { ThemeContext } from '@/components/ThemeProvider';

interface IProps {
    note: NoteVo;
}

const NotePanel: FC<IProps> = (props: IProps) => {
    const { note } = props;
    const { theme } = useContext(ThemeContext);
    const [editorCols, setEditorCols] = useState(0);
    const [previewCols, setPreviewCols] = useState(0);
    const [content, setContent] = useState('');
    const editorMode = useAppSelector((state) => state.appState.editorMode);
    const activePanelId = useAppSelector((state) => state.panelsState.activePanelId);
    const previewRef = useRef<IPreview | null>(null);
    useEffect(() => {
        return () => {
            // will execute after first render, it doesn't matter
            window.noteService.handleCloseNote(note.id).catch(PromiseUtils.toastError);
        };
    }, []);
    useEffect(() => {
        if (!note || !note.id) {
            return;
        }
        window.noteService
            .getContent(note.id)
            .then((content) => {
                setContent(content);
            })
            .catch(PromiseUtils.toastError);
    }, [note]);
    useEffect(() => {
        if (editorMode === EditorModeEnum.EDITOR) {
            setEditorCols(12);
            setPreviewCols(0);
        }
        if (editorMode === EditorModeEnum.EDITOR_PREVIEW) {
            setEditorCols(6);
            setPreviewCols(6);
        }
        if (editorMode === EditorModeEnum.PREVIEW) {
            setEditorCols(0);
            setPreviewCols(12);
        }
    }, [editorMode]);
    const handleContentChange = (content: string) => {
        setContent(content);
        window.noteService.updateContent(note.id, content);
    };
    const handleEditorScroll = (firstVisibleLine: number) => {
        const previewInstance = previewRef.current;
        if (!previewInstance) {
            return;
        }
        previewInstance.syncScrollWithEditor(firstVisibleLine);
    };
    return (
        <Box
            sx={{
                height: '100%',
            }}
        >
            <Grid
                container
                sx={{
                    height: '100%',
                }}
            >
                <Grid
                    item
                    xs={editorCols}
                    sx={{
                        height: '100%',
                        borderRight:
                            editorMode === EditorModeEnum.EDITOR_PREVIEW ? `1px solid #${theme.divider1}` : 'none',
                    }}
                >
                    <Box
                        hidden={editorMode !== EditorModeEnum.EDITOR && editorMode !== EditorModeEnum.EDITOR_PREVIEW}
                        sx={{
                            height: '100%',
                        }}
                    >
                        <Editor
                            note={note}
                            content={content}
                            onChange={handleContentChange}
                            onScroll={handleEditorScroll}
                        />
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={previewCols}
                    sx={{
                        height: '100%',
                    }}
                >
                    <Box
                        hidden={editorMode !== EditorModeEnum.EDITOR_PREVIEW && editorMode !== EditorModeEnum.PREVIEW}
                        sx={{
                            height: '100%',
                        }}
                    >
                        <Preview ref={previewRef} active={note.id === activePanelId} content={content} />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default NotePanel;
