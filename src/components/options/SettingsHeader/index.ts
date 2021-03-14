import { getSettings } from "../../../popup";
import { getSettingsHeader } from "../../../libs/language";
import "./settingsHeader.scss";

export const renderSettingsHeader = () => {
    const el = document.querySelector("#settings-header");
    if (el) {
        const settings = getSettings();
        el.textContent = getSettingsHeader(settings.language);
    }
};
