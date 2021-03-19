import { getTopModalContent, getConfirmText } from "libs/language";
import { Language, ModalType } from "types";
import { popupBottomModal } from "components/BottomModal";
import { getNerorenClipboard, setNerorenClipboard } from "storage/local";
import "./topModal.scss";

const el = document.querySelector("#top-modal");
const content = el?.querySelector(".content");
const yesButton = el?.querySelector("#yes-button") as HTMLButtonElement;
const noButton = el?.querySelector("#no-button") as HTMLButtonElement;

yesButton?.addEventListener("click", async () => {
    const noteDoms = document.getElementsByClassName("note");
    try {
        const notes = await getNerorenClipboard();
        const removedNotes = [] as any;
        const removedIndexes: number[] = [];
        notes.forEach((note, i) => {
            if (!note.isPinned) {
                removedNotes.push(note);
                removedIndexes.push(i);
            }
        });
        const remainedNotes = notes.filter((note) => note.isPinned);
        await setNerorenClipboard(remainedNotes);
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
    } catch (e) {
        alert(e);
    }
});

noButton?.addEventListener("click", () => {
    el?.classList.remove("visible");
});

/**
 *
 * @param {string} type
 */
export const popupTopModal = () => {
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
