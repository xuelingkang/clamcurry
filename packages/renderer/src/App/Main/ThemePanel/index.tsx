import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    FormControl,
    Grid,
    Input,
    InputAdornment,
    InputLabel,
    ListItemText,
    Menu,
    MenuItem,
    Popover,
    Select,
    Tooltip,
    Typography,
} from '@mui/material';
import { AssertUtils, ThemeBaseEnum, ThemeVo, UpdateThemeDto } from '@clamcurry/common';
import PromiseUtils from '@/utils/PromiseUtils';
import { ThemeContext } from '@/components/ThemeProvider';
import { useTranslation } from 'react-i18next';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { MuiColorInput } from 'mui-color-input';
import CopyThemeDialog, { ICopyThemeDialog } from '@/App/Main/ThemePanel/CopyThemeDialog';
import DeleteThemeDialog, { IDeleteThemeDialog } from '@/App/Main/ThemePanel/DeleteThemeDialog';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import If from '@/components/If';

const initialActiveTheme = {
    id: 0,
    name: '',
    base: ThemeBaseEnum.LIGHT,
} as ThemeVo;

const ThemePanel: FC = () => {
    const { t } = useTranslation();
    const { theme, updateTheme } = useContext(ThemeContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [themes, setThemes] = useState([] as ThemeVo[]);
    const [activeTheme, setActiveTheme] = useState(initialActiveTheme);
    const [themeForCopy, setThemeForCopy] = useState({} as ThemeVo);
    const [themeForDelete, setThemeForDelete] = useState({} as ThemeVo);
    const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
    const [popoverText, setPopoverText] = useState('');
    const copyThemeDialogRef = useRef<ICopyThemeDialog | null>(null);
    const deleteThemeDialogRef = useRef<IDeleteThemeDialog | null>(null);
    useEffect(() => {
        window.themeService
            .findAll()
            .then((themes) => {
                setThemes(themes);
                const newActiveTheme = themes.find((t) => t.id === theme.id);
                if (newActiveTheme) {
                    setActiveTheme(newActiveTheme);
                }
            })
            .catch(PromiseUtils.toastError);
    }, []);
    const updateActiveTheme = (key: keyof UpdateThemeDto, value: unknown) => {
        const newActiveTheme = {
            ...activeTheme,
            [key]: value,
        };
        setActiveTheme(newActiveTheme);
        if (newActiveTheme.id === theme.id) {
            updateTheme(newActiveTheme);
        }
        window.themeService.update(newActiveTheme).catch(PromiseUtils.toastError);
    };
    const handleClickThemeMenuButton = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
        setMenuOpen(true);
    };
    const handleActiveThemeChange = (themeItem: ThemeVo) => {
        setActiveTheme(themeItem);
        setMenuOpen(false);
    };
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const newThemes = themes.map((t) => {
            if (t.id !== activeTheme.id) {
                return t;
            }
            return {
                ...activeTheme,
                name: value,
            };
        });
        setThemes(newThemes);
        if (AssertUtils.isBlank(value)) {
            setActiveTheme({
                ...activeTheme,
                name: value,
            });
        } else {
            updateActiveTheme('name', value);
        }
    };
    const handleCopyTheme = (event: React.MouseEvent<HTMLButtonElement>, themeItem: ThemeVo) => {
        event.stopPropagation();
        setMenuOpen(false);
        const copyThemeDialogInstance = copyThemeDialogRef.current;
        if (!copyThemeDialogInstance) {
            return;
        }
        setThemeForCopy(themeItem);
        copyThemeDialogInstance.open();
    };
    const handleDeleteTheme = (event: React.MouseEvent<HTMLButtonElement>, themeItem: ThemeVo) => {
        event.stopPropagation();
        setMenuOpen(false);
        const deleteThemeDialogInstance = deleteThemeDialogRef.current;
        if (!deleteThemeDialogInstance) {
            return;
        }
        setThemeForDelete(themeItem);
        deleteThemeDialogInstance.open();
    };
    const handleCopyThemeSuccess = (newTheme: ThemeVo) => {
        const newThemes = [...themes, newTheme];
        setThemes(newThemes);
        setActiveTheme(newTheme);
    };
    const handleDeleteThemeSuccess = (deletedTheme: ThemeVo) => {
        const newThemes = themes.filter((t) => t.id !== deletedTheme.id);
        const deletedThemeIndex = themes.findIndex((t) => t.id === deletedTheme.id);
        const newActiveTheme = themes[deletedThemeIndex - 1];
        setThemes(newThemes);
        setActiveTheme(newActiveTheme);
    };
    return (
        <Box
            sx={{
                height: '100%',
                padding: '16px',
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
        >
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
            <Grid
                container
                spacing={'32px'}
                rowSpacing={'32px'}
                sx={{
                    width: '100%',
                    '.select-theme': {
                        '.MuiInputBase-root.MuiInput-root': {
                            '&, *': {
                                textAlign: 'start',
                                cursor: 'pointer',
                            },
                        },
                    },
                    '.Mui-disabled': {
                        color: `#${theme.foreground1}!important`,
                        WebkitTextFillColor: `#${theme.foreground1}!important`,
                        cursor: 'text!important',
                        ':before': {
                            borderBottomStyle: 'solid!important',
                        },
                    },
                }}
            >
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <FormControl className={'select-theme'} variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <InputLabel htmlFor={'select-theme'}>{t('themePanel.label.select')}</InputLabel>
                        <Input
                            aria-controls={menuOpen ? 'theme-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={menuOpen ? 'true' : undefined}
                            type={'button'}
                            value={
                                activeTheme.id === theme.id
                                    ? `${activeTheme.name}${t('themePanel.enabled')}`
                                    : activeTheme.name
                            }
                            onClick={handleClickThemeMenuButton}
                            endAdornment={
                                <InputAdornment position={'end'}>
                                    <If condition={menuOpen}>
                                        <ArrowDropUpIcon />
                                    </If>
                                    <If condition={!menuOpen}>
                                        <ArrowDropDownIcon />
                                    </If>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <Menu
                        id='theme-menu'
                        MenuListProps={{
                            'aria-labelledby': 'select-theme-button',
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
                        {themes.map((themeItem) => (
                            <MenuItem
                                key={themeItem.id}
                                onClick={() => handleActiveThemeChange(themeItem)}
                                selected={themeItem.id === activeTheme.id}
                            >
                                <ListItemText
                                    onMouseEnter={(e) => {
                                        const target = e.target as HTMLElement;
                                        if (target.scrollWidth > target.clientWidth) {
                                            setPopoverAnchorEl(target);
                                            setPopoverText(themeItem.name);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        setPopoverAnchorEl(null);
                                        setPopoverText('');
                                    }}
                                >
                                    {themeItem.name}
                                    <If condition={themeItem.id === theme.id}>{t('themePanel.enabled')}</If>
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
                                            '&.Mui-disabled': {
                                                border: 'none',
                                            },
                                            ':hover': {
                                                border: 'none',
                                            },
                                        },
                                    }}
                                >
                                    <ButtonGroup>
                                        <Tooltip title={t('themePanel.tooltip.copy')}>
                                            <Button onClick={(event) => handleCopyTheme(event, themeItem)}>
                                                <ContentCopyIcon fontSize={'small'} />
                                            </Button>
                                        </Tooltip>
                                        <If condition={!themeItem.preset && themeItem.id !== theme.id}>
                                            <Tooltip title={t('themePanel.tooltip.delete')}>
                                                <Button onClick={(event) => handleDeleteTheme(event, themeItem)}>
                                                    <BackspaceIcon fontSize={'small'} />
                                                </Button>
                                            </Tooltip>
                                        </If>
                                        <If condition={themeItem.preset || themeItem.id === theme.id}>
                                            <Button disabled>
                                                <BackspaceIcon fontSize={'small'} />
                                            </Button>
                                        </If>
                                    </ButtonGroup>
                                </Box>
                            </MenuItem>
                        ))}
                    </Menu>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <InputLabel htmlFor={'theme-name'}>{t('themePanel.label.name')}</InputLabel>
                        <Input
                            id={'theme-name'}
                            value={activeTheme.name}
                            onChange={handleNameChange}
                            disabled={activeTheme.preset}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <InputLabel id={'theme-base-label'}>{t('themePanel.label.base')}</InputLabel>
                        <Select
                            labelId={'theme-base-label'}
                            id={'theme-base'}
                            value={activeTheme.base}
                            onChange={(event) => updateActiveTheme('base', event.target.value as ThemeBaseEnum)}
                            disabled={activeTheme.preset}
                        >
                            <MenuItem value={ThemeBaseEnum.LIGHT}>{t('themePanel.values.base.light')}</MenuItem>
                            <MenuItem value={ThemeBaseEnum.DARK}>{t('themePanel.values.base.dark')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.foreground1')}
                            value={'#' + activeTheme.foreground1}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('foreground1', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.foreground2')}
                            value={'#' + activeTheme.foreground2}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('foreground2', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.foreground3')}
                            value={'#' + activeTheme.foreground3}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('foreground3', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.foreground4')}
                            value={'#' + activeTheme.foreground4}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('foreground4', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.background1')}
                            value={'#' + activeTheme.background1}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('background1', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.background2')}
                            value={'#' + activeTheme.background2}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('background2', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.background3')}
                            value={'#' + activeTheme.background3}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('background3', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.background4')}
                            value={'#' + activeTheme.background4}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('background4', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.divider1')}
                            value={'#' + activeTheme.divider1}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('divider1', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.divider2')}
                            value={'#' + activeTheme.divider2}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('divider2', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.scrollbar')}
                            value={'#' + activeTheme.scrollbar}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('scrollbar', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.selection')}
                            value={'#' + activeTheme.selection}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('selection', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.activeLine')}
                            value={'#' + activeTheme.activeLine}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('activeLine', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.lineNumber1')}
                            value={'#' + activeTheme.lineNumber1}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('lineNumber1', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.lineNumber2')}
                            value={'#' + activeTheme.lineNumber2}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('lineNumber2', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.highlighter1')}
                            value={'#' + activeTheme.highlighter1}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('highlighter1', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.highlighter2')}
                            value={'#' + activeTheme.highlighter2}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('highlighter2', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.highlighter3')}
                            value={'#' + activeTheme.highlighter3}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('highlighter3', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.highlighter4')}
                            value={'#' + activeTheme.highlighter4}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('highlighter4', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.highlighter5')}
                            value={'#' + activeTheme.highlighter5}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('highlighter5', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.highlighter6')}
                            value={'#' + activeTheme.highlighter6}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('highlighter6', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.primary')}
                            value={'#' + activeTheme.primary}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('primary', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.secondary')}
                            value={'#' + activeTheme.secondary}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('secondary', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.success')}
                            value={'#' + activeTheme.success}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('success', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.info')}
                            value={'#' + activeTheme.info}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('info', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.warning')}
                            value={'#' + activeTheme.warning}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('warning', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={2}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <MuiColorInput
                            variant={'standard'}
                            label={t('themePanel.label.error')}
                            value={'#' + activeTheme.error}
                            format={'hex8'}
                            disabled={activeTheme.preset}
                            onChange={(value) => updateActiveTheme('error', value.substring(1).toUpperCase())}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <CopyThemeDialog ref={copyThemeDialogRef} theme={themeForCopy} onSuccess={handleCopyThemeSuccess} />
            <DeleteThemeDialog ref={deleteThemeDialogRef} theme={themeForDelete} onSuccess={handleDeleteThemeSuccess} />
        </Box>
    );
};

export default ThemePanel;
