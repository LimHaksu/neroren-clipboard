import {
    createNote,
    removeGridBeforeNotesCreated,
    makeGridAfterNotesCreated,
    makeGridAfterNoteCreated,
} from "./components/Note";
import { setHeader, changeHeaderLanguage } from "./components/Header";
import { changeTopModalLanguage } from "./components/TopModal";
import { getNerorenClipboardSettings, Settings } from "./storage/sync";
import { getNerorenClipboard } from "./storage/local";
import "./popup.scss";

export const NerorenClipboard = "NerorenClipboard";
export const NerorenClipboardSettings = "NerorenClipboardSettings";

const init = async () => {
    const settings = await getNerorenClipboardSettings();
    setHeader(settings.language);
    changeTopModalLanguage(settings.language);
    initNotes(settings);
};
init();

export const initNotes = async (settings: Settings) => {
    const notes = await getNerorenClipboard();
    const noteWrapper = document.querySelector("#note-wrapper") as HTMLElement;
    removeGridBeforeNotesCreated(noteWrapper);
    notes.forEach((note) => {
        createNote(note, settings);
    });
    const noteDoms = document.querySelectorAll<HTMLElement>(".note");
    makeGridAfterNotesCreated(noteWrapper, noteDoms);
};

export const removeAllNotes = () => {
    const noteWrapper = document.querySelector("#note-wrapper");
    while (noteWrapper?.firstChild) {
        const lastChild = noteWrapper.lastChild!;
        noteWrapper.removeChild(lastChild);
    }
};

chrome.runtime.onMessage.addListener(async (message) => {
    const settings = await getNerorenClipboardSettings();
    const { type } = message;
    switch (type) {
        case "createNote":
            const { note } = message;
            const noteWrapper = document.querySelector("#note-wrapper") as HTMLElement;
            removeGridBeforeNotesCreated(noteWrapper);
            const createdNoteDom = createNote(note, settings) as HTMLElement;
            makeGridAfterNoteCreated(noteWrapper, createdNoteDom);
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
        case "restore":
            removeAllNotes();
            initNotes(settings);
            break;
        default:
            break;
    }
});
