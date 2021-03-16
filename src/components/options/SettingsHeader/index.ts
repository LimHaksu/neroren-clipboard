import { getSettings } from "../../../popup";
import { getSettingsHeader, getHeaderContent } from "../../../libs/language";
import "./settingsHeader.scss";

export const renderSettingsHeader = () => {
    const el = document.querySelector("#settings-header");
    const title = document.head.querySelector("title");
    if (el && title) {
        const settings = getSettings();
        el.textContent = getSettingsHeader(settings.language);
        title.textContent = `${getHeaderContent(settings.language)} ${getSettingsHeader(settings.language)}`;
    }
};
