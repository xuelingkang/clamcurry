import React, { ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AssertUtils, NoteVo, SaveNoteDto } from '@clamcurry/common';
import PromiseUtils from '../../../../utils/PromiseUtils';
import toast from '../../../../components/Toast';
import CreateIcon from '@mui/icons-material/Create';
import { updateNotebookState } from '../../../../store/slices/NotebooksSlice';
import { openNotePanel } from '../../../../store/slices/PanelsSlice';

export interface INewNoteDialog {
    open: () => void;
}

interface IProps {
    parentId: number;
    onSuccess?: (note: NoteVo) => void;
}

const NewNoteDialog: ForwardRefRenderFunction<INewNoteDialog, IProps> = (
    props: IProps,
    ref: ForwardedRef<INewNoteDialog>,
) => {
    const { parentId, onSuccess } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const notes = useAppSelector((state) => state.notebooksState.notes);
    const enabledNotebook = useAppSelector((state) => state.notebooksState.enabledNotebook);
    const dispatch = useAppDispatch();
    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));
    const handleOpen = () => {
        setOpen(true);
        setTitle('');
    };
    const handleOk = () => {
        if (AssertUtils.isBlank(title)) {
            toast.error(t('sidebar.noteTree.newNoteDialog.titleRequireMessage'));
            return;
        }
        const dto = new SaveNoteDto();
        dto.title = title;
        dto.parentId = parentId;
        dto.notebookId = enabledNotebook.id;
        window.noteService
            .save(dto)
            .then(window.noteService.findById)
            .then((note) => {
                const newNotes = [...notes, note];
                dispatch(updateNotebookState({ notes: newNotes }));
                dispatch(openNotePanel(note));
                onSuccess && onSuccess(note);
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
                    <CreateIcon
                        sx={{
                            marginRight: '0.25rem',
                        }}
                    />
                    {t('sidebar.noteTree.newNoteDialog.title')}
                </Box>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus={true}
                    label={t('sidebar.noteTree.newNoteDialog.titleLabel')}
                    fullWidth={true}
                    variant={'standard'}
                    value={title}
                    onChange={handleChangeTitle}
                    onKeyDown={handleKeyDown}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'secondary'} onClick={handleClose}>
                    {t('sidebar.noteTree.newNoteDialog.cancel')}
                </Button>
                <Button color={'primary'} onClick={handleOk}>
                    {t('sidebar.noteTree.newNoteDialog.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default forwardRef(NewNoteDialog);
