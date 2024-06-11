import React, { ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import { NoteVo } from '@clamcurry/common';
import { useTranslation } from 'react-i18next';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import PromiseUtils from '@/utils/PromiseUtils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateNotebookState } from '@/store/slices/NotebooksSlice';
import { PanelTypeEnum, updatePanelsState } from '@/store/slices/PanelsSlice';

export interface IDeleteNoteDialog {
    open: () => void;
}

interface IProps {
    note: NoteVo;
}

const DeleteNoteDialog: ForwardRefRenderFunction<IDeleteNoteDialog, IProps> = (
    props: IProps,
    ref: ForwardedRef<IDeleteNoteDialog>,
) => {
    const { note } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const notes = useAppSelector((state) => state.notebooksState.notes);
    const panels = useAppSelector((state) => state.panelsState.panels);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));
    const handleOpen = () => {
        setOpen(true);
    };
    const handleOk = () => {
        window.noteService
            .delete(note.id)
            .then((ids) => {
                const newNotes = notes.filter((n) => !ids.includes(n.id));
                const newPanels = panels.filter(
                    (panel) => panel.type !== PanelTypeEnum.NOTE || !ids.includes(panel.id),
                );
                dispatch(updateNotebookState({ notes: newNotes }));
                dispatch(updatePanelsState({ panels: newPanels }));
                setOpen(false);
            })
            .catch(PromiseUtils.toastError);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog open={open} disableRestoreFocus={true} onClose={handleClose}>
            <DialogTitle>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <BackspaceIcon
                        sx={{
                            marginRight: '0.25rem',
                        }}
                    />
                    {t('sidebar.noteTree.deleteNoteDialog.title')}
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography>{t('sidebar.noteTree.deleteNoteDialog.content', { noteTitle: note.title })}</Typography>
                <Typography color={theme.palette.warning.main}>
                    {t('sidebar.noteTree.deleteNoteDialog.description')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button color={'secondary'} onClick={handleClose}>
                    {t('sidebar.noteTree.deleteNoteDialog.cancel')}
                </Button>
                <Button color={'warning'} onClick={handleOk}>
                    {t('sidebar.noteTree.deleteNoteDialog.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default forwardRef(DeleteNoteDialog);
