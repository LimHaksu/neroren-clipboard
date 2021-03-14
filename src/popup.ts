import { createNote } from "./components/Note";
import { setHeaderContent } from "./components/Header";
import { Language } from "./libs/language";
import "./popup.scss";

export const NerorenClipboard = "NerorenClipboard";
export const NerorenClipboardSettings = "NerorenClipboardSettings";

export interface NerorenClipboardType {
    data: {
        type: string;
        content: string;
    };
    pageUrl: string;
    date: Date;
    title: string;
}

export interface Settings {
    language: Language;
    autoSave: boolean;
    numOfLines: number;
}

let settings: Settings = {
    language: Language.ENGLISH,
    autoSave: true,
    numOfLines: 3,
};

export const getSettings = () => {
    return settings;
};

export const setSettings = (newSettings: Settings) => {
    settings = newSettings;
    chrome.storage.sync.set({ NerorenClipboardSettings: newSettings }, () => {
        chrome.runtime.sendMessage({ type: "setting" });
    });
};

chrome.storage.sync.get(NerorenClipboardSettings, (result) => {
    let newSettings: Settings = result[NerorenClipboardSettings];
    if (newSettings) {
        settings = newSettings;
    } else {
        // If there are not settings in storage, initiate them
        newSettings = settings;
        chrome.storage.sync.set({ NerorenClipboardSettings: newSettings });
    }

    setHeaderContent(settings.language);
});

chrome.storage.sync.get(NerorenClipboard, (result) => {
    const notes: NerorenClipboardType[] = result[NerorenClipboard];
    if (notes) {
        notes.forEach(({ data, pageUrl, date, title }) => {
            createNote({ data, pageUrl, date, title });
        });
    }
});
