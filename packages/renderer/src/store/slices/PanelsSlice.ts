import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { ArrayUtils, NoteVo, TimeUtils } from '@clamcurry/common';

export const PREFERENCE_PANEL_ID = -1;
export const THEME_PANEL_ID = -2;
export const SEARCH_PANEL_ID = -3;

export enum PanelTypeEnum {
    NOTE,
    PREFERENCE,
    THEME,
    SEARCH,
}

export interface IPanel {
    id: number;
    title: string;
    translateTitle: boolean;
    lastVisitTime: number;
    type: PanelTypeEnum;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}

export interface PanelsState {
    panels: IPanel[];
    activePanelId: number;
    maxOpen: number;
}

const initialState: PanelsState = {
    panels: [],
    activePanelId: 0,
    maxOpen: 0,
};

const refreshLastVisitTimeById = (panels: IPanel[], id: number) => {
    return panels.map((panel) => {
        if (panel.id !== id) {
            return panel;
        }
        return {
            ...panel,
            lastVisitTime: TimeUtils.currentTimeMillis(),
        };
    });
};

export const panelsSlice = createSlice({
    name: 'panels',
    initialState,
    reducers: {
        updateMaxOpen: (state: Draft<PanelsState>, action: PayloadAction<number>) => {
            state.maxOpen = action.payload;
        },
        changePanel: (state: Draft<PanelsState>, action: PayloadAction<number>) => {
            const newActivePanelId = action.payload;
            state.panels = refreshLastVisitTimeById(state.panels, newActivePanelId);
            state.activePanelId = newActivePanelId;
        },
        openPreferencePanel: (state: Draft<PanelsState>) => {
            let preferencePanel = state.panels.find((panel) => panel.id === PREFERENCE_PANEL_ID);
            if (preferencePanel) {
                state.activePanelId = PREFERENCE_PANEL_ID;
                state.panels = refreshLastVisitTimeById(state.panels, PREFERENCE_PANEL_ID);
                return;
            }
            preferencePanel = {
                id: PREFERENCE_PANEL_ID,
                title: 'panel.title.preference',
                translateTitle: true,
                lastVisitTime: TimeUtils.currentTimeMillis(),
                type: PanelTypeEnum.PREFERENCE,
                data: null,
            };
            state.panels = [...state.panels, preferencePanel];
            state.activePanelId = PREFERENCE_PANEL_ID;
        },
        openThemePanel: (state: Draft<PanelsState>) => {
            let themePanel = state.panels.find((panel) => panel.id === THEME_PANEL_ID);
            if (themePanel) {
                state.activePanelId = THEME_PANEL_ID;
                state.panels = refreshLastVisitTimeById(state.panels, THEME_PANEL_ID);
                return;
            }
            themePanel = {
                id: THEME_PANEL_ID,
                title: 'panel.title.theme',
                translateTitle: true,
                lastVisitTime: TimeUtils.currentTimeMillis(),
                type: PanelTypeEnum.THEME,
                data: null,
            };
            state.panels = [...state.panels, themePanel];
            state.activePanelId = THEME_PANEL_ID;
        },
        openSearchPanel: (state: Draft<PanelsState>) => {
            let searchPanel = state.panels.find((panel) => panel.id === SEARCH_PANEL_ID);
            if (searchPanel) {
                state.activePanelId = SEARCH_PANEL_ID;
                state.panels = refreshLastVisitTimeById(state.panels, SEARCH_PANEL_ID);
                return;
            }
            searchPanel = {
                id: SEARCH_PANEL_ID,
                title: 'panel.title.search',
                translateTitle: true,
                lastVisitTime: TimeUtils.currentTimeMillis(),
                type: PanelTypeEnum.SEARCH,
                data: null,
            };
            state.panels = [...state.panels, searchPanel];
            state.activePanelId = SEARCH_PANEL_ID;
        },
        openNotePanel: (state: Draft<PanelsState>, action: PayloadAction<NoteVo>) => {
            const note = action.payload;
            let notePanel = state.panels.find((panel) => panel.id === note.id);
            if (notePanel) {
                state.activePanelId = note.id;
                state.panels = refreshLastVisitTimeById(state.panels, note.id);
                return;
            }
            notePanel = {
                id: note.id,
                title: note.title,
                translateTitle: false,
                lastVisitTime: TimeUtils.currentTimeMillis(),
                type: PanelTypeEnum.NOTE,
                data: note,
            };
            const panelIdsForClose: number[] = [];
            let notePanels = state.panels.filter((panel) => panel.type === PanelTypeEnum.NOTE);
            while (notePanels.length >= state.maxOpen) {
                const min = ArrayUtils.min(notePanels, 'lastVisitTime');
                panelIdsForClose.push(min.id);
                notePanels = notePanels.filter((panel) => panel.id !== min.id);
            }
            state.activePanelId = note.id;
            state.panels = [...state.panels, notePanel].filter(
                (panel) => !panelIdsForClose.length || !panelIdsForClose.includes(panel.id),
            );
        },
        closePanel: (state: Draft<PanelsState>, action: PayloadAction<number>) => {
            const id = action.payload;
            const newPanels = state.panels.filter((panel) => panel.id !== id);
            if (id === state.activePanelId) {
                if (newPanels && newPanels.length) {
                    const max = ArrayUtils.max(newPanels, 'lastVisitTime');
                    state.activePanelId = max.id;
                } else {
                    state.activePanelId = 0;
                }
            }
            state.panels = newPanels;
        },
        closeActivePanel: (state: Draft<PanelsState>) => {
            const activePanelId = state.activePanelId;
            if (!activePanelId) {
                return;
            }
            const newPanels = state.panels.filter((panel) => panel.id !== activePanelId);
            if (newPanels && newPanels.length) {
                const max = ArrayUtils.max(newPanels, 'lastVisitTime');
                state.activePanelId = max.id;
            } else {
                state.activePanelId = 0;
            }
            state.panels = newPanels;
        },
        updatePanelsState: (state: Draft<PanelsState>, action: PayloadAction<Partial<PanelsState>>) => {
            const payload = action.payload;
            if (payload.activePanelId !== undefined) {
                state.activePanelId = payload.activePanelId;
            }
            if (payload.maxOpen !== undefined) {
                state.maxOpen = payload.maxOpen;
            }
            if (payload.panels !== undefined) {
                state.panels = payload.panels;
                const newPanels = payload.panels;
                if (!newPanels.some((panel) => panel.id === state.activePanelId)) {
                    if (newPanels && newPanels.length) {
                        const max = ArrayUtils.max(newPanels, 'lastVisitTime');
                        state.activePanelId = max.id;
                    } else {
                        state.activePanelId = 0;
                    }
                }
            }
        },
    },
});

export const {
    updateMaxOpen,
    changePanel,
    openPreferencePanel,
    openThemePanel,
    openSearchPanel,
    openNotePanel,
    closePanel,
    closeActivePanel,
    updatePanelsState,
} = panelsSlice.actions;

export default panelsSlice.reducer;
