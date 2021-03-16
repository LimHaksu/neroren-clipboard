import { Language, getHeaderContent } from "../../libs/language";
import { popupTopModal } from "../TopModal";
import "./header.scss";

export const setHeader = (language: Language) => {
    const header = document.querySelector("#header");
    if (header) {
        const textDom = document.createElement("div");
        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "header-button-wrapper";

        textDom.id = "header-text";
        textDom.textContent = getHeaderContent(language);
        header.appendChild(textDom);
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
            chrome.windows.create({ url: "/options.html" });
        });

        const floatingButton = document.createElement("div");
        floatingButton.className = "button button-floating";
        floatingButton.innerHTML = '<div class="floating"></div>';
        floatingButton.addEventListener("click", () => {
            const screenWidth = screen.width;
            const width = 358;
            chrome.windows.create({ url: "/popup.html", width, type: "popup", left: screenWidth - width });
            window.close();
        });

        buttonWrapper.appendChild(clearButton);
        buttonWrapper.appendChild(settingsButton);
        buttonWrapper.appendChild(floatingButton);

        // browser title
        setTitleLanguage(language);
    }
};

export const changeHeaderLanguage = (language: Language) => {
    const header = document.querySelector("#header-text");
    if (header) {
        header.textContent = getHeaderContent(language);
        setTitleLanguage(language);
    }
};

const setTitleLanguage = (language: Language) => {
    const title = document.head.querySelector("title");
    if (title) {
        title.textContent = getHeaderContent(language);
    }
};
