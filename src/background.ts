const NerorenClipboard = "NerorenClipboard";
const NerorenClipboardSettings = "NerorenClipboardSettings";

enum Languages {
    CHINESE = "CHINESE",
    ENGLISH = "ENGLISH",
    JAPANESE = "JAPANESE",
    KOREAN = "KOREAN",
}

const getContextMenusTitle = (language: Languages) => {
    const { CHINESE, ENGLISH, JAPANESE, KOREAN } = Languages;
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

chrome.contextMenus.create({
    id: "neroren-clipboard-save",
    title: getContextMenusTitle(Languages.KOREAN),
    contexts: ["selection", "image", "link"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId == "neroren-clipboard-save") {
        chrome.storage.sync.get(NerorenClipboard, (result) => {
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
                chrome.storage.sync.set({
                    NerorenClipboard: [...notes, { data, pageUrl, date: new Date().toJSON(), title }],
                });
                chrome.action.setBadgeText({ text: `${notes.length + 1}` });
            }
        });
    }
});

// chrome.runtime.onMessage.addListener(function (message, callback) {
//     if (message == "runContentScript") {
//         chrome.tabs.executeScript({ file: "contentScript.js" });
//     }
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.storage.sync.get(NerorenClipboardSettings, (result) => {
        const settings = result[NerorenClipboardSettings];
        if (settings.autoSave) {
            const { selectionText } = message;
            const { title, url: pageUrl } = sender.tab as chrome.tabs.Tab;
            chrome.storage.sync.get(NerorenClipboard, (result) => {
                let notes = result.NerorenClipboard;
                if (!notes) {
                    notes = [];
                }
                const data = { type: "text", content: selectionText };
                chrome.storage.sync.set({
                    NerorenClipboard: [...notes, { data, pageUrl, date: new Date().toJSON(), title }],
                });
                chrome.action.setBadgeText({ text: `${notes.length + 1}` });
            });
        }
    });
});

chrome.storage.sync.get(NerorenClipboard, (result) => {
    let notes = result.NerorenClipboard;
    if (!notes) {
        notes = [];
    }
    chrome.action.setBadgeText({ text: notes.length > 0 ? `${notes.length}` : "" });
});

chrome.action.setBadgeBackgroundColor({ color: [0, 0, 0, 255] });
