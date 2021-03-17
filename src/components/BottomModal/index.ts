import {
    NerorenClipboardType,
    NerorenClipboard,
    removeAllNotes,
    initNotes,
    NerorenClipboardSettings,
} from "../../popup";
import { getBottomModalContent } from "../../libs/language";
import "./bottomModal.scss";

const body = document.querySelector("body");

export enum ModalType {
    COPY = "COPY",
    REMOVE = "REMOVE",
}
/**
 *
 * @param {string} type
 */
export const popupBottomModal = (type: ModalType, notes: NerorenClipboardType[], removedIndexes: number[]) => {
    const el = document.createElement("div");
    el.id = "bottom-modal";
    el.className = "bottom-modal";
    let isMouseOver = false;

    el.addEventListener("mouseover", () => {
        isMouseOver = true;
    });
    el.addEventListener("mouseout", () => {
        isMouseOver = false;
    });

    const lazyCloseModal = (el: HTMLElement) => {
        setTimeout(() => {
            if (isMouseOver) {
                lazyCloseModal(el);
            } else {
                el.classList.remove("visible");
                setTimeout(() => {
                    el.remove();
                }, 500);
            }
        }, 5000);
    };

    chrome.storage.sync.get(NerorenClipboardSettings, (settingsResult) => {
        const settings = settingsResult[NerorenClipboardSettings];
        switch (type) {
            case ModalType.COPY:
                el.textContent = getBottomModalContent(settings.language, ModalType.COPY);
                setTimeout(() => {
                    el.classList.remove("visible");
                }, 1500);
                break;
            case ModalType.REMOVE:
                el.textContent = getBottomModalContent(settings.language, ModalType.REMOVE);
                const undoButton = document.createElement("button");
                undoButton.className = "button button-undo";
                undoButton.innerHTML = `<div class="undo"></div>`;
                undoButton.addEventListener("click", () => {
                    chrome.storage.local.get(NerorenClipboard, (result) => {
                        let prevNotes: NerorenClipboardType[] | undefined = result[NerorenClipboard];
                        if (!prevNotes) {
                            prevNotes = [];
                        }
                        let newNotes = Array.from(Array(prevNotes.length + notes.length));
                        let indexOfRemovedIndex = 0;
                        let indexOfPrevNotes = 0;

                        newNotes = newNotes.map((_, i) => {
                            const removeIndex = removedIndexes[indexOfRemovedIndex];
                            if (removeIndex === i) {
                                indexOfRemovedIndex++;
                                return notes[indexOfRemovedIndex - 1];
                            }
                            indexOfPrevNotes++;
                            return (prevNotes as NerorenClipboardType[])[indexOfPrevNotes - 1];
                        });
                        console.log(notes, prevNotes, newNotes);
                        chrome.storage.local.set({ NerorenClipboard: newNotes });
                        chrome.action.setBadgeText({ text: newNotes.length > 0 ? `${newNotes.length}` : "" });

                        removeAllNotes();
                        initNotes(settings);

                        // synchronize other popups.
                        chrome.runtime.sendMessage({ type: "restore" });
                    });
                    el.classList.remove("visible");
                });

                el.appendChild(undoButton);

                lazyCloseModal(el);
                break;
        }
    });

    body?.appendChild(el);
    setTimeout(() => {
        el.classList.add("visible");
    }, 100);
};
