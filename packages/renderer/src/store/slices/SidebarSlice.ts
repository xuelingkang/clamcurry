import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface SidebarState {
    showSidebar: boolean;
    sidebarWidth: number;
    mainWidth: string;
}

const initialState: SidebarState = {
    showSidebar: true,
    sidebarWidth: 0,
    mainWidth: '100%',
};

export const sidebarSlice = createSlice({
    name: 'sidebar',
    initialState,
    reducers: {
        updateSidebarState: (state: Draft<SidebarState>, action: PayloadAction<Partial<SidebarState>>) => {
            const payload = action.payload;
            if (payload.showSidebar !== undefined) {
                state.showSidebar = payload.showSidebar;
            }
            if (payload.sidebarWidth !== undefined) {
                state.sidebarWidth = payload.sidebarWidth;
            }
            if (payload.mainWidth !== undefined) {
                state.mainWidth = payload.mainWidth;
            }
        },
    },
});

export const { updateSidebarState } = sidebarSlice.actions;

export default sidebarSlice.reducer;
