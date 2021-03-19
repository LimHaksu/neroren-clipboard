import { getNerorenClipboardSettings, setNerorenClipboardSettings } from "storage/sync";
import { DefaultLocation } from "types";
import { getLocationText, getLocationSelectLabel } from "libs/language";
import "./selectLocation.scss";

export const renderLocationSelect = async () => {
    const selectEl = document.querySelector("#location");
    try {
        const settings = await getNerorenClipboardSettings();
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
            if (settings.defaultLocation === loc) {
                option.defaultSelected = true;
            }
            selectEl?.appendChild(option);
        }

        selectEl?.addEventListener("change", async (e: Event) => {
            const loc = (e.target as HTMLSelectElement).value as DefaultLocation;
            try {
                const settings = await getNerorenClipboardSettings();
                settings.defaultLocation = loc;
                setNerorenClipboardSettings(settings);
            } catch (e) {
                alert(e);
            }
        });

        const label = document.querySelector("#location-label");
        if (label) {
            label.textContent = getLocationSelectLabel(settings.language);
        }
    } catch (e) {
        alert(e);
    }
};
