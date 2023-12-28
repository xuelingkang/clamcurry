import { combineReducers, configureStore, Middleware } from '@reduxjs/toolkit';
import appSlice from './slices/AppSlice';
import sidebarSlice from './slices/SidebarSlice';
import messageSlice from './slices/MessageSlice';
import notebooksSlice from './slices/NotebooksSlice';
import panelsSlice from './slices/PanelsSlice';

const middlewares: Middleware[] = [];
if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    middlewares.push(require('redux-logger').createLogger());
}

const reducers = combineReducers({
    appState: appSlice,
    sidebarState: sidebarSlice,
    messageState: messageSlice,
    notebooksState: notebooksSlice,
    panelsState: panelsSlice,
});

const store = configureStore({
    reducer: reducers,
    middleware: middlewares,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
