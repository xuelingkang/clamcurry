import React, { FC, useEffect } from 'react';
import { Stack } from '@mui/material';
import Sidebar from './Sidebar';
import { Toast } from '../components/Toast';
import Main from './Main';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateMaxOpen } from '../store/slices/PanelsSlice';
import { updateSidebarState } from '../store/slices/SidebarSlice';
import { PreferenceVo } from '@clamcurry/common';
import { useTranslation } from 'react-i18next';
import PromiseUtils from '../utils/PromiseUtils';
import { updateAppState } from '../store/slices/AppSlice';

interface IProps {
    preference: PreferenceVo;
}

const App: FC<IProps> = (props: IProps) => {
    const { preference } = props;
    const { i18n } = useTranslation();
    const language = useAppSelector((state) => state.appState.language);
    const fontSize = useAppSelector((state) => state.appState.fontSize);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (language !== undefined && language !== i18n.language) {
            i18n.changeLanguage(language).catch(PromiseUtils.toastError);
        }
    }, [language]);
    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}px`;
    }, [fontSize]);
    useEffect(() => {
        const {
            language,
            editorMode,
            sidebarWidth,
            outlineWidth,
            maxOpen,
            fontSize,
            tabSize,
            vimMode,
            searchNoteLimit,
        } = preference;
        dispatch(updateMaxOpen(maxOpen));
        dispatch(
            updateAppState({
                language,
                editorMode,
                outlineWidth,
                fontSize,
                tabSize,
                vimMode,
                searchNoteLimit,
            }),
        );
        const mainWidth = `calc(100% - ${sidebarWidth}px)`;
        dispatch(
            updateSidebarState({
                showSidebar: true,
                sidebarWidth,
                mainWidth,
            }),
        );
    }, [preference]);
    return (
        <>
            <Toast />
            <Stack
                direction={'row'}
                style={{
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <Sidebar />
                <Main />
            </Stack>
        </>
    );
};

export default App;
