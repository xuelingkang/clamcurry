import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import DndTree, { IDndTree, IDndTreeItem } from '@/components/DndTree';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { ArrayUtils, NoteVo, UpdateNoteDto } from '@clamcurry/common';
import { updateNotebookState } from '@/store/slices/NotebooksSlice';
import PromiseUtils from '@/utils/PromiseUtils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import SubjectIcon from '@mui/icons-material/Subject';
import { Box, ButtonGroup, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Tooltip } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import { openNotePanel } from '@/store/slices/PanelsSlice';
import { useTranslation } from 'react-i18next';
import NewNoteDialog, { INewNoteDialog } from '@/App/Sidebar/NoteTree/NewNoteDialog';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BackspaceIcon from '@mui/icons-material/Backspace';
import RenameNoteDialog, { IRenameNoteDialog } from '@/App/Sidebar/NoteTree/RenameNoteDialog';
import DeleteNoteDialog, { IDeleteNoteDialog } from '@/App/Sidebar/NoteTree/DeleteNoteDialog';

interface IProps {}

const NoteTree: FC<IProps> = () => {
    const { t } = useTranslation();
    const [treeItems, setTreeItems] = useState([] as IDndTreeItem[]);
    const [noteIdForAddChild, setNoteIdForAddChild] = useState(0);
    const [noteForRename, setNoteForRename] = useState({} as NoteVo);
    const [noteForDelete, setNoteForDelete] = useState({} as NoteVo);
    const dndTreeRef = useRef<IDndTree | null>(null);
    const dndTreeBoxRef = useRef<HTMLDivElement | null>(null);
    const newNoteDialogRef = useRef<INewNoteDialog>(null);
    const renameNoteDialogRef = useRef<IRenameNoteDialog>(null);
    const deleteNoteDialogRef = useRef<IDeleteNoteDialog>(null);
    const notes = useAppSelector((state) => state.notebooksState.notes);
    const activePanelId = useAppSelector((state) => state.panelsState.activePanelId);
    const dispatch = useAppDispatch();
    const focusNote = useCallback(() => {
        if (activePanelId <= 0) {
            return;
        }
        const dndTreeInstance = dndTreeRef.current;
        dndTreeInstance && dndTreeInstance.focus(activePanelId);
        // scroll to focused item
        const dndTreeBoxInstance = dndTreeBoxRef.current;
        if (!dndTreeBoxInstance) {
            return;
        }
        const intervalId = window.setInterval(() => {
            const element = dndTreeBoxInstance.querySelector(`.item_${activePanelId}`) as HTMLElement;
            if (!element) {
                return;
            }
            clearInterval(intervalId);
            // wait until element has a value
            const visibleHeight = dndTreeBoxInstance.offsetHeight - element.offsetHeight;
            const offsetTop = element.offsetTop;
            const visibleStart = dndTreeBoxInstance.scrollTop;
            const visibleEnd = dndTreeBoxInstance.scrollTop + visibleHeight;
            if (offsetTop < visibleStart) {
                dndTreeBoxInstance.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });
            }
            if (offsetTop > visibleEnd) {
                dndTreeBoxInstance.scrollTo({
                    top: offsetTop - visibleHeight,
                    behavior: 'smooth',
                });
            }
        }, 50);
    }, [activePanelId]);
    useEffect(() => {
        window.mainEventService.handleNewNoteMenuEvent(() => {
            setNoteIdForAddChild(0);
            const newNoteDialogInstance = newNoteDialogRef.current;
            newNoteDialogInstance && newNoteDialogInstance.open();
        });
        return () => {
            window.mainEventService.removeNewNoteMenuEventListener();
        };
    }, []);
    const expandAll = () => {
        const dndTreeInstance = dndTreeRef.current;
        dndTreeInstance && dndTreeInstance.expandAll();
    };
    const collapseAll = () => {
        const dndTreeInstance = dndTreeRef.current;
        dndTreeInstance && dndTreeInstance.collapseAll();
    };
    const openNewNoteDialog = (noteId: number) => {
        setNoteIdForAddChild(noteId);
        const newNoteDialogInstance = newNoteDialogRef.current;
        newNoteDialogInstance && newNoteDialogInstance.open();
    };
    const openRenameNoteDialog = (note: NoteVo) => {
        setNoteForRename(note);
        const renameNoteDialogInstance = renameNoteDialogRef.current;
        renameNoteDialogInstance && renameNoteDialogInstance.open();
    };
    const openDeleteNoteDialog = (note: NoteVo) => {
        setNoteForDelete(note);
        const deleteNoteDialogInstance = deleteNoteDialogRef.current;
        deleteNoteDialogInstance && deleteNoteDialogInstance.open();
    };
    const handleNewNoteSuccess = (note: NoteVo) => {
        const dndTreeInstance = dndTreeRef.current;
        if (dndTreeInstance) {
            // expand parent note if not expanded
            if (!dndTreeInstance.isExpand(note.parentId)) {
                dndTreeInstance.expand(note.parentId);
            }
        }
    };
    useEffect(() => {
        const treeItems = notes.map(
            (note) =>
                ({
                    itemId: note.id,
                    parentId: note.parentId,
                    draggable: true,
                    droppable: true,
                    label: note.title,
                    focused: () => activePanelId === note.id,
                    enableClick: true,
                    enableDoubleClick: true,
                    handleDoubleClickEvent: () => {
                        dispatch(openNotePanel(note));
                        window.noteService.refreshVisitTime(note.id).catch(PromiseUtils.toastError);
                    },
                    menu: (
                        <MenuList
                            sx={{
                                padding: 0,
                            }}
                        >
                            <MenuItem onClick={() => openNewNoteDialog(note.id)}>
                                <ListItemIcon>
                                    <CreateIcon />
                                </ListItemIcon>
                                <ListItemText>{t('sidebar.noteTree.noteMenu.new')}</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => openRenameNoteDialog(note)}>
                                <ListItemIcon>
                                    <DriveFileRenameOutlineIcon fontSize={'small'} />
                                </ListItemIcon>
                                <ListItemText>{t('sidebar.noteTree.noteMenu.rename')}</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => openDeleteNoteDialog(note)}>
                                <ListItemIcon>
                                    <BackspaceIcon fontSize={'small'} />
                                </ListItemIcon>
                                <ListItemText>{t('sidebar.noteTree.noteMenu.delete')}</ListItemText>
                            </MenuItem>
                        </MenuList>
                    ),
                }) as IDndTreeItem,
        );
        setTreeItems(treeItems);
    }, [activePanelId, dispatch, notes, t]);
    const handleUpdateNoteTree = (items: IDndTreeItem[]) => {
        const ordinalMap = new Map<number, number>();
        const dtoList: UpdateNoteDto[] = items
            .map((item) => {
                const id = item.itemId;
                const parentId = item.parentId;
                const lastOrdinal = ordinalMap.get(parentId);
                let ordinal: number;
                if (!lastOrdinal) {
                    ordinal = 1;
                } else {
                    ordinal = lastOrdinal + 1;
                }
                ordinalMap.set(parentId, ordinal);
                const dto = new UpdateNoteDto();
                dto.id = id;
                dto.parentId = parentId;
                dto.ordinal = ordinal;
                return dto;
            })
            .filter((dto) => {
                const note = notes.find((n) => n.id === dto.id);
                if (!note) {
                    return false;
                }
                return note.parentId !== dto.parentId || note.ordinal !== dto.ordinal;
            });
        if (!dtoList || !dtoList.length) {
            return;
        }
        window.noteService
            .updateBatch(dtoList)
            .then(() => {
                const newNotes = notes.map((note) => ({ ...note }));
                for (const dto of dtoList) {
                    const note = newNotes.find((n) => n.id === dto.id) as NoteVo;
                    note.parentId = dto.parentId as number;
                    note.ordinal = dto.ordinal as number;
                }
                ArrayUtils.sort(newNotes, 'ordinal', true);
                dispatch(updateNotebookState({ notes: newNotes }));
            })
            .catch(PromiseUtils.toastError);
    };
    return (
        <>
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            paddingRight: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <SubjectIcon fontSize={'small'} />
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                        }}
                    >
                        {t('sidebar.noteTree.label.contents')}
                    </Box>
                    <ButtonGroup>
                        <Tooltip title={t('sidebar.noteTree.tooltip.new')}>
                            <IconButton
                                onClick={() => openNewNoteDialog(0)}
                                sx={{
                                    width: '1.875rem',
                                    height: '1.875rem',
                                    padding: 0,
                                }}
                            >
                                <CreateIcon
                                    sx={{
                                        fontSize: '1.25rem',
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('sidebar.noteTree.tooltip.focus')}>
                            <IconButton
                                onClick={focusNote}
                                sx={{
                                    width: '1.875rem',
                                    height: '1.875rem',
                                    padding: 0,
                                }}
                            >
                                <FilterCenterFocusIcon
                                    sx={{
                                        fontSize: '1.25rem',
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('sidebar.noteTree.tooltip.expand')}>
                            <IconButton
                                onClick={expandAll}
                                sx={{
                                    width: '1.875rem',
                                    height: '1.875rem',
                                    padding: 0,
                                }}
                            >
                                <UnfoldMoreIcon
                                    sx={{
                                        fontSize: '1.25rem',
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('sidebar.noteTree.tooltip.collapse')}>
                            <IconButton
                                onClick={collapseAll}
                                sx={{
                                    width: '1.875rem',
                                    height: '1.875rem',
                                    padding: 0,
                                }}
                            >
                                <UnfoldLessIcon
                                    sx={{
                                        fontSize: '1.25rem',
                                    }}
                                />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>
                </Box>
                <Box
                    ref={dndTreeBoxRef}
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        position: 'relative',
                    }}
                >
                    <DndTree
                        ref={dndTreeRef}
                        items={treeItems}
                        onUpdateItems={handleUpdateNoteTree}
                        defaultExpandIcon={<ArrowRightIcon />}
                        defaultCollapseIcon={<ArrowDropDownIcon />}
                    />
                </Box>
            </Box>
            <NewNoteDialog ref={newNoteDialogRef} parentId={noteIdForAddChild} onSuccess={handleNewNoteSuccess} />
            <RenameNoteDialog ref={renameNoteDialogRef} note={noteForRename} />
            <DeleteNoteDialog ref={deleteNoteDialogRef} note={noteForDelete} />
        </>
    );
};

export default NoteTree;
