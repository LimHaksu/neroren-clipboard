import { NerorenClipboard, getSettings } from "../../popup";
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
        const notes = result.NerorenClipboard;
        chrome.storage.local.set({ NerorenClipboard: [] });
        chrome.action.setBadgeText({ text: "" });
        Array.from(noteDoms).forEach((noteDom) => {
            noteDom.remove();
        });
        el?.classList.remove("visible");
        popupBottomModal(ModalType.REMOVE, notes);
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
