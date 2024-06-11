import React, {
    ForwardedRef,
    forwardRef,
    ForwardRefRenderFunction,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import { AssertUtils, NoteVo, UpdateNoteDto } from '@clamcurry/common';
import { useTranslation } from 'react-i18next';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import toast from '@/components/Toast';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PromiseUtils from '@/utils/PromiseUtils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateNotebookState } from '@/store/slices/NotebooksSlice';
import { updatePanelsState } from '@/store/slices/PanelsSlice';

export interface IRenameNoteDialog {
    open: () => void;
}

interface IProps {
    note: NoteVo;
}

const RenameNoteDialog: ForwardRefRenderFunction<IRenameNoteDialog, IProps> = (
    props: IProps,
    ref: ForwardedRef<IRenameNoteDialog>,
) => {
    const { note } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const notes = useAppSelector((state) => state.notebooksState.notes);
    const panels = useAppSelector((state) => state.panelsState.panels);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (note.title === undefined) {
            return;
        }
        setTitle(note.title);
    }, [note.title]);
    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));
    const handleOpen = () => {
        setOpen(true);
    };
    const handleOk = () => {
        if (AssertUtils.isBlank(title)) {
            toast.error(t('sidebar.noteTree.renameNoteDialog.titleRequireMessage'));
            return;
        }
        const dto = new UpdateNoteDto();
        dto.id = note.id;
        dto.title = title;
        window.noteService
            .update(dto)
            .then(() => {
                const newNotes = notes.map((n) => {
                    if (n.id !== note.id) {
                        return n;
                    }
                    return {
                        ...n,
                        title,
                    };
                });
                const newPanels = panels.map((panel) => {
                    if (panel.id !== note.id) {
                        return panel;
                    }
                    return {
                        ...panel,
                        title,
                    };
                });
                dispatch(updateNotebookState({ notes: newNotes }));
                dispatch(updatePanelsState({ panels: newPanels }));
                setOpen(false);
            })
            .catch(PromiseUtils.toastError);
    };
    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            handleOk();
        }
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog open={open} disableRestoreFocus={true} onClose={handleClose} fullWidth={true}>
            <DialogTitle>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <DriveFileRenameOutlineIcon
                        sx={{
                            marginRight: '0.25rem',
                        }}
                    />
                    {t('sidebar.noteTree.renameNoteDialog.title')}
                </Box>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus={true}
                    label={t('sidebar.noteTree.renameNoteDialog.titleLabel')}
                    fullWidth={true}
                    variant={'standard'}
                    value={title}
                    onChange={handleChangeTitle}
                    onKeyDown={handleKeyDown}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'secondary'} onClick={handleClose}>
                    {t('sidebar.noteTree.renameNoteDialog.cancel')}
                </Button>
                <Button color={'primary'} onClick={handleOk}>
                    {t('sidebar.noteTree.renameNoteDialog.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default forwardRef(RenameNoteDialog);
