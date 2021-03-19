import { setNerorenClipboard, getNerorenClipboard } from "storage/local";
import { getNerorenClipboardSettings } from "storage/sync";
import { NerorenClipboardSettings, ContextMenuItemId, ContextMenuItemIdForPage, Note } from "types";
import { getContextMenusTitle } from "libs/language";

const setContextMenus = async () => {
    try {
        chrome.contextMenus.remove(ContextMenuItemId);
        chrome.contextMenus.remove(ContextMenuItemIdForPage);

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
    await setNerorenClipboard([...notes, newNote]);
    chrome.action.setBadgeText({ text: `${notes.length + 1}` });
    chrome.runtime.sendMessage({ type: "createNote", note: newNote });
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    (async function () {
        if (info.menuItemId === ContextMenuItemId || info.menuItemId === ContextMenuItemIdForPage) {
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
        }
    })();
});

chrome.runtime.onMessage.addListener((message, sender) => {
    const { type } = message;
    if (type === "copy") {
        try {
            chrome.storage.sync.get(NerorenClipboardSettings, async (result) => {
                const settings = result[NerorenClipboardSettings];
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
            });
        } catch (e) {
            alert(e);
        }
    } else if (type === "setting") {
        setContextMenus();
    }
});

const init = async () => {
    try {
        const notes = await getNerorenClipboard();
        chrome.action.setBadgeText({ text: notes.length > 0 ? `${notes.length}` : "" });
        setContextMenus();
    } catch (e) {
        alert(e);
    }
};
init();

chrome.action.setBadgeBackgroundColor({ color: [0, 0, 0, 255] });
