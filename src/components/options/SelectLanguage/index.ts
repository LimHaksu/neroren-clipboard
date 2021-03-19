import { getNerorenClipboardSettings, setNerorenClipboardSettings } from "../../../storage/sync";
import { Language, getOptionText, getSelectLabel } from "../../../libs/language";
import { rerenderAfterLanguageChange } from "../../../options";
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
