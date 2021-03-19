import {
    createNote,
    removeGridBeforeNotesCreated,
    makeGridAfterNoteCreated,
    removeAllNotes,
    initNotes,
} from "components/Note";
import { setHeader, changeHeaderLanguage } from "components/Header";
import { changeTopModalLanguage } from "components/TopModal";
import { getNerorenClipboardSettings } from "storage/sync";
import "popup.scss";

const init = async () => {
    const settings = await getNerorenClipboardSettings();
    setHeader(settings.language);
    changeTopModalLanguage(settings.language);
    initNotes(settings);
};
init();

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
