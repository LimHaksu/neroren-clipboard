import { NerorenClipboard, getSettings, NerorenClipboardType } from "../../popup";
import { getTopModalContent, getConfirmText } from "../../libs/language";
import { ModalType, popupBottomModal } from "../BottomModal";
import "./topModal.scss";

const el = document.querySelector("#top-modal");
const content = el?.querySelector(".content");
const yesButton = el?.querySelector("#yes-button") as HTMLButtonElement;
const noButton = el?.querySelector("#no-button") as HTMLButtonElement;

yesButton?.addEventListener("click", () => {
    const noteDoms = document.getElementsByClassName("note");
    chrome.storage.local.get(NerorenClipboard, (result) => {
        const notes: NerorenClipboardType[] = result.NerorenClipboard;
        const removedNotes = [] as any;
        const removedIndexes: number[] = [];
        notes.forEach((note, i) => {
            if (!note.isPinned) {
                removedNotes.push(note);
                removedIndexes.push(i);
            }
        });
        const remainedNotes = notes.filter((note) => note.isPinned);
        chrome.storage.local.set({ NerorenClipboard: remainedNotes });
        chrome.action.setBadgeText({ text: remainedNotes.length === 0 ? "" : `${remainedNotes.length}` });

        // remove unpinned notes
        Array.from(noteDoms).forEach((noteDom) => {
            const pinImage = noteDom.querySelector(".pin-image");
            if ((noteDom as HTMLDivElement).dataset.ispinned === "false") {
                noteDom.remove();
            }
        });
        popupBottomModal(ModalType.REMOVE, removedNotes, removedIndexes);

        // synchronize other popups
        chrome.runtime.sendMessage({ type: "removed" });

        el?.classList.remove("visible");
    });
});

noButton?.addEventListener("click", () => {
    el?.classList.remove("visible");
});

/**
 *
 * @param {string} type
 */
export const popupTopModal = () => {
    const settings = getSettings();
    content!.textContent = getTopModalContent(settings.language);
    const confirmText = getConfirmText(settings.language);
    yesButton!.innerText = confirmText.yes;
    noButton!.innerText = confirmText.no;

    el?.classList.add("visible");
};

export const changeTopModalLanguage = (language: Language) => {
    if (content) {
        content.textContent = getTopModalContent(language);
        const confirmText = getConfirmText(language);
        yesButton!.innerText = confirmText.yes;
        noButton!.innerText = confirmText.no;
    }
};
