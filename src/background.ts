import { setNerorenClipboard, getNerorenClipboard } from "storage/local";
import { getNerorenClipboardSettings } from "storage/sync";
import { NerorenClipboardSettings, ContextMenuItemId, ContextMenuItemIdForPage, Note } from "types";
import { getContextMenusTitle } from "libs/language";

const setContextMenus = async () => {
    try {
        const settings = await getNerorenClipboardSettings();
        chrome.contextMenus.create({
            id: ContextMenuItemId,
            title: getContextMenusTitle(settings.language),
            contexts: ["selection", "image", "link"],
        });
        chrome.contextMenus.create({
            id: ContextMenuItemIdForPage,
            title: getContextMenusTitle(settings.language),
            contexts: ["page"],
        });
    } catch (e) {
        alert(e);
    }
};

const addNewNote = async (notes: Note[], newNote: Note) => {
    try {
        await setNerorenClipboard([...notes, newNote]);
        chrome.browserAction.setBadgeText({ text: `${notes.length + 1}` });
        chrome.runtime.sendMessage({ type: "createNote", note: newNote });
    } catch (e) {
        alert(e);
    }
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    (async function () {
        if (info.menuItemId === ContextMenuItemId || info.menuItemId === ContextMenuItemIdForPage) {
            try {
                const notes = await getNerorenClipboard();
                const { linkUrl, srcUrl, selectionText, pageUrl } = info;
                const { title } = tab as chrome.tabs.Tab;
                let data = null;
                if (info.menuItemId === ContextMenuItemId) {
                    if (selectionText) {
                        data = { type: "text", content: selectionText };
                    } else if (srcUrl && srcUrl.substring(0, 10) !== "data:image") {
                        data = { type: "image", content: srcUrl };
                    } else if (linkUrl) {
                        data = { type: "link", content: linkUrl };
                    }
                } else if (info.menuItemId === ContextMenuItemIdForPage) {
                    data = { type: "link", content: pageUrl };
                }
                if (data) {
                    const newNote = { data, pageUrl, date: new Date().toJSON(), title, isPinned: false };
                    addNewNote(notes, newNote);
                }
            } catch (e) {
                alert(e);
            }
        }
    })();
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
    const { type } = message;
    if (type === "copy") {
        try {
            const settings = await getNerorenClipboardSettings();
            if (settings.autoSave) {
                const { selectionText } = message.data;
                const { title, url: pageUrl } = sender.tab as chrome.tabs.Tab;
                const notes = await getNerorenClipboard();
                const data = { type: "text", content: selectionText };
                const newNote = {
                    data,
                    pageUrl: pageUrl ? pageUrl : "",
                    date: new Date().toJSON(),
                    title,
                    isPinned: false,
                };
                addNewNote(notes, newNote);
            }
        } catch (e) {
            alert(e);
        }
    } else if (type === "setting") {
        setContextMenus();
    }
});

(async function init() {
    const textArea = document.querySelector("#textarea") as HTMLTextAreaElement;
    let prevSelection = "";
    if (textArea) {
        setInterval(() => {
            textArea.select();
            document.execCommand("paste");
            const selectionText = textArea.value;
            if (prevSelection !== selectionText) {
                chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                    const { title, url: pageUrl } = tabs[0] as chrome.tabs.Tab;
                    const notes = await getNerorenClipboard();
                    const data = { type: "text", content: selectionText };
                    const newNote = {
                        data,
                        pageUrl: pageUrl ? pageUrl : "",
                        date: new Date().toJSON(),
                        title,
                        isPinned: false,
                    };
                    addNewNote(notes, newNote);

                    prevSelection = selectionText;
                });
            }
        }, 1500);
    }
    try {
        const notes = await getNerorenClipboard();
        chrome.browserAction.setBadgeText({ text: notes.length > 0 ? `${notes.length}` : "" });
        setContextMenus();
    } catch (e) {
        alert(e);
    }
})();

chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 255] });
