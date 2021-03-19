const NerorenClipboard = "NerorenClipboard";

export interface Note {
    data: {
        type: string;
        content: string;
    };
    pageUrl: string;
    date: string;
    title: string | undefined;
    isPinned: boolean;
}

export const getNerorenClipboard = () => {
    return new Promise<Note[]>((resolve, reject) => {
        chrome.storage.local.get(NerorenClipboard, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
            let notes: Note[] | undefined = result.NerorenClipboard;
            if (!notes) {
                notes = [];
            }
            resolve(notes);
        });
    });
};

export const setNerorenClipboard = (notes: Note[]) => {
    return new Promise<void>((resolve, reject) => {
        chrome.storage.local.set(
            {
                NerorenClipboard: notes,
            },
            () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                }
                resolve();
            }
        );
    });
};
