import React, { ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import { AssertUtils, SaveNotebookDto } from '@clamcurry/common';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { useTranslation } from 'react-i18next';
import PromiseUtils from '../../../../utils/PromiseUtils';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { updateNotebookState } from '../../../../store/slices/NotebooksSlice';
import toast from '../../../../components/Toast';
import { updatePanelsState } from '../../../../store/slices/PanelsSlice';

export interface INewNotebookDialog {
    open: () => void;
}

interface IProps {
    autoSwitch: boolean;
    forceOpen?: boolean;
}

const NewNotebookDialog: ForwardRefRenderFunction<INewNotebookDialog, IProps> = (
    props: IProps,
    ref: ForwardedRef<INewNotebookDialog>,
) => {
    const { autoSwitch, forceOpen } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const notebooks = useAppSelector((state) => state.notebooksState.notebooks);
    const dispatch = useAppDispatch();
    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));
    const handleOpen = () => {
        setOpen(true);
        setName('');
    };
    const handleClose = () => {
        if (forceOpen) {
            return;
        }
        setOpen(false);
    };
    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            handleOk();
        }
    };
    const handleOk = () => {
        if (AssertUtils.isBlank(name)) {
            toast.error(t('sidebar.notebookMenu.newNotebookDialog.nameRequireMessage'));
            return;
        }
        const dto = new SaveNotebookDto();
        dto.name = name;
        window.notebookService
            .save(dto)
            .then(window.notebookService.findById)
            .then((notebook) => {
                setOpen(false);
                if (autoSwitch) {
                    const newNotebooks = [...notebooks, notebook];
                    dispatch(
                        updateNotebookState({
                            notebooks: newNotebooks,
                            enabledNotebook: notebook,
                            notes: [],
                        }),
                    );
                    dispatch(
                        updatePanelsState({
                            panels: [],
                            activePanelId: 0,
                        }),
                    );
                }
            })
            .catch(PromiseUtils.toastError);
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
                    {t('sidebar.notebookMenu.newNotebookDialog.title')}
                </Box>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus={true}
                    label={t('sidebar.notebookMenu.newNotebookDialog.nameLabel')}
                    fullWidth={true}
                    variant={'standard'}
                    value={name}
                    onChange={handleChangeTitle}
                    onKeyDown={handleKeyDown}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'secondary'} onClick={handleClose} disabled={forceOpen}>
                    {t('sidebar.notebookMenu.newNotebookDialog.cancel')}
                </Button>
                <Button color={'primary'} onClick={handleOk}>
                    {t('sidebar.notebookMenu.newNotebookDialog.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default forwardRef(NewNotebookDialog);
