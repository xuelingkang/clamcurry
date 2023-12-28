import React, { FC, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Popover,
    Tooltip,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateNotebookState } from '../../../store/slices/NotebooksSlice';
import { NotebookVo } from '@clamcurry/common';
import PromiseUtils from '../../../utils/PromiseUtils';
import { updatePanelsState } from '../../../store/slices/PanelsSlice';
import NewNotebookDialog, { INewNotebookDialog } from './NewNotebookDialog';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CreateIcon from '@mui/icons-material/Create';
import If from '../../../components/If';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import BackspaceIcon from '@mui/icons-material/Backspace';
import RenameNotebookDialog, { IRenameNotebookDialog } from './RenameNotebookDialog';
import DeleteNotebookDialog, { IDeleteNotebookDialog } from './DeleteNotebookDialog';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const NotebookMenu: FC = () => {
    const notebooks = useAppSelector((state) => state.notebooksState.notebooks);
    const enabledNotebook = useAppSelector((state) => state.notebooksState.enabledNotebook);
    const [menuOpen, setMenuOpen] = useState(false);
    const [notebookForRename, setNotebookForRename] = useState({} as NotebookVo);
    const [notebookForDelete, setNotebookForDelete] = useState({} as NotebookVo);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
    const [popoverText, setPopoverText] = useState('');
    const newNotebookDialogRef = useRef<INewNotebookDialog | null>(null);
    const renameNotebookDialogRef = useRef<IRenameNotebookDialog | null>(null);
    const deleteNotebookDialogRef = useRef<IDeleteNotebookDialog | null>(null);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    useEffect(() => {
        loadNotebooks();
    }, []);
    const loadNotebooks = () => {
        window.notebookService
            .findAll()
            .then((notebooks) => {
                if (notebooks && notebooks.length) {
                    const enabledNotebook = notebooks.find((notebook) => notebook.enabled) as NotebookVo;
                    dispatch(
                        updateNotebookState({
                            notebooks,
                            enabledNotebook,
                        }),
                    );
                    loadNotes(enabledNotebook);
                } else {
                    dispatch(
                        updateNotebookState({
                            notebooks: [],
                            enabledNotebook: { name: t('sidebar.notebookMenu.dummyNotebookName') } as NotebookVo,
                            notes: [],
                        }),
                    );
                    const newNotebookDialogInstance = newNotebookDialogRef.current;
                    if (!newNotebookDialogInstance) {
                        return;
                    }
                    newNotebookDialogInstance.open();
                }
            })
            .catch(PromiseUtils.toastError);
    };
    const loadNotes = (notebook: NotebookVo) => {
        Promise.all([window.notebookService.enable(notebook.id), window.noteService.listByNotebookId(notebook.id)])
            .then(([, notes]) => {
                dispatch(
                    updateNotebookState({
                        notes,
                    }),
                );
                dispatch(
                    updatePanelsState({
                        panels: [],
                        activePanelId: 0,
                    }),
                );
            })
            .catch(PromiseUtils.toastError);
    };
    const handleClickNotebookMenuButton = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };
    const handleChangeNotebook = (notebook: NotebookVo) => {
        setMenuOpen(false);
        if (notebook.id === enabledNotebook.id) {
            return;
        }
        dispatch(
            updateNotebookState({
                enabledNotebook: notebook,
            }),
        );
        loadNotes(notebook);
    };
    const handleNewNotebook = () => {
        setMenuOpen(false);
        const newNotebookDialogInstance = newNotebookDialogRef.current;
        if (!newNotebookDialogInstance) {
            return;
        }
        newNotebookDialogInstance.open();
    };
    const handleRenameNotebook = (event: React.MouseEvent<HTMLButtonElement>, notebook: NotebookVo) => {
        event.stopPropagation();
        setMenuOpen(false);
        const renameNotebookDialogInstance = renameNotebookDialogRef.current;
        if (!renameNotebookDialogInstance) {
            return;
        }
        setNotebookForRename(notebook);
        renameNotebookDialogInstance.open();
    };
    const handleDeleteNotebook = (event: React.MouseEvent<HTMLButtonElement>, notebook: NotebookVo) => {
        event.stopPropagation();
        setMenuOpen(false);
        const deleteNotebookDialogInstance = deleteNotebookDialogRef.current;
        if (!deleteNotebookDialogInstance) {
            return;
        }
        setNotebookForDelete(notebook);
        deleteNotebookDialogInstance.open();
    };
    return (
        <Box>
            <Button
                id='notebook-menu-button'
                aria-controls={menuOpen ? 'notebook-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={menuOpen ? 'true' : undefined}
                variant={'outlined'}
                color={'inherit'}
                disableElevation
                onClick={handleClickNotebookMenuButton}
                startIcon={<MenuBookIcon />}
                endIcon={
                    <>
                        <If condition={menuOpen}>
                            <ArrowDropUpIcon />
                        </If>
                        <If condition={!menuOpen}>
                            <ArrowDropDownIcon />
                        </If>
                    </>
                }
                sx={{
                    display: 'flex',
                    width: '100%',
                    borderRadius: 0,
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    ':hover': {
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                    },
                }}
            >
                <Typography
                    sx={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                    }}
                >
                    {enabledNotebook.name}
                </Typography>
            </Button>
            <Menu
                id='notebook-menu'
                MenuListProps={{
                    'aria-labelledby': 'notebook-menu-button',
                }}
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                sx={{
                    '.MuiListItemText-root': {
                        '.MuiTypography-root': {
                            maxWidth: '16rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        },
                    },
                }}
            >
                {notebooks.map((notebook) => (
                    <MenuItem
                        key={notebook.id}
                        onClick={() => handleChangeNotebook(notebook)}
                        selected={notebook.id === enabledNotebook.id}
                    >
                        <If condition={notebook.id === enabledNotebook.id}>
                            <ListItemIcon>
                                <MenuBookIcon fontSize={'small'} />
                            </ListItemIcon>
                        </If>
                        <If condition={notebook.id !== enabledNotebook.id}>
                            <ListItemIcon>
                                <LibraryBooksIcon fontSize={'small'} />
                            </ListItemIcon>
                        </If>
                        <ListItemText
                            onMouseEnter={(e) => {
                                const target = e.target as HTMLElement;
                                if (target.scrollWidth > target.clientWidth) {
                                    setPopoverAnchorEl(target);
                                    setPopoverText(notebook.name);
                                }
                            }}
                            onMouseLeave={() => {
                                setPopoverAnchorEl(null);
                                setPopoverText('');
                            }}
                        >
                            {notebook.name}
                        </ListItemText>
                        <Box
                            sx={{
                                '.MuiButtonGroup-root': {
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                                '.MuiButtonBase-root': {
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    minWidth: 0,
                                    marginLeft: '0.625rem',
                                    color: 'inherit',
                                    border: 'none',
                                    padding: 0,
                                    ':hover': {
                                        border: 'none',
                                    },
                                },
                            }}
                        >
                            <ButtonGroup>
                                <Tooltip title={t('sidebar.notebookMenu.tooltip.rename')}>
                                    <Button onClick={(event) => handleRenameNotebook(event, notebook)}>
                                        <DriveFileRenameOutlineIcon fontSize={'small'} />
                                    </Button>
                                </Tooltip>
                                <Tooltip title={t('sidebar.notebookMenu.tooltip.delete')}>
                                    <Button onClick={(event) => handleDeleteNotebook(event, notebook)}>
                                        <BackspaceIcon fontSize={'small'} />
                                    </Button>
                                </Tooltip>
                            </ButtonGroup>
                        </Box>
                    </MenuItem>
                ))}
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleNewNotebook}>
                    <ListItemIcon>
                        <CreateIcon />
                    </ListItemIcon>
                    <ListItemText>{t('sidebar.notebookMenu.newNotebook')}</ListItemText>
                </MenuItem>
            </Menu>
            <Popover
                disableRestoreFocus
                open={!!popoverAnchorEl}
                sx={{
                    pointerEvents: 'none',
                }}
                anchorEl={popoverAnchorEl}
                anchorOrigin={{
                    vertical: 33,
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={() => {
                    setPopoverAnchorEl(null);
                    setPopoverText('');
                }}
            >
                <Typography
                    sx={{
                        p: 1,
                    }}
                >
                    {popoverText}
                </Typography>
            </Popover>
            <NewNotebookDialog
                ref={newNotebookDialogRef}
                autoSwitch={true}
                forceOpen={!notebooks || !notebooks.length}
            />
            <RenameNotebookDialog ref={renameNotebookDialogRef} notebook={notebookForRename} />
            <DeleteNotebookDialog
                ref={deleteNotebookDialogRef}
                notebook={notebookForDelete}
                onSuccess={loadNotebooks}
            />
        </Box>
    );
};

export default NotebookMenu;
