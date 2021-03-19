import { Language } from "libs/language";
const NerorenClipboardSettings = "NerorenClipboardSettings";

export enum DefaultLocation {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export interface Settings {
    language: Language;
    autoSave: boolean;
    numOfLines: number;
    defaultLocation: DefaultLocation;
}

export const getNerorenClipboardSettings = () => {
    return new Promise<Settings>((resolve, reject) => {
        chrome.storage.sync.get(NerorenClipboardSettings, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            let settings: Settings | undefined = result[NerorenClipboardSettings];
            if (!settings) {
                settings = {
                    autoSave: true,
                    language: Language.ENGLISH,
                    numOfLines: 3,
                    defaultLocation: DefaultLocation.RIGHT,
                } as Settings;
            }
            resolve(settings);
        });
    });
};

export const setNerorenClipboardSettings = (settings: Settings) => {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.sync.set(
            {
                NerorenClipboardSettings: settings,
            },
            () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                chrome.runtime.sendMessage({ type: "setting" });
                resolve();
            }
        );
    });
};
