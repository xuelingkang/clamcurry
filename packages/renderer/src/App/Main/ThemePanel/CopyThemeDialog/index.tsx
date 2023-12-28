import React, { ForwardedRef, forwardRef, ForwardRefRenderFunction, useImperativeHandle, useState } from 'react';
import { ThemeVo } from '@clamcurry/common';
import { useTranslation } from 'react-i18next';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import PromiseUtils from '../../../../utils/PromiseUtils';

export interface ICopyThemeDialog {
    open: () => void;
}

interface IProps {
    theme: ThemeVo;
    onSuccess?: (theme: ThemeVo) => void;
}

const CopyThemeDialog: ForwardRefRenderFunction<ICopyThemeDialog, IProps> = (
    props: IProps,
    ref: ForwardedRef<ICopyThemeDialog>,
) => {
    const { theme, onSuccess } = props;
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));
    const handleOpen = () => {
        setOpen(true);
        setName('');
    };
    const handleOk = () => {
        window.themeService
            .save({ ...theme, name })
            .then((newThemeId) => {
                setOpen(false);
                return window.themeService.findById(newThemeId);
            })
            .then((newTheme) => {
                onSuccess && onSuccess(newTheme);
            })
            .catch(PromiseUtils.toastError);
    };
    const handleClose = () => {
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
    return (
        <Dialog open={open} disableRestoreFocus={true} onClose={handleClose} fullWidth={true}>
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
                    {t('themePanel.copyThemeDialog.title')}
                </Box>
            </DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus={true}
                    label={t('themePanel.copyThemeDialog.nameLabel')}
                    fullWidth={true}
                    variant={'standard'}
                    value={name}
                    onChange={handleChangeTitle}
                    onKeyDown={handleKeyDown}
                />
            </DialogContent>
            <DialogActions>
                <Button color={'secondary'} onClick={handleClose}>
                    {t('themePanel.copyThemeDialog.cancel')}
                </Button>
                <Button color={'primary'} onClick={handleOk}>
                    {t('themePanel.copyThemeDialog.ok')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default forwardRef(CopyThemeDialog);
