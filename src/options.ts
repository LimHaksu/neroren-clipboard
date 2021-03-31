import { renderSettingsHeader } from "components/options/SettingsHeader";
import { renderLanguageSelect } from "components/options/SelectLanguage";
import { renderToggleButton } from "components/options/ToggleButton";
import { renderLineSetting } from "components/options/LineSetting";
import { renderLocationSelect } from "components/options/SelectLocation";
import "./options.scss";

(function init() {
    renderSettingsHeader();
    renderLanguageSelect();
    renderToggleButton();
    renderLineSetting();
    renderLocationSelect();
    const catImage = document.querySelector(".cat") as HTMLDivElement;
    catImage.style.left = `${Math.random() * 70}%`;
    catImage?.addEventListener("click", () => {
        catImage.classList.remove("visible");
        setTimeout(() => {
            catImage.style.left = `${Math.random() * 70}%`;
            catImage?.classList.add("visible");
        }, 1000);
    });
    setTimeout(() => {
        catImage?.classList.add("visible");
    }, 500);
})();
