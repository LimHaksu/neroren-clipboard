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
        const removedNotes = notes.filter((note) => !note.isPinned);
        const remainedNotes = notes.filter((note) => note.isPinned);
        chrome.storage.local.set({ NerorenClipboard: remainedNotes });
        chrome.action.setBadgeText({ text: "" });
        Array.from(noteDoms).forEach((noteDom) => {
            const pinImage = noteDom.querySelector(".pin-image");
            if (pinImage?.classList.contains("dn")) {
                noteDom.remove();
            }
        });
        popupBottomModal(ModalType.REMOVE, removedNotes);

        // synchronize other popups
        chrome.runtime.sendMessage({ type: "removed", removedNotes });

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
    if (el) {
        el.textContent = getTopModalContent(language);
    }
};
