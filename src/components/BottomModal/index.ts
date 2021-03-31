import { removeAllNotes, initNotes } from "components/Note";
import { getNerorenClipboard, setNerorenClipboard } from "storage/local";
import { Note, ModalType } from "types";
import { getNerorenClipboardSettings } from "storage/sync";
import { getBottomModalContent } from "libs/language";
import "./bottomModal.scss";

const body = document.querySelector("body");

/**
 *
 * @param {string} type
 */
export const popupBottomModal = async (type: ModalType, notes: Note[], removedIndexes: number[]) => {
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
    try {
        const settings = await getNerorenClipboardSettings();
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
                undoButton.addEventListener("click", async () => {
                    try {
                        const prevNotes = await getNerorenClipboard();
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
                            return (prevNotes as Note[])[indexOfPrevNotes - 1];
                        });
                        await setNerorenClipboard(newNotes);
                        chrome.browserAction.setBadgeText({ text: newNotes.length > 0 ? `${newNotes.length}` : "" });

                        removeAllNotes();
                        initNotes(settings);

                        // synchronize other popups.
                        chrome.runtime.sendMessage({ type: "restore" });

                        el.classList.remove("visible");
                    } catch (e) {
                        alert(e);
                    }
                });

                el.appendChild(undoButton);

                lazyCloseModal(el);
                break;
        }

        body?.appendChild(el);
        setTimeout(() => {
            el.classList.add("visible");
        }, 100);
    } catch (e) {
        alert(e);
    }
};
