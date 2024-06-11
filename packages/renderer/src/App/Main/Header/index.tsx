import React, { FC, useContext, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import NotesIcon from '@mui/icons-material/Notes';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import ImageIcon from '@mui/icons-material/Image';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, IconButton, Stack, Tab, Tabs, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { EditorModeEnum } from '@clamcurry/common';
import If from '@/components/If';
import TabLabel from '@/App/Main/Header/TabLabel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { changePanel, PanelTypeEnum } from '@/store/slices/PanelsSlice';
import { updateSidebarState } from '@/store/slices/SidebarSlice';
import { updateAppState } from '@/store/slices/AppSlice';
import { ThemeContext } from '@/components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import toast from '@/components/Toast';
import PromiseUtils from '@/utils/PromiseUtils';

const Header: FC = () => {
    const { theme } = useContext(ThemeContext);
    const { t } = useTranslation();
    const panels = useAppSelector((state) => state.panelsState.panels);
    const activePanelId = useAppSelector((state) => state.panelsState.activePanelId);
    const editorMode = useAppSelector((state) => state.appState.editorMode);
    const showSidebar = useAppSelector((state) => state.sidebarState.showSidebar);
    const sidebarWidth = useAppSelector((state) => state.sidebarState.sidebarWidth);
    const dispatch = useAppDispatch();
    useEffect(() => {
        window.mainEventService.handleToggleSidebarMenuEvent(handleToggleSidebar);
        return () => {
            window.mainEventService.removeToggleSidebarMenuEventListener();
        };
    }, [showSidebar]);
    const handleToggleSidebar = () => {
        if (showSidebar) {
            // collapse sidebar
            dispatch(
                updateSidebarState({
                    showSidebar: false,
                    mainWidth: '100%',
                }),
            );
        } else {
            dispatch(
                updateSidebarState({
                    showSidebar: true,
                    mainWidth: `calc(100% - ${sidebarWidth}px)`,
                }),
            );
        }
    };
    const handleExport = () => {
        const activePanel = panels.find((panel) => panel.id === activePanelId);
        if (!activePanel) {
            return;
        }
        if (activePanel.type !== PanelTypeEnum.NOTE) {
            return;
        }
        window.mainProcessService
            .exportNote(activePanelId)
            .then((success) => {
                if (success) {
                    toast.success(t('header.message.exportNoteSuccess'));
                }
            })
            .catch(PromiseUtils.toastError);
    };
    return (
        <>
            <Stack
                direction={'row'}
                spacing={1}
                sx={{
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <If condition={showSidebar}>
                        <Tooltip title={t('header.tooltip.collapseSidebar')}>
                            <IconButton
                                onClick={handleToggleSidebar}
                                style={{
                                    borderRadius: '0.25rem',
                                }}
                            >
                                <MenuOpenIcon />
                            </IconButton>
                        </Tooltip>
                    </If>
                    <If condition={!showSidebar}>
                        <Tooltip title={t('header.tooltip.expandSidebar')}>
                            <IconButton
                                onClick={handleToggleSidebar}
                                style={{
                                    borderRadius: '0.25rem',
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                    </If>
                </Box>
                <Box
                    sx={{
                        // fill remain space
                        flex: 1,
                        // overflow auto hidden overlay and so on, then tabs will show scrollbar
                        overflow: 'hidden',
                    }}
                >
                    <If condition={!!panels && !!panels.length}>
                        <Tabs
                            value={activePanelId}
                            onChange={(_e, value) => dispatch(changePanel(value))}
                            variant={'scrollable'}
                            scrollButtons={'auto'}
                            sx={{
                                width: '100%',
                                minHeight: 0,
                                'button.Mui-selected': {
                                    color: `#${theme.foreground1}`,
                                    backgroundColor: `#${theme.background2}`,
                                },
                                '.MuiTabs-indicator': {
                                    backgroundColor: 'inherit',
                                },
                            }}
                        >
                            {panels.map((panel) => (
                                <Tab
                                    key={panel.id}
                                    value={panel.id}
                                    label={<TabLabel panel={panel} />}
                                    sx={{
                                        minHeight: 0,
                                        padding: '0.5rem 0.75rem',
                                    }}
                                />
                            ))}
                        </Tabs>
                    </If>
                </Box>
                <If condition={panels.find((p) => p.id === activePanelId)?.type === PanelTypeEnum.NOTE}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <ToggleButtonGroup
                            exclusive
                            size={'small'}
                            onChange={(_e, value) => dispatch(updateAppState({ editorMode: value as EditorModeEnum }))}
                        >
                            <ToggleButton
                                value={EditorModeEnum.EDITOR}
                                selected={editorMode === EditorModeEnum.EDITOR}
                                sx={{
                                    border: 'none',
                                }}
                            >
                                <NotesIcon />
                            </ToggleButton>
                            <ToggleButton
                                value={EditorModeEnum.EDITOR_PREVIEW}
                                selected={editorMode === EditorModeEnum.EDITOR_PREVIEW}
                                sx={{
                                    border: 'none',
                                }}
                            >
                                <VerticalSplitIcon />
                            </ToggleButton>
                            <ToggleButton
                                value={EditorModeEnum.PREVIEW}
                                selected={editorMode === EditorModeEnum.PREVIEW}
                                sx={{
                                    border: 'none',
                                }}
                            >
                                <ImageIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Tooltip title={t('header.tooltip.exportNote')}>
                            <IconButton
                                onClick={handleExport}
                                style={{
                                    borderRadius: 4,
                                }}
                            >
                                <FileDownloadIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </If>
            </Stack>
        </>
    );
};

export default Header;
