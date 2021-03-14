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
