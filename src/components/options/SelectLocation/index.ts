import { getSettings, setSettings, DefaultLocation } from "../../../popup";
import { getLocationText, getLocationSelectLabel } from "../../../libs/language";
import "./selectLocation.scss";

export const renderLocationSelect = () => {
    const selectEl = document.querySelector("#location");
    const settings = getSettings();
    const location = getLocationText(settings.language);

    for (const loc in DefaultLocation) {
        const option = document.createElement("option");
        switch (loc) {
            case DefaultLocation.LEFT:
                option.text = location.left;
                break;
            case DefaultLocation.RIGHT:
                option.text = location.right;
                break;
        }
        option.value = loc;
        selectEl?.appendChild(option);
    }

    selectEl?.addEventListener("change", (e: Event) => {
        const loc = (e.target as HTMLSelectElement).value as DefaultLocation;
        const settings = getSettings();
        settings.defaultLocation = loc;
        setSettings(settings);
    });

    const label = document.querySelector("#location-label");
    if (label) {
        label.textContent = getLocationSelectLabel(settings.language);
    }
};
