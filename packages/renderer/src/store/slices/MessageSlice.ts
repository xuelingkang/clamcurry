import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export type MessageType = 'error' | 'warning' | 'info' | 'success';

export class Message {
    type: MessageType;
    content: string;
    duration: number;
}

export interface MessageState {
    value: Message;
}

const initialState: MessageState = {
    value: {} as Message,
};

export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessageState: (state: Draft<MessageState>, action: PayloadAction<Message>) => {
            state.value = action.payload;
        },
    },
});

export const { setMessageState } = messageSlice.actions;

export default messageSlice.reducer;
