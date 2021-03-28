async function getClipboardContents() {
    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (err) {
        console.error("Failed to read clipboard contents: ", err);
    }
}
let previousSelectionText = "";
setInterval(async () => {
    const selectionText = await getClipboardContents();
    if (selectionText && previousSelectionText !== selectionText) {
        previousSelectionText = selectionText;
        chrome.runtime.sendMessage({
            type: "copy",
            data: { selectionText },
        });
    }
}, 1500);
