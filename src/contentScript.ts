document.addEventListener("copy", () => {
    const selection = document.getSelection();
    chrome.runtime.sendMessage({ selectionText: selection ? selection.toString() : "" });
});
