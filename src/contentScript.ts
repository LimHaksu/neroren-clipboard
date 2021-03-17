const lazyCopy = () => {
    setTimeout(async () => {
        let selection = document.getSelection()?.toString().trim();

        // for google spread sheet
        if (!selection) {
            const tempDom = document.createElement("textarea");
            tempDom.style.position = "absolute";
            tempDom.style.top = `${window.innerHeight / 2}px`;
            tempDom.style.zIndex = "-9999";
            document.body.appendChild(tempDom);
            tempDom.focus();
            document.execCommand("paste");
            selection = tempDom.value;
            tempDom.remove();
        }

        chrome.runtime.sendMessage({
            type: "copy",
            data: { selectionText: selection },
        });
    }, 0);
};

document.addEventListener("copy", lazyCopy, {
    capture: true,
});
document.addEventListener("cut", lazyCopy, {
    capture: true,
});
