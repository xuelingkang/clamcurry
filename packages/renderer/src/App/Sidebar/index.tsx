import React, { FC, useEffect, useRef, useState } from 'react';
import { Resizable } from 're-resizable';
import { Box } from '@mui/material';
import NotebookMenu from './NotebookMenu';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateSidebarState } from '../../store/slices/SidebarSlice';
import NoteTree from './NoteTree';

const Sidebar: FC = () => {
    const sidebarWidth = useAppSelector((state) => state.sidebarState.sidebarWidth);
    const showSidebar = useAppSelector((state) => state.sidebarState.showSidebar);
    const dispatch = useAppDispatch();
    const [finalSidebarWidth, setFinalSidebarWidth] = useState(0);
    const resizableRef = useRef<Resizable | null>(null);
    useEffect(() => {
        if (!showSidebar) {
            return;
        }
        setFinalSidebarWidth(sidebarWidth);
        const mainWidth = `calc(100% - ${sidebarWidth}px)`;
        dispatch(
            updateSidebarState({
                mainWidth,
            }),
        );
    }, [sidebarWidth, showSidebar]);
    const handleResize = () => {
        const resizableInstance = resizableRef.current;
        if (resizableInstance) {
            const newSidebarWidth = resizableInstance.size.width;
            setFinalSidebarWidth(newSidebarWidth);
            const mainWidth = `calc(100% - ${newSidebarWidth}px)`;
            dispatch(
                updateSidebarState({
                    mainWidth,
                }),
            );
        }
    };
    return (
        <>
            <Box hidden={!showSidebar}>
                <Resizable
                    ref={resizableRef}
                    size={{
                        width: finalSidebarWidth,
                        height: '100%',
                    }}
                    minWidth={sidebarWidth}
                    enable={{
                        top: false,
                        right: true,
                        bottom: false,
                        left: false,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false,
                    }}
                    onResize={handleResize}
                    style={{
                        userSelect: 'none',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            padding: '0.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box>
                            <NotebookMenu />
                        </Box>
                        <Box
                            sx={{
                                marginTop: '0.25rem',
                                flex: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <NoteTree />
                        </Box>
                    </Box>
                </Resizable>
            </Box>
        </>
    );
};

export default Sidebar;
