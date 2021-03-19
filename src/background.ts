import { setNerorenClipboard, getNerorenClipboard } from "storage/local";
import { Settings } from "storage/sync";

const NerorenClipboardSettings = "NerorenClipboardSettings";
const ContextMenuItemId = "neroren-clipboard-save";
const ContextMenuItemIdForPage = "neroren-clipboard-save-page";

enum Language {
    CHINESE = "CHINESE",
    ENGLISH = "ENGLISH",
    JAPANESE = "JAPANESE",
    KOREAN = "KOREAN",
}

enum DefaultLocation {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

const getContextMenusTitle = (language: Language) => {
    const { CHINESE, ENGLISH, JAPANESE, KOREAN } = Language;
    switch (language) {
        case CHINESE:
            return "保存到Neroren剪贴板";
        case JAPANESE:
            return "Nerorenクリップボードに保存";
        case KOREAN:
            return "네로렌 클립보드에 저장";
        case ENGLISH:
        default:
            return "Save to Neroren Clipboard";
    }
};

const setContextMenus = () => {
    chrome.contextMenus.remove(ContextMenuItemId);

    chrome.storage.sync.get(NerorenClipboardSettings, (result) => {
        let settings: Settings | undefined = result[NerorenClipboardSettings];
        if (!settings) {
            settings = {
                autoSave: true,
                language: Language.ENGLISH,
                numOfLines: 3,
                defaultLocation: DefaultLocation.RIGHT,
            };
            chrome.storage.sync.set({ NerorenClipboardSettings: settings });
        }
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
    });
};

setContextMenus();

interface Note {
    data: {
        type: string;
        content: string;
    };
    pageUrl: string;
    date: string;
    title: string | undefined;
    isPinned: boolean;
}

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
    } catch (e) {
        alert(e);
    }
};
init();

chrome.action.setBadgeBackgroundColor({ color: [0, 0, 0, 255] });
