import React, { FC, useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import { setMessageState } from '@/store/slices/MessageSlice';
import store from '@/store';

export const Toast: FC = () => {
    const [open, setOpen] = useState(false);
    const [timeoutId, setTimeoutId] = useState(0);
    const message = useAppSelector((state) => state.messageState.value);
    useEffect(() => {
        if (!message.content) {
            return;
        }
        const newTimeoutId = window.setTimeout(() => {
            setOpen(false);
            setTimeoutId(0);
        }, message.duration);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setOpen(true);
        setTimeoutId(newTimeoutId);
    }, [message]);
    return (
        <Snackbar
            open={open}
            autoHideDuration={message.duration}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Alert severity={message.type}>{message.content}</Alert>
        </Snackbar>
    );
};

const defaultDuration = 3000;

const toast = {
    error: (content: string, duration: number = defaultDuration) =>
        store.dispatch(
            setMessageState({
                type: 'error',
                content,
                duration,
            }),
        ),
    warning: (content: string, duration: number = defaultDuration) =>
        store.dispatch(
            setMessageState({
                type: 'warning',
                content,
                duration,
            }),
        ),
    info: (content: string, duration: number = defaultDuration) =>
        store.dispatch(
            setMessageState({
                type: 'info',
                content,
                duration,
            }),
        ),
    success: (content: string, duration: number = defaultDuration) =>
        store.dispatch(
            setMessageState({
                type: 'success',
                content,
                duration,
            }),
        ),
};

export default toast;
