import { NerorenClipboardType, NerorenClipboard, Settings } from "../../popup";
import { Language, getShowText } from "../../libs/language";
import { ModalType, popupBottomModal } from "../BottomModal";
import "./note.scss";

declare class ClipboardItem {
    constructor(data: { [mimeType: string]: Blob });
}

interface Clipboard {
    write?(notes: Array<ClipboardItem>): Promise<void>;
}

const resetHeight = (noteWrapper: HTMLElement, noteDom: HTMLElement, rowGap: number, rowHeight: number) => {
    noteWrapper.style.display = "unset";
    const noteHieght = noteDom.getBoundingClientRect().height;
    const rowSpan = Math.ceil((noteHieght + rowGap) / (rowHeight + rowGap));
    noteDom.style.gridRowEnd = `span ${rowSpan}`;
    noteWrapper.style.display = "grid";
};

export const createNote = (note: NerorenClipboardType, settings: Settings) => {
    const noteWrapper: HTMLDivElement | null = document.querySelector("#note-wrapper");
    if (noteWrapper) {
        let { date } = note;
        const { pageUrl, data, title, isPinned } = note;
        date = new Date(date);
        const noteDom = document.createElement("div");
        noteDom.className = "note";
        const { type, content } = data;

        const pinDom = document.createElement("div");
        pinDom.className = `pin-image ${isPinned ? "" : "dn"}`;

        noteDom.appendChild(pinDom);

        const contentWrapper = document.createElement("div");
        contentWrapper.className = "content-wrapper";
        noteDom.appendChild(contentWrapper);
        const cornerShadow = document.createElement("div");
        cornerShadow.className = "corner-shadow";
        noteDom.appendChild(cornerShadow);

        const InnerWrapper = document.createElement("div");
        InnerWrapper.className = "content";
        contentWrapper.appendChild(InnerWrapper);

        const contentDom = document.createElement("div");

        // grid info
        const rowHeight = parseInt(window.getComputedStyle(noteWrapper).getPropertyValue("grid-auto-rows"));
        const rowGap = parseInt(window.getComputedStyle(noteWrapper).getPropertyValue("grid-row-gap"));

        switch (type) {
            case "text":
                contentDom.innerText = content;
                break;
            case "image":
                const imageContent = document.createElement("img") as HTMLImageElement;
                imageContent.className = "image";
                imageContent.onload = () => {
                    resetHeight(noteWrapper, noteDom, rowGap, rowHeight);
                };
                imageContent.src = content;
                contentDom.appendChild(imageContent);
                break;
            case "link":
                contentDom.innerHTML = `<a id="href-content" target="_blank" href="${content}"></a>`;
                const href = contentDom.querySelector("#href-content");
                href!.textContent = content;
                break;
            default:
                break;
        }
        InnerWrapper.appendChild(contentDom);

        const numOfLines = settings.numOfLines;
        const lineHeight = 20;
        const height = lineHeight * numOfLines;
        let is_collapse = false;
        setTimeout(() => {
            if ((type === "text" || type === "link") && contentDom.getBoundingClientRect().height > height) {
                is_collapse = true;
            }
            if (is_collapse) {
                contentDom.classList.add("collapse");
                contentDom.style.webkitLineClamp = `${numOfLines}`;

                const showText = getShowText(settings.language);
                const showMore = document.createElement("div");
                showMore.className = "show-more";
                showMore.textContent = showText.more;
                showMore.addEventListener("click", () => {
                    if (is_collapse) {
                        contentDom.style.webkitLineClamp = "unset";
                        showMore.textContent = showText.less;
                    } else {
                        contentDom.style.webkitLineClamp = `${numOfLines}`;
                        showMore.textContent = showText.more;
                    }
                    is_collapse = !is_collapse;

                    // set height for grid
                    resetHeight(noteWrapper, noteDom, rowGap, rowHeight);
                });

                InnerWrapper.appendChild(showMore);
            }

            // set height for grid
            resetHeight(noteWrapper, noteDom, rowGap, rowHeight);
        }, 0);

        const buttonWrapper = document.createElement("div");
        buttonWrapper.classList.add("button-wrapper");

        const copyButton = document.createElement("div");
        copyButton.className = "button button-copy";
        copyButton.innerHTML = `<div class="copy"></div>`;
        copyButton.addEventListener("click", async () => {
            if (type === "image") {
                try {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
                    setCanvasImage(canvas, ctx, content, (blob: Blob) => {
                        (navigator.clipboard as Clipboard).write!([
                            new ClipboardItem({
                                "image/png": blob,
                            }),
                        ]);
                    });
                    canvas.remove();
                    popupBottomModal(ModalType.COPY, [note]);
                } catch (error) {
                    console.error(error.name, error.message);
                }
            } else {
                const tempArea = document.createElement("textarea");
                tempArea.value = content;
                tempArea.style.position = "absolute";
                tempArea.style.left = "-9999px";
                document.body.appendChild(tempArea);
                tempArea.select();
                const isSuccessful = document.execCommand("copy");
                document.body.removeChild(tempArea);
                if (!isSuccessful) {
                    console.error("copy failed");
                }
                popupBottomModal(ModalType.COPY, [note]);
            }
        });

        const removeButton = document.createElement("div");
        removeButton.className = "button button-remove";
        removeButton.innerHTML = `<div class="remove"></div>`;
        removeButton.addEventListener("click", () => {
            chrome.storage.local.get(NerorenClipboard, (result) => {
                let notes = result.NerorenClipboard;
                if (notes) {
                    notes = notes.filter((note: NerorenClipboardType) => {
                        const noteDate = new Date(note.date);
                        return noteDate.getTime() !== date.getTime();
                    });
                    chrome.storage.local.set({ NerorenClipboard: notes });
                    chrome.action.setBadgeText({ text: notes.length > 0 ? `${notes.length}` : "" });

                    // remove inself
                    noteDom.remove();
                    popupBottomModal(ModalType.REMOVE, [note]);

                    // synchronize other popups
                    chrome.runtime.sendMessage({ type: "removed" });
                }
            });
        });

        const pinButton = document.createElement("div");
        pinButton.className = "button button-pin";
        pinButton.innerHTML = '<div class="pin"></div>';
        pinButton.addEventListener("click", () => {
            chrome.storage.local.get(NerorenClipboard, (result) => {
                const notes: NerorenClipboardType[] = result[NerorenClipboard];
                const noteIndex = notes.findIndex((note) => new Date(note.date).getTime() === date.getTime());
                if (noteIndex >= 0) {
                    const isPinned = !notes[noteIndex].isPinned;
                    if (isPinned) {
                        removeButton.setAttribute("disabled", "true");
                        pinDom.classList.remove("dn");
                    } else {
                        removeButton.setAttribute("disabled", "false");
                        pinDom.classList.add("dn");
                    }
                    notes[noteIndex].isPinned = isPinned;
                    chrome.storage.local.set({ NerorenClipboard: notes });

                    // synchronize other popups
                    chrome.runtime.sendMessage({ type: "pinned" });
                }
            });
        });

        buttonWrapper.appendChild(copyButton);
        buttonWrapper.appendChild(removeButton);
        buttonWrapper.appendChild(pinButton);

        if (type === "image") {
            const downloadButton = document.createElement("div");
            downloadButton.className = "button button-download";
            downloadButton.innerHTML = `<div class='download'></div>`;
            downloadButton.addEventListener("click", () => {
                chrome.downloads.download({ url: content });
            });

            buttonWrapper.appendChild(downloadButton);
        }

        noteDom.appendChild(buttonWrapper);

        const bottomWrapper = document.createElement("div");
        contentWrapper.appendChild(bottomWrapper);

        const pageUrlDom = document.createElement("div");
        pageUrlDom.innerHTML = `<span style="font-style:italic;"><a target="_blank" href="${pageUrl}"></a></span>`;
        pageUrlDom.className = "from";
        const urlHref = pageUrlDom.querySelector("a");
        urlHref!.textContent = title;
        bottomWrapper.appendChild(pageUrlDom);

        const timeDom = document.createElement("div");
        timeDom.textContent = getTimeText(date, settings.language);
        timeDom.className = "time";
        bottomWrapper.appendChild(timeDom);

        setTimeout(() => {
            noteWrapper.style.display = "unset";
            const noteHieght = noteDom.getBoundingClientRect().height;
            const rowSpan = Math.ceil((noteHieght + rowGap) / (rowHeight + rowGap));
            noteDom.style.gridRowEnd = `span ${rowSpan}`;
            noteWrapper.style.display = "grid";
        }, 0);
        noteWrapper?.insertBefore(noteDom, noteWrapper.firstChild);
    }
};

