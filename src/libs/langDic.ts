interface contentsByLanguage {
    settingsHeader: string;
    selectLabel: string;
    optionText: string;
    toggleMessageText: string;
    lineSettingMessageText: string;
    topModal: string;
    bottomModalCopy: string;
    bottomModalRemove: string;
    headerContent: string;
    confirmText: {
        yes: string;
        no: string;
    };
    showText: {
        more: string;
        less: string;
    };
    locationSelectLabel: string;
    location: {
        left: string;
        right: string;
    };
}

const langDic: { [key: string]: contentsByLanguage } = {
    CHINESE: {
        settingsHeader: "设定",
        selectLabel: "语言",
        optionText: "中文",
        toggleMessageText: "复制时保存到剪贴板 (ctrl/cmd+c)",
        lineSettingMessageText: "内容太长时默认显示的行数",
        topModal: "您想清除所有笔记吗?",
        bottomModalCopy: "已复制",
        bottomModalRemove: "已删除",
        headerContent: "Neroren剪贴板",
        confirmText: {
            yes: "是",
            no: "不",
        },
        showText: {
            more: "展开",
            less: "隐藏",
        },
        locationSelectLabel: "位置",
        location: {
            left: "左",
            right: "右",
        },
    },
    ENGLISH: {
        settingsHeader: "Settings",
        selectLabel: "Language",
        optionText: "English",
        toggleMessageText: "Save to clipboard when copying (ctrl/cmd+c)",
        lineSettingMessageText: "Number of default lines to show when the content is too long",
        topModal: "Clear all notes?",
        bottomModalCopy: "Copied",
        bottomModalRemove: "Removed",
        headerContent: "Neroren Clipboard",
        confirmText: {
            yes: "Yes",
            no: "No",
        },
        showText: {
            more: "show more",
            less: "show less",
        },
        locationSelectLabel: "Location",
        location: {
            left: "left",
            right: "right",
        },
    },
    JAPANESE: {
        settingsHeader: "設定",
        selectLabel: "言語",
        optionText: "日本語",
        toggleMessageText: "コピーする時、クリップボードに保存 (ctrl/cmd+c)",
        lineSettingMessageText: "コンテンツが長すぎる場合に表示するデフォルトの行数",
        topModal: "すべてのメモを削除しますか",
        bottomModalCopy: "コピーされました",
        bottomModalRemove: "削除されました",
        headerContent: "Nerorenクリップボード",
        confirmText: {
            yes: "はい",
            no: "いいえ",
        },
        showText: {
            more: "もっと見る",
            less: "表示されない",
        },
        locationSelectLabel: "位置",
        location: {
            left: "左",
            right: "右",
        },
    },
    KOREAN: {
        settingsHeader: "설정",
        selectLabel: "언어",
        optionText: "한국어",
        toggleMessageText: "복사할 때 클립 보드에 저장 (ctrl/cmd+c)",
        lineSettingMessageText: "내용이 너무 길 때 보여줄 기본 줄 수",
        topModal: "모든 메모를 삭제하시겠습니까?",
        bottomModalCopy: "복사되었습니다.",
        bottomModalRemove: "삭제되었습니다",
        headerContent: "네로렌 클립보드",
        confirmText: {
            yes: "네",
            no: "아니오",
        },
        showText: {
            more: "더보기",
            less: "감추기",
        },
        locationSelectLabel: "위치",
        location: {
            left: "왼쪽",
            right: "오른쪽",
        },
    },
};

export default langDic;
