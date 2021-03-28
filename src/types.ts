export const NerorenClipboard = "NerorenClipboard";
export const NerorenClipboardSettings = "NerorenClipboardSettings";
export const ContextMenuItemId = "neroren-clipboard-save";
export const ContextMenuItemIdForPage = "neroren-clipboard-save-page";
export type Language = "CHINESE" | "ENGLISH" | "JAPANESE" | "KOREAN";
export enum DefaultLocation {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}
export interface Settings {
    language: Language;
    autoSave: boolean;
    numOfLines: number;
    defaultLocation: DefaultLocation;
}
export interface Note {
    data: {
        type: string;
        content: string;
    };
    pageUrl: string;
    date: string;
    title: string | undefined;
    isPinned: boolean;
}
export interface ContentsByLanguage {
    settingsHeader: string;
    selectLabel: string;
    optionText: string;
    toggleMessageText: string;
    lineSettingMessageText: string;
    topModal: string;
    bottomModalCopy: string;
    bottomModalRemove: string;
    headerContent: string;
    confirmText: {
        yes: string;
        no: string;
    };
    showText: {
        more: string;
        less: string;
    };
    locationSelectLabel: string;
    location: {
        left: string;
        right: string;
    };
    timeFormat: (
        year: number,
        month: number,
        date: number,
        hours: number | string,
        minutes: number | string,
        seconds: number | string
    ) => string;
    contextMenusTitle: string;
}
export type LangDic = {
    [key in Language]: ContentsByLanguage;
};
export enum ModalType {
    COPY = "COPY",
    REMOVE = "REMOVE",
}
