import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { AssertUtils, NoteVo, TimeUtils } from '@clamcurry/common';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { useTranslation } from 'react-i18next';
import toast from '../../../components/Toast';
import PromiseUtils from '../../../utils/PromiseUtils';
import {
    Box,
    Chip,
    Divider,
    Grid,
    InputAdornment,
    List,
    ListItemButton,
    ListSubheader,
    Popover,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { ThemeContext } from '../../../components/ThemeProvider';
import { openNotePanel } from '../../../store/slices/PanelsSlice';

const datetimeFormat = 'YYYY/MM/DD HH:mm';

const SearchPanel: FC = () => {
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const [keyword, setKeyword] = useState('');
    const [notes, setNotes] = useState([] as NoteVo[]);
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
    const [popoverText, setPopoverText] = useState('');
    const enabledNotebook = useAppSelector((state) => state.notebooksState.enabledNotebook);
    const searchNoteLimit = useAppSelector((state) => state.appState.searchNoteLimit);
    const keywordRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    useEffect(() => {
        window.addEventListener('keydown', handleKeywordFocus);
        return () => {
            window.removeEventListener('keydown', handleKeywordFocus);
        };
    }, []);
    const handleKeywordFocus = (event: KeyboardEvent) => {
        if (event.key !== '/') {
            return;
        }
        const keywordInstance = keywordRef.current;
        if (!keywordInstance) {
            return;
        }
        const input = keywordInstance.querySelector('input');
        if (!input) {
            return;
        }
        if (document.activeElement === input) {
            return;
        }
        input.focus();
        event.preventDefault();
    };
    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.keyCode === 13) {
            handleSearch();
        }
    };
    const handleSearch = () => {
        if (AssertUtils.isBlank(keyword)) {
            toast.error(t('searchPanel.message.requireKeyword'));
            return;
        }
        window.noteService
            .searchByKeyword(enabledNotebook.id, keyword, searchNoteLimit)
            .then((notes) => {
                setNotes(notes);
            })
            .catch(PromiseUtils.toastError);
    };
    const handleOpenNote = (note: NoteVo) => {
        dispatch(openNotePanel(note));
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    padding: '16px',
                }}
            >
                <TextField
                    ref={keywordRef}
                    autoFocus={true}
                    label={t('searchPanel.label.keyword')}
                    fullWidth={true}
                    variant={'standard'}
                    value={keyword}
                    onChange={handleChangeKeyword}
                    onKeyDown={handleKeyDown}
                    placeholder={t('searchPanel.placeholder.keyword')}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position={'start'}>
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position={'end'}>
                                <KeyboardReturnIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Box
                sx={{
                    flex: 1,
                    width: '100%',
                    padding: '16px',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                }}
            >
                <List
                    component='nav'
                    aria-labelledby='nested-list-subheader'
                    subheader={
                        <Box>
                            <ListSubheader
                                disableGutters
                                component='div'
                                id='nested-list-subheader'
                                sx={{ backgroundColor: `#${theme.background2}` }}
                            >
                                {t('searchPanel.label.result')}
                            </ListSubheader>
                            <Divider />
                        </Box>
                    }
                >
                    {notes.map((note) => (
                        <Box key={note.id}>
                            <ListItemButton disableGutters onClick={() => handleOpenNote(note)}>
                                <Grid container>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={6}
                                        xl={8}
                                        sx={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <Box
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                textAlign: 'left',
                                            }}
                                            onMouseEnter={(e) => {
                                                const target = e.currentTarget;
                                                if (target.scrollWidth > target.clientWidth) {
                                                    setPopoverAnchorEl(target);
                                                    setPopoverText(note.title);
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                setPopoverAnchorEl(null);
                                                setPopoverText('');
                                            }}
                                        >
                                            {note.title}
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={6} xl={4}>
                                        <Grid container>
                                            <Grid item xs={4}>
                                                <Tooltip title={TimeUtils.format(note.createTime, datetimeFormat)}>
                                                    <Chip
                                                        label={t('searchPanel.label.createTime', {
                                                            time: TimeUtils.format(note.createTime, datetimeFormat),
                                                        })}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Tooltip title={TimeUtils.format(note.updateTime, datetimeFormat)}>
                                                    <Chip
                                                        label={t('searchPanel.label.updateTime', {
                                                            time: TimeUtils.format(note.updateTime, datetimeFormat),
                                                        })}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Tooltip title={TimeUtils.format(note.visitTime, datetimeFormat)}>
                                                    <Chip
                                                        label={t('searchPanel.label.visitTime', {
                                                            time: TimeUtils.format(note.visitTime, datetimeFormat),
                                                        })}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ListItemButton>
                            <Divider />
                        </Box>
                    ))}
                </List>
            </Box>
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
        </Box>
    );
};

export default SearchPanel;
