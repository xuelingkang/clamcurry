import { EditorModeEnum, LanguageEnum } from '@clamcurry/common';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
    language: LanguageEnum;
    editorMode: EditorModeEnum;
    outlineWidth: number;
    fontSize: number;
    tabSize: number;
    vimMode: boolean;
    relativeLineNumber: boolean;
    searchNoteLimit: number;
}

const initialState: AppState = {} as AppState;

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        updateAppState: (state: Draft<AppState>, action: PayloadAction<Partial<AppState>>) => {
            const payload = action.payload;
            if (payload.language !== undefined) {
                state.language = payload.language;
            }
            if (payload.editorMode !== undefined) {
                state.editorMode = payload.editorMode;
            }
            if (payload.outlineWidth !== undefined) {
                state.outlineWidth = payload.outlineWidth;
            }
            if (payload.fontSize !== undefined) {
                state.fontSize = payload.fontSize;
            }
            if (payload.tabSize !== undefined) {
                state.tabSize = payload.tabSize;
            }
            if (payload.vimMode !== undefined) {
                state.vimMode = payload.vimMode;
            }
            if (payload.relativeLineNumber !== undefined) {
                state.relativeLineNumber = payload.relativeLineNumber;
            }
            if (payload.searchNoteLimit !== undefined) {
                state.searchNoteLimit = payload.searchNoteLimit;
            }
        },
    },
});

export const { updateAppState } = appSlice.actions;

export default appSlice.reducer;
