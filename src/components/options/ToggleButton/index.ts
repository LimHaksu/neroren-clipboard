import { getSettings, setSettings } from "../../../popup";
import { getToggleMessageText } from "../../../libs/language";
import "./toggleButton.scss";

export const renderToggleButton = () => {
    const el = document.querySelector("#toggle-button");
    const circle = el?.querySelector("#circle");
    const message = document.querySelector("#toggle-message");
    const settings = getSettings();
    if (circle) {
        toggle(circle, settings.autoSave);
    }

    el?.addEventListener("click", () => {
        const settings = getSettings();
        settings.autoSave = !settings.autoSave;
        toggle(circle!, settings.autoSave);

        setSettings(settings);
    });

    message!.textContent = getToggleMessageText(settings.language);
};

const toggle = (circle: Element, autoSave: boolean) => {
    if (autoSave) {
        circle?.classList.add("active");
    } else {
        circle?.classList.remove("active");
    }
};
