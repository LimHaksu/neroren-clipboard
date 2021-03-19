import { getNerorenClipboardSettings, setNerorenClipboardSettings } from "storage/sync";
import { getToggleMessageText } from "libs/language";
import "./toggleButton.scss";

export const renderToggleButton = async () => {
    const el = document.querySelector("#toggle-button");
    const circle = el?.querySelector("#circle");
    const message = document.querySelector("#toggle-message");
    try {
        const settings = await getNerorenClipboardSettings();
        if (circle) {
            toggle(circle, settings.autoSave);
        }

        el?.addEventListener("click", async () => {
            try {
                const settings = await getNerorenClipboardSettings();
                settings.autoSave = !settings.autoSave;
                toggle(circle!, settings.autoSave);

                setNerorenClipboardSettings(settings);
            } catch (e) {
                alert(e);
            }
        });

        message!.textContent = getToggleMessageText(settings.language);
    } catch (e) {
        alert(e);
    }
};

const toggle = (circle: Element, autoSave: boolean) => {
    if (autoSave) {
        circle?.classList.add("active");
    } else {
        circle?.classList.remove("active");
    }
};
