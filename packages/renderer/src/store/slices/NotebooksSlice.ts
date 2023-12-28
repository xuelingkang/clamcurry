import { NotebookVo, NoteVo } from '@clamcurry/common';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface NotebooksState {
    notebooks: NotebookVo[];
    enabledNotebook: NotebookVo;
    notes: NoteVo[];
}

const initialState: NotebooksState = {
    notebooks: [],
    enabledNotebook: {} as NotebookVo,
    notes: [],
};

export const notebooksSlice = createSlice({
    name: 'notebooks',
    initialState,
    reducers: {
        updateNotebookState: (state: Draft<NotebooksState>, action: PayloadAction<Partial<NotebooksState>>) => {
            const payload = action.payload;
            if (payload.notebooks) {
                state.notebooks = payload.notebooks;
            }
            if (payload.enabledNotebook) {
                state.enabledNotebook = payload.enabledNotebook;
            }
            if (payload.notes) {
                state.notes = payload.notes;
            }
        },
    },
});

export const { updateNotebookState } = notebooksSlice.actions;

export default notebooksSlice.reducer;
