import React, { FC, useContext, useEffect } from 'react';
import Header from './Header';
import { Box } from '@mui/material';
import PreferencePanel from './PreferencePanel';
import ThemePanel from './ThemePanel';
import NotePanel from './NotePanel';
import If from '../../components/If';
import HomePanel from './HomePanel';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    closeActivePanel,
    openPreferencePanel,
    openSearchPanel,
    openThemePanel,
    PanelTypeEnum,
} from '../../store/slices/PanelsSlice';
import SearchPanel from './SearchPanel';
import { ThemeContext } from '../../components/ThemeProvider';

const Main: FC = () => {
    const { theme } = useContext(ThemeContext);
    const panels = useAppSelector((state) => state.panelsState.panels);
    const activePanelId = useAppSelector((state) => state.panelsState.activePanelId);
    const mainWidth = useAppSelector((state) => state.sidebarState.mainWidth);
    const dispatch = useAppDispatch();
    useEffect(() => {
        window.mainEventService.handlePreferenceMenuEvent(() => {
            dispatch(openPreferencePanel());
        });
        window.mainEventService.handleThemeMenuEvent(() => {
            dispatch(openThemePanel());
        });
        window.mainEventService.handleSearchNoteMenuEvent(() => {
            dispatch(openSearchPanel());
        });
        window.mainEventService.handleCloseNoteMenuEvent(() => {
            if (panels && panels.length) {
                dispatch(closeActivePanel());
            } else {
                window.mainProcessService.closeWindow();
            }
        });
        return () => {
            window.mainEventService.removePreferenceMenuEventListener();
            window.mainEventService.removeThemeMenuEventListener();
            window.mainEventService.removeSearchNoteMenuEventListener();
            window.mainEventService.removeCloseNoteMenuEvent();
        };
    }, [panels]);
    return (
        <Box
            sx={{
                width: mainWidth,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Header />
            <Box
                sx={{
                    flex: 1,
                    overflow: 'hidden',
                    backgroundColor: `#${theme.background2}`,
                }}
            >
                <If condition={!panels || !panels.length}>
                    <HomePanel />
                </If>
                {panels.map((panel) => (
                    <Box key={panel.id} role={'tabpanel'} hidden={activePanelId !== panel.id} sx={{ height: '100%' }}>
                        <If condition={panel.type === PanelTypeEnum.NOTE}>
                            <NotePanel note={panel.data} />
                        </If>
                        <If condition={panel.type === PanelTypeEnum.PREFERENCE}>
                            <PreferencePanel />
                        </If>
                        <If condition={panel.type === PanelTypeEnum.THEME}>
                            <ThemePanel />
                        </If>
                        <If condition={panel.type === PanelTypeEnum.SEARCH}>
                            <SearchPanel />
                        </If>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Main;
