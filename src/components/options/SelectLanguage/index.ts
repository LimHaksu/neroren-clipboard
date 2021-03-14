import { getSettings, setSettings } from "../../../popup";
import { Language, getOptionText, getSelectLabel } from "../../../libs/language";
import { rerenderAfterLanguageChange } from "../../../options";
import "./selectLanguage.scss";

export const renderLanguageSelect = () => {
    const selectEl = document.querySelector("#language");
    const settings = getSettings();

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

    selectEl?.addEventListener("change", (e: Event) => {
        const language = (e.target as HTMLSelectElement).value as Language;
        const settings = getSettings();
        settings.language = language;
        setSettings(settings);
        rerenderAfterLanguageChange(language);
    });

    const label = document.querySelector("#language-label");
    if (label) {
        label.textContent = getSelectLabel(settings.language);
    }
};
