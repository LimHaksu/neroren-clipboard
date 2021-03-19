import { getNerorenClipboardSettings, setNerorenClipboardSettings } from "storage/sync";
import {
    getSettingsHeader,
    getSelectLabel,
    getToggleMessageText,
    getLineSettingMessageText,
    Language,
    getOptionText,
    getHeaderContent,
    getLocationSelectLabel,
    getLocationText,
} from "libs/language";
import { DefaultLocation } from "storage/sync";
import "./selectLanguage.scss";

export const renderLanguageSelect = async () => {
    const selectEl = document.querySelector("#language");
    try {
        const settings = await getNerorenClipboardSettings();

        for (const lang in Language) {
            const option = document.createElement("option");
            const text = getOptionText(lang as Language);
            option.text = text;
            option.value = lang;
            if (lang === (settings.language as Language)) {
                option.defaultSelected = true;
            }
            selectEl?.appendChild(option);
        }

        selectEl?.addEventListener("change", async (e: Event) => {
            const language = (e.target as HTMLSelectElement).value as Language;
            try {
                const settings = await getNerorenClipboardSettings();
                settings.language = language;
                setNerorenClipboardSettings(settings);
                rerenderAfterLanguageChange(language);

                // synchronize other popups
                chrome.runtime.sendMessage({ type: "changePopupLanguage" });
            } catch (e) {
                alert(e);
            }
        });

        const label = document.querySelector("#language-label");
        if (label) {
            label.textContent = getSelectLabel(settings.language);
        }
    } catch (e) {
        alert(e);
    }
};

const rerenderAfterLanguageChange = (language: Language) => {
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
