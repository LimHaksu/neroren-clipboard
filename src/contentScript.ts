document.addEventListener("copy", () => {
    const selection = document.getSelection();
    chrome.runtime.sendMessage({ type: "copy", data: { selectionText: selection ? selection.toString() : "" } });
});
