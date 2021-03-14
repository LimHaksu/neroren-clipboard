import { getSettings, setSettings } from "../../../popup";
import { getLineSettingMessageText } from "../../../libs/language";
import "./lineSetting.scss";

export const renderLineSetting = () => {
    const upButton = document.querySelector("#up-button");
    const downButton = document.querySelector("#down-button");
    const numDom = document.querySelector("#line-text");
    const message = document.querySelector("#line-message");
    const settings = getSettings();

    if (numDom) {
        numDom.textContent = `${settings.numOfLines}`;
    }
    if (message) {
        message.textContent = getLineSettingMessageText(settings.language);
    }
    upButton?.addEventListener("click", () => {
        const newNum = +numDom?.textContent! + 1;
        numDom!.textContent = `${newNum}`;
        const settings = getSettings();
        settings.numOfLines = newNum;
        setSettings(settings);
    });
    downButton?.addEventListener("click", () => {
        const newNum = +numDom?.textContent! - 1;
        if (newNum > 0) {
            numDom!.textContent = `${newNum}`;
            const settings = getSettings();
            settings.numOfLines = newNum;
            setSettings(settings);
        }
    });
};
