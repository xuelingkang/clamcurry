export default interface IMainEventService {
    handlePreferenceMenuEvent: (handler: () => void) => void;
    handleThemeMenuEvent: (handler: () => void) => void;
    handleNewNoteMenuEvent: (handler: () => void) => void;
    handleSearchNoteMenuEvent: (handler: () => void) => void;
    handleCloseNoteMenuEvent: (handler: () => void) => void;
    handleToggleSidebarMenuEvent: (handler: () => void) => void;
    handleToggleOutlineMenuEvent: (handler: () => void) => void;
    removePreferenceMenuEventListener: () => void;
    removeThemeMenuEventListener: () => void;
    removeNewNoteMenuEventListener: () => void;
    removeSearchNoteMenuEventListener: () => void;
    removeCloseNoteMenuEvent: () => void;
    removeToggleSidebarMenuEventListener: () => void;
    removeToggleOutlineMenuEventListener: () => void;
}
