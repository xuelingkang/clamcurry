import React, { ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import { NotebookVo } from '@clamcurry/common';
import { useTranslation } from 'react-i18next';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import PromiseUtils from '../../../../utils/PromiseUtils';

export interface IDeleteNotebookDialog {
    open: () => void;
}

interface IProps {
    notebook: NotebookVo;
    onSuccess?: () => void;
}

const DeleteNotebookDialog: ForwardRefRenderFunction<IDeleteNotebookDialog, IProps> = (
    props: IProps,
    ref: ForwardedRef<IDeleteNotebookDialog>,
) => {
    const { notebook, onSuccess } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));
    const handleOpen = () => {
        setOpen(true);
    };
    const handleOk = () => {
        window.notebookService
            .delete(notebook.id)
            .then(() => {
                setOpen(false);
                onSuccess && onSuccess();
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
                    {t('sidebar.notebookMenu.deleteNotebookDialog.title')}
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography>
                    {t('sidebar.notebookMenu.deleteNotebookDialog.content', { notebookName: notebook.name })}
                </Typography>
                <Typography color={theme.palette.warning.main}>
                    {t('sidebar.notebookMenu.deleteNotebookDialog.description')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button color={'secondary'} onClick={handleClose}>
                    {t('sidebar.notebookMenu.deleteNotebookDialog.cancel')}
                </Button>
                <Button color={'warning'} onClick={handleOk}>
                    {t('sidebar.notebookMenu.deleteNotebookDialog.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default forwardRef(DeleteNotebookDialog);
