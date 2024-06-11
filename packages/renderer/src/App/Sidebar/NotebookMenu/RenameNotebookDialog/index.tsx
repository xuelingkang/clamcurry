import React, {
    ForwardedRef,
    forwardRef,
    ForwardRefRenderFunction,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import { AssertUtils, NotebookVo, UpdateNotebookDto } from '@clamcurry/common';
import { useTranslation } from 'react-i18next';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import toast from '@/components/Toast';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PromiseUtils from '@/utils/PromiseUtils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateNotebookState } from '@/store/slices/NotebooksSlice';

export interface IRenameNotebookDialog {
    open: () => void;
}

interface IProps {
    notebook: NotebookVo;
}

const RenameNotebookDialog: ForwardRefRenderFunction<IRenameNotebookDialog, IProps> = (
    props: IProps,
    ref: ForwardedRef<IRenameNotebookDialog>,
) => {
    const { notebook } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const notebooks = useAppSelector((state) => state.notebooksState.notebooks);
    const enabledNotebook = useAppSelector((state) => state.notebooksState.enabledNotebook);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (notebook.name === undefined) {
            return;
        }
        setName(notebook.name);
    }, [notebook.name]);
    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));
    const handleOpen = () => {
        setOpen(true);
    };
    const handleOk = () => {
        if (AssertUtils.isBlank(name)) {
            toast.error(t('sidebar.notebookMenu.renameNotebookDialog.nameRequireMessage'));
            return;
        }
        const dto: UpdateNotebookDto = {
            id: notebook.id,
            name: name,
        };
        window.notebookService
            .update(dto)
            .then(() => {
                const newNotebooks = notebooks.map((n) => {
                    if (n.id !== notebook.id) {
                        return n;
                    }
                    return {
                        ...n,
                        name,
                    };
                });
                const newEnabledNotebook = {
                    ...enabledNotebook,
                };
                if (enabledNotebook.id === notebook.id) {
                    newEnabledNotebook.name = name;
                }
                dispatch(
                    updateNotebookState({
                        notebooks: newNotebooks,
                        enabledNotebook: newEnabledNotebook,
                    }),
                );
                setOpen(false);
            })
            .catch(PromiseUtils.toastError);
    };
    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
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
                    {t('sidebar.notebookMenu.renameNotebookDialog.title')}
                </Box>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus={true}
                    label={t('sidebar.notebookMenu.renameNotebookDialog.nameLabel')}
                    fullWidth={true}
                    variant={'standard'}
                    value={name}
                    onChange={handleChangeName}
                    onKeyDown={handleKeyDown}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'secondary'} onClick={handleClose}>
                    {t('sidebar.notebookMenu.renameNotebookDialog.cancel')}
                </Button>
                <Button color={'primary'} onClick={handleOk}>
                    {t('sidebar.notebookMenu.renameNotebookDialog.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default forwardRef(RenameNotebookDialog);
