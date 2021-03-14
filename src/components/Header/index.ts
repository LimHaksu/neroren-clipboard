import { Language, getHeaderContent } from "../../libs/language";
import { popupTopModal } from "../TopModal";
import "./header.scss";

export const setHeaderContent = (language: Language) => {
    const header = document.querySelector("#header");
    if (header) {
        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "header-button-wrapper";

        header.textContent = getHeaderContent(language);
        header.appendChild(buttonWrapper);

        const clearButton = document.createElement("div");
        clearButton.className = "button button-clear";
        clearButton.innerHTML = `<div class="clear"></div>`;
        clearButton.addEventListener("click", () => {
            popupTopModal();
        });

        const settingsButton = document.createElement("div");
        settingsButton.className = "button button-settings";
        settingsButton.innerHTML = `<div class="settings"></div>`;
        settingsButton.addEventListener("click", () => {
            chrome.tabs.create({ url: "/options.html" });
        });

        buttonWrapper.appendChild(clearButton);
        buttonWrapper.appendChild(settingsButton);
    }
};
