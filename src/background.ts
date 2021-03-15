const NerorenClipboard = "NerorenClipboard";
const NerorenClipboardSettings = "NerorenClipboardSettings";

enum Language {
    CHINESE = "CHINESE",
    ENGLISH = "ENGLISH",
    JAPANESE = "JAPANESE",
    KOREAN = "KOREAN",
}

interface Settings {
    language: Language;
    autoSave: boolean;
    numOfLines: number;
}

const ContextMenuItemId = "neroren-clipboard-save";

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
            };
        }
        chrome.contextMenus.create({
            id: ContextMenuItemId,
            title: getContextMenusTitle(settings.language),
            contexts: ["selection", "image", "link"],
        });
    });
};

setContextMenus();

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == ContextMenuItemId) {
        chrome.storage.local.get(NerorenClipboard, (result) => {
            let notes = result.NerorenClipboard;
            if (!notes) {
                notes = [];
            }
            const { linkUrl, srcUrl, selectionText, pageUrl } = info;
            const { title } = tab as chrome.tabs.Tab;
            let data = null;
            if (selectionText) {
                data = { type: "text", content: selectionText };
            } else if (srcUrl && srcUrl.substring(0, 10) !== "data:image") {
                data = { type: "image", content: srcUrl };
            } else if (linkUrl) {
                data = { type: "link", content: linkUrl };
            }

            if (data) {
                chrome.storage.local.set({
                    NerorenClipboard: [...notes, { data, pageUrl, date: new Date().toJSON(), title }],
                });
                chrome.action.setBadgeText({ text: `${notes.length + 1}` });
            }
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender) => {
    const { type } = message;
    if (type === "copy") {
        chrome.storage.sync.get(NerorenClipboardSettings, (settingResult) => {
            const settings = settingResult[NerorenClipboardSettings];
            if (settings.autoSave) {
                const { selectionText } = message.data;
                const { title, url: pageUrl } = sender.tab as chrome.tabs.Tab;
                chrome.storage.local.get(NerorenClipboard, (result) => {
                    let notes = result.NerorenClipboard;
                    if (!notes) {
                        notes = [];
                    }
                    const data = { type: "text", content: selectionText };
                    chrome.storage.local.set({
                        NerorenClipboard: [...notes, { data, pageUrl, date: new Date().toJSON(), title }],
                    });
                    chrome.action.setBadgeText({ text: `${notes.length + 1}` });
                });
            }
        });
    } else if (type === "setting") {
        setContextMenus();
    }
});

chrome.storage.local.get(NerorenClipboard, (result) => {
    let notes = result.NerorenClipboard;
    if (!notes) {
        notes = [];
    }
    chrome.action.setBadgeText({ text: notes.length > 0 ? `${notes.length}` : "" });
});

chrome.action.setBadgeBackgroundColor({ color: [0, 0, 0, 255] });
