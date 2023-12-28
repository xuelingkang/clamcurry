import React, { ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import { ThemeVo } from '@clamcurry/common';
import { useTranslation } from 'react-i18next';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import PromiseUtils from '../../../../utils/PromiseUtils';

export interface IDeleteThemeDialog {
    open: () => void;
}

interface IProps {
    theme: ThemeVo;
    onSuccess?: (theme: ThemeVo) => void;
}

const DeleteThemeDialog: ForwardRefRenderFunction<IDeleteThemeDialog, IProps> = (
    props: IProps,
    ref: ForwardedRef<IDeleteThemeDialog>,
) => {
    const { theme, onSuccess } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));
    const handleOpen = () => {
        setOpen(true);
    };
    const handleOk = () => {
        window.themeService
            .delete(theme.id)
            .then(() => {
                setOpen(false);
                onSuccess && onSuccess(theme);
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
                    {t('themePanel.deleteThemeDialog.title')}
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography>{t('themePanel.deleteThemeDialog.content', { themeName: theme.name })}</Typography>
            </DialogContent>
            <DialogActions>
                <Button color={'secondary'} onClick={handleClose}>
                    {t('themePanel.deleteThemeDialog.cancel')}
                </Button>
                <Button color={'warning'} onClick={handleOk}>
                    {t('themePanel.deleteThemeDialog.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default forwardRef(DeleteThemeDialog);
