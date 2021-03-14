import { renderSettingsHeader } from "./components/options/SettingsHeader";
import { renderLanguageSelect } from "./components/options/SelectLanguage";
import { renderToggleButton } from "./components/options/ToggleButton";
import { renderLineSetting } from "./components/options/LineSetting";
import {
    getSettingsHeader,
    getSelectLabel,
    getToggleMessageText,
    getLineSettingMessageText,
    Language,
} from "./libs/language";
import { NerorenClipboardSettings, setSettings } from "./popup";
import "./options.scss";

const catImage = document.querySelector(".cat");
setTimeout(() => {
    catImage?.classList.add("visible");
}, 500);

chrome.storage.sync.get(NerorenClipboardSettings, (result) => {
    const settings = result[NerorenClipboardSettings];
    setSettings(settings);

    renderSettingsHeader();
    renderLanguageSelect();
    renderToggleButton();
    renderLineSetting();
});

export const rerenderAfterLanguageChange = (language: Language) => {
    const settingsHeader = document.querySelector("#settings-header");
    const languageLabel = document.querySelector("#language-label");
    const toggleMessage = document.querySelector("#toggle-message");
    const lineMessage = document.querySelector("#line-message");

    settingsHeader!.textContent = getSettingsHeader(language);
    languageLabel!.textContent = getSelectLabel(language);
    toggleMessage!.textContent = getToggleMessageText(language);
    lineMessage!.textContent = getLineSettingMessageText(language);
};
