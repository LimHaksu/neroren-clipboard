import { getNerorenClipboardSettings } from "storage/sync";
import { getSettingsHeader, getHeaderContent } from "libs/language";
import "./settingsHeader.scss";

export const renderSettingsHeader = async () => {
    const el = document.querySelector("#settings-header");
    const title = document.head.querySelector("title");
    if (el && title) {
        try {
            const settings = await getNerorenClipboardSettings();
            el.textContent = getSettingsHeader(settings.language);
            title.textContent = `${getHeaderContent(settings.language)} ${getSettingsHeader(settings.language)}`;
        } catch (e) {
            alert(e);
        }
    }
};
