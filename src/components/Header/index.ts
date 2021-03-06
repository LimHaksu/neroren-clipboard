import { getHeaderContent } from "libs/language";
import { Language, DefaultLocation } from "types";
import { popupTopModal } from "components/TopModal";
import { getNerorenClipboardSettings } from "storage/sync";
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

        const clearButton = document.createElement("button");
        clearButton.className = "button button-clear";
        clearButton.innerHTML = `<div class="clear"></div>`;
        clearButton.addEventListener("click", () => {
            popupTopModal();
        });

        const settingsButton = document.createElement("button");
        settingsButton.className = "button button-settings";
        settingsButton.innerHTML = `<div class="settings"></div>`;
        settingsButton.addEventListener("click", () => {
            chrome.windows.create({ url: "/options.html" });
        });

        const floatingButton = document.createElement("button");
        floatingButton.className = "button button-floating";
        floatingButton.innerHTML = '<div class="floating"></div>';
        floatingButton.addEventListener("click", async () => {
            try {
                let width = 358;
                const settings = await getNerorenClipboardSettings();
                let left = 0;
                if (settings.defaultLocation === DefaultLocation.RIGHT) {
                    left = screen.width;
                }
                chrome.windows.create({
                    url: "/popup.html",
                    width,
                    type: "popup",
                    left,
                    height: screen.height,
                });
                window.close();
            } catch (e) {
                alert(e);
            }
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