const getTimeText = (date: Date, language: Language) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dateText = date.getDate();
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();
    let seconds: string | number = date.getSeconds();
    hours = insertLeadingZero(hours);
    minutes = insertLeadingZero(minutes);
    seconds = insertLeadingZero(seconds);
    const countryMap = {
        CHINESE: `${year}年 ${month}月 ${dateText}日 ${hours} : ${minutes} : ${seconds}`,
        ENGLISH: `${month}/${dateText}/${year} ${hours} : ${minutes} : ${seconds}`,
        JAPANESE: `${year}年 ${month}月 ${dateText}日 ${hours} : ${minutes} : ${seconds}`,
        KOREAN: `${year}년 ${month}월 ${dateText}일 ${hours} : ${minutes} : ${seconds}`,
    };
    return countryMap[language];
};

const insertLeadingZero = (number: number) => {
    return number < 10 ? "0" + number : number;
};

const setCanvasImage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, path: string, callback: Function) => {
    const img = new Image();
    img.onload = function () {
        canvas.width = (this as HTMLImageElement).naturalWidth;
        canvas.height = (this as HTMLImageElement).naturalHeight;

        // if the background of the image is transparent, fill the space white instead of black.
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(this as HTMLImageElement, 0, 0);

        canvas.toBlob((blob) => {
            callback(blob);
        }, "image/png");
    };
    img.crossOrigin = "anonymous";
    img.src = path;
};
