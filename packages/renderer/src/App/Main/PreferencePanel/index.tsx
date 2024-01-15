import React, { FC, useContext, useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Slider,
} from '@mui/material';
import { EditorModeEnum, LanguageEnum, PreferenceVo, ThemeVo, UpdatePreferenceDto } from '@clamcurry/common';
import PromiseUtils from '../../../utils/PromiseUtils';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../store/hooks';
import { updateAppState } from '../../../store/slices/AppSlice';
import { ThemeContext } from '../../../components/ThemeProvider';
import { updatePanelsState } from '../../../store/slices/PanelsSlice';
import { updateSidebarState } from '../../../store/slices/SidebarSlice';

const initialPreference = {
    id: 1,
    language: LanguageEnum.en_US,
    editorMode: EditorModeEnum.EDITOR_PREVIEW,
    sidebarWidth: 100,
    outlineWidth: 100,
    maxOpen: 1,
    fontSize: 12,
    tabSize: 2,
    vimMode: false,
    searchNoteLimit: 20,
    themeId: 0,
} as PreferenceVo;

const PreferencePanel: FC = () => {
    const { t } = useTranslation();
    const { updateTheme } = useContext(ThemeContext);
    const [preference, setPreference] = useState(initialPreference);
    const [themes, setThemes] = useState([] as ThemeVo[]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        window.preferenceService.find().then(setPreference).catch(PromiseUtils.toastError);
        window.themeService.findAll().then(setThemes).catch(PromiseUtils.toastError);
    }, []);
    const updatePreferenceState = (key: keyof UpdatePreferenceDto, value: unknown) => {
        const newPreference = {
            ...preference,
            [key]: value,
        };
        setPreference(newPreference);
        return newPreference;
    };
    const submit = (preference: UpdatePreferenceDto) => {
        window.preferenceService.update(preference).catch(PromiseUtils.toastError);
    };
    const handleLanguageChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const language = value as LanguageEnum;
        const newPreference = updatePreferenceState('language', language);
        submit(newPreference);
        dispatch(
            updateAppState({
                language,
            }),
        );
    };
    const handleThemeIdChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const themeId = parseInt(value);
        const newPreference = updatePreferenceState('themeId', themeId);
        submit(newPreference);
        window.themeService.findById(themeId).then(updateTheme).catch(PromiseUtils.toastError);
    };
    const handleEditorModeChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const editorMode = parseInt(value) as EditorModeEnum;
        const newPreference = updatePreferenceState('editorMode', editorMode);
        submit(newPreference);
        dispatch(
            updateAppState({
                editorMode,
            }),
        );
    };
    const handleVimModeChange = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const vimMode = value === 'true';
        const newPreference = updatePreferenceState('vimMode', vimMode);
        submit(newPreference);
        dispatch(
            updateAppState({
                vimMode,
            }),
        );
    };
    const handleSidebarWidthChangeCommit = (value: number) => {
        dispatch(
            updateSidebarState({
                sidebarWidth: value,
            }),
        );
        const newPreference = updatePreferenceState('sidebarWidth', value);
        submit(newPreference);
    };
    const handleOutlineWidthChangeCommit = (value: number) => {
        dispatch(
            updateAppState({
                outlineWidth: value,
            }),
        );
        const newPreference = updatePreferenceState('outlineWidth', value);
        submit(newPreference);
    };
    const handleFontSizeChangeCommit = (value: number) => {
        dispatch(
            updateAppState({
                fontSize: value,
            }),
        );
        const newPreference = updatePreferenceState('fontSize', value);
        submit(newPreference);
    };
    const handleTabSizeChangeCommit = (value: number) => {
        dispatch(
            updateAppState({
                tabSize: value,
            }),
        );
        const newPreference = updatePreferenceState('tabSize', value);
        submit(newPreference);
    };
    const handleMaxOpenChangeCommit = (value: number) => {
        dispatch(
            updatePanelsState({
                maxOpen: value,
            }),
        );
        const newPreference = updatePreferenceState('maxOpen', value);
        submit(newPreference);
    };
    const handleSearchNoteLimitChangeCommit = (value: number) => {
        dispatch(
            updateAppState({
                searchNoteLimit: value,
            }),
        );
        const newPreference = updatePreferenceState('searchNoteLimit', value);
        submit(newPreference);
    };
    return (
        <Box
            sx={{
                height: '100%',
                padding: '16px',
                overflow: 'auto',
            }}
        >
            <Grid container spacing={'32px'} rowSpacing={'32px'} sx={{ width: '100%' }}>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <InputLabel id={'language-select-label'}>{t('preferencePanel.label.language')}</InputLabel>
                        <Select
                            labelId={'language-select-label'}
                            id={'language-select'}
                            value={preference.language}
                            onChange={handleLanguageChange}
                        >
                            <MenuItem value={LanguageEnum.en_US}>{t('preferencePanel.values.language.en_US')}</MenuItem>
                            <MenuItem value={LanguageEnum.zh_CN}>{t('preferencePanel.values.language.zh_CN')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <InputLabel id={'theme-label'}>{t('preferencePanel.label.themeId')}</InputLabel>
                        <Select
                            labelId={'theme-label'}
                            id={'theme'}
                            value={(preference.themeId || '').toString()}
                            onChange={handleThemeIdChange}
                        >
                            {themes.map((theme) => (
                                <MenuItem key={theme.id} value={theme.id.toString()}>
                                    {theme.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <InputLabel id={'editor-mode-label'}>{t('preferencePanel.label.editorMode')}</InputLabel>
                        <Select
                            labelId={'editor-mode-label'}
                            id={'editor-mode'}
                            value={preference.editorMode.toString()}
                            onChange={handleEditorModeChange}
                        >
                            <MenuItem value={EditorModeEnum.EDITOR.toString()}>
                                {t('preferencePanel.values.editorMode.editor')}
                            </MenuItem>
                            <MenuItem value={EditorModeEnum.EDITOR_PREVIEW.toString()}>
                                {t('preferencePanel.values.editorMode.editorPreview')}
                            </MenuItem>
                            <MenuItem value={EditorModeEnum.PREVIEW.toString()}>
                                {t('preferencePanel.values.editorMode.preview')}
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <InputLabel id={'vim-mode-label'}>{t('preferencePanel.label.vimMode')}</InputLabel>
                        <Select
                            labelId={'vim-mode-label'}
                            id={'vim-mode'}
                            value={preference.vimMode.toString()}
                            onChange={handleVimModeChange}
                        >
                            <MenuItem value={'true'}>{t('preferencePanel.values.vimMode.yes')}</MenuItem>
                            <MenuItem value={'false'}>{t('preferencePanel.values.vimMode.no')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <FormHelperText component={'label'}>{t('preferencePanel.label.sidebarWidth')}</FormHelperText>
                        <Slider
                            min={100}
                            max={500}
                            marks={[
                                {
                                    value: preference.sidebarWidth,
                                    label: `${preference.sidebarWidth}px`,
                                },
                            ]}
                            value={preference.sidebarWidth}
                            onChange={(_event, value) => updatePreferenceState('sidebarWidth', value)}
                            onChangeCommitted={(_event, value) => handleSidebarWidthChangeCommit(value as number)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <FormHelperText component={'label'}>{t('preferencePanel.label.outlineWidth')}</FormHelperText>
                        <Slider
                            min={100}
                            max={500}
                            marks={[
                                {
                                    value: preference.outlineWidth,
                                    label: `${preference.outlineWidth}px`,
                                },
                            ]}
                            value={preference.outlineWidth}
                            onChange={(_event, value) => updatePreferenceState('outlineWidth', value)}
                            onChangeCommitted={(_event, value) => handleOutlineWidthChangeCommit(value as number)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <FormHelperText component={'label'}>{t('preferencePanel.label.fontSize')}</FormHelperText>
                        <Slider
                            min={12}
                            max={20}
                            marks={[
                                {
                                    value: preference.fontSize,
                                    label: `${preference.fontSize}px`,
                                },
                            ]}
                            value={preference.fontSize}
                            onChange={(_event, value) => updatePreferenceState('fontSize', value)}
                            onChangeCommitted={(_event, value) => handleFontSizeChangeCommit(value as number)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <FormHelperText component={'label'}>{t('preferencePanel.label.tabSize')}</FormHelperText>
                        <Slider
                            min={2}
                            max={8}
                            step={2}
                            marks={[
                                {
                                    value: preference.tabSize,
                                    label: `${preference.tabSize}`,
                                },
                            ]}
                            value={preference.tabSize}
                            onChange={(_event, value) => updatePreferenceState('tabSize', value)}
                            onChangeCommitted={(_event, value) => handleTabSizeChangeCommit(value as number)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <FormHelperText component={'label'}>{t('preferencePanel.label.maxOpen')}</FormHelperText>
                        <Slider
                            min={1}
                            max={10}
                            marks={[
                                {
                                    value: preference.maxOpen,
                                    label: `${preference.maxOpen}`,
                                },
                            ]}
                            value={preference.maxOpen}
                            onChange={(_event, value) => updatePreferenceState('maxOpen', value)}
                            onChangeCommitted={(_event, value) => handleMaxOpenChangeCommit(value as number)}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                    <FormControl variant={'standard'} sx={{ m: 1, width: '100%' }}>
                        <FormHelperText component={'label'}>
                            {t('preferencePanel.label.searchNoteLimit')}
                        </FormHelperText>
                        <Slider
                            min={20}
                            max={100}
                            step={10}
                            marks={[
                                {
                                    value: preference.searchNoteLimit,
                                    label: `${preference.searchNoteLimit}`,
                                },
                            ]}
                            value={preference.searchNoteLimit}
                            onChange={(_event, value) => updatePreferenceState('searchNoteLimit', value)}
                            onChangeCommitted={(_event, value) => handleSearchNoteLimitChangeCommit(value as number)}
                        />
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PreferencePanel;
