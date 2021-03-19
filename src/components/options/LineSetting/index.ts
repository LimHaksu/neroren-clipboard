import { getNerorenClipboardSettings, setNerorenClipboardSettings } from "storage/sync";
import { getLineSettingMessageText } from "libs/language";
import "./lineSetting.scss";

export const renderLineSetting = async () => {
    const upButton = document.querySelector("#up-button");
    const downButton = document.querySelector("#down-button");
    const numDom = document.querySelector("#line-text");
    const message = document.querySelector("#line-message");
    try {
        const settings = await getNerorenClipboardSettings();

        if (numDom) {
            numDom.textContent = `${settings.numOfLines}`;
        }
        if (message) {
            message.textContent = getLineSettingMessageText(settings.language);
        }
        upButton?.addEventListener("click", async () => {
            try {
                const newNum = +numDom?.textContent! + 1;
                const settings = await getNerorenClipboardSettings();
                settings.numOfLines = newNum;
                await setNerorenClipboardSettings(settings);
                numDom!.textContent = `${newNum}`;

                // synchronize other popups
                chrome.runtime.sendMessage({ type: "changeLine" });
            } catch (e) {
                alert(e);
            }
        });
        downButton?.addEventListener("click", async () => {
            const newNum = +numDom?.textContent! - 1;
            if (newNum > 0) {
                try {
                    const settings = await getNerorenClipboardSettings();
                    settings.numOfLines = newNum;
                    await setNerorenClipboardSettings(settings);
                    numDom!.textContent = `${newNum}`;

                    // synchronize other popups
                    chrome.runtime.sendMessage({ type: "changeLine" });
                } catch (e) {
                    alert(e);
                }
            }
        });
    } catch (e) {
        alert(e);
    }
};
