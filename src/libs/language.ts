import { ModalType } from "../components/BottomModal";
import langDic from "./langDic";

export enum Language {
    CHINESE = "CHINESE",
    ENGLISH = "ENGLISH",
    JAPANESE = "JAPANESE",
    KOREAN = "KOREAN",
}

/**
 *
 * @param {string} language
 * @returns
 */
export const getHeaderContent = (language: Language) => {
    return langDic[language].headerContent;
};

export const getBottomModalContent = (language: Language, modalType: ModalType) => {
    switch (modalType) {
        case ModalType.COPY:
            return langDic[language].bottomModalCopy;
        case ModalType.REMOVE:
            return langDic[language].bottomModalRemove;
        default:
            throw new Error("worng modal type");
    }
};

export const getTopModalContent = (language: Language) => {
    return langDic[language].topModal;
};

export const getOptionText = (language: Language) => {
    return langDic[language].optionText;
};

export const getSelectLabel = (language: Language) => {
    return langDic[language].selectLabel;
};

export const getSettingsHeader = (language: Language) => {
    return langDic[language].settingsHeader;
};

export const getToggleMessageText = (language: Language) => {
    return langDic[language].toggleMessageText;
};

export const getLineSettingMessageText = (language: Language) => {
    return langDic[language].lineSettingMessageText;
};

export const getConfirmText = (language: Language) => {
    return langDic[language].confirmText;
};

export const getShowText = (language: Language) => {
    return langDic[language].showText;
};

export const getLocationText = (language: Language) => {
    return langDic[language].location;
};

export const getLocationSelectLabel = (language: Language) => {
    return langDic[language].locationSelectLabel;
};

const insertLeadingZero = (number: number) => {
    return number < 10 ? "0" + number : number;
};

export const getTimeFormat = (date: Date, language: Language) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dateText = date.getDate();
    let hours: string | number = date.getHours();
    let minutes: string | number = date.getMinutes();
    let seconds: string | number = date.getSeconds();
    hours = insertLeadingZero(hours);
    minutes = insertLeadingZero(minutes);
    seconds = insertLeadingZero(seconds);
    return langDic[language].timeFormat(year, month, dateText, hours, minutes, seconds);
};
