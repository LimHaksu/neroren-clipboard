import { renderSettingsHeader } from "components/options/SettingsHeader";
import { renderLanguageSelect } from "components/options/SelectLanguage";
import { renderToggleButton } from "components/options/ToggleButton";
import { renderLineSetting } from "components/options/LineSetting";
import { renderLocationSelect } from "components/options/SelectLocation";
import "./options.scss";

const catImage = document.querySelector(".cat");
setTimeout(() => {
    catImage?.classList.add("visible");
}, 500);

const init = async () => {
    renderSettingsHeader();
    renderLanguageSelect();
    renderToggleButton();
    renderLineSetting();
    renderLocationSelect();
};
init();
