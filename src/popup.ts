import { createNote } from "./components/Note";
import { setHeader, changeHeaderLanguage } from "./components/Header";
import { changeTopModalLanguage } from "./components/TopModal";
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
    isPinned: boolean;
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

    setHeader(settings.language);
});

const initNotes = (settings: Settings) => {
    chrome.storage.local.get(NerorenClipboard, (result) => {
        const notes: NerorenClipboardType[] = result[NerorenClipboard];
        if (notes) {
            notes.forEach((note) => {
                createNote(note, settings);
            });
        }
    });
};

initNotes(getSettings());

const removeAllNotes = () => {
    const noteWrapper = document.querySelector("#note-wrapper");
    while (noteWrapper?.firstChild) {
        const lastChild = noteWrapper.lastChild!;
        noteWrapper.removeChild(lastChild);
    }
};

chrome.runtime.onMessage.addListener((message) => {
    chrome.storage.sync.get(NerorenClipboardSettings, (result) => {
        const settings: Settings = result[NerorenClipboardSettings];
        const { type } = message;
        switch (type) {
            case "createNote":
                const { note } = message;
                createNote(note, settings);
                break;
            case "changePopupLanguage":
                changeHeaderLanguage(settings.language);
                changeTopModalLanguage(settings.language);
                removeAllNotes();
                initNotes(settings);
                break;
            case "removed":
            case "changeLine":
            case "pinned":
                removeAllNotes();
                initNotes(settings);
                break;
            case "restore":
                const { notes } = message;
                notes.forEach((note: NerorenClipboardType) => {
                    createNote(note, settings);
                });
            default:
                break;
        }
    });
});
