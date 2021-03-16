import { renderSettingsHeader } from "./components/options/SettingsHeader";
import { renderLanguageSelect } from "./components/options/SelectLanguage";
import { renderToggleButton } from "./components/options/ToggleButton";
import { renderLineSetting } from "./components/options/LineSetting";
import { renderLocationSelect } from "./components/options/SelectLocation";

import {
    getSettingsHeader,
    getSelectLabel,
    getToggleMessageText,
    getLineSettingMessageText,
    Language,
    getHeaderContent,
    getLocationSelectLabel,
    getLocationText,
} from "./libs/language";
import { NerorenClipboardSettings, setSettings, DefaultLocation } from "./popup";
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
    renderLocationSelect();
});

export const rerenderAfterLanguageChange = (language: Language) => {
    const title = document.head.querySelector("title");
    const settingsHeader = document.querySelector("#settings-header");
    const languageLabel = document.querySelector("#language-label");
    const toggleMessage = document.querySelector("#toggle-message");
    const lineMessage = document.querySelector("#line-message");
    const locationLabel = document.querySelector("#location-label");
    const locationSelect = document.querySelector("#location");
    const locationText = getLocationText(language);

    title!.textContent = `${getHeaderContent(language)} ${getSettingsHeader(language)}`;
    settingsHeader!.textContent = getSettingsHeader(language);
    languageLabel!.textContent = getSelectLabel(language);
    toggleMessage!.textContent = getToggleMessageText(language);
    lineMessage!.textContent = getLineSettingMessageText(language);
    locationLabel!.textContent = getLocationSelectLabel(language);
    Array.from(locationSelect!.children).forEach((option) => {
        switch ((option as HTMLOptionElement).value as DefaultLocation) {
            case DefaultLocation.LEFT:
                option.textContent = locationText.left;
                break;
            case DefaultLocation.RIGHT:
                option.textContent = locationText.right;
                break;
        }
    });
};
