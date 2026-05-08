export declare const fallbackLng = "en";
export declare const languages: string[];
export declare const defaultNS = "translation";
export declare const cookieName = "i18next";
export declare function getOptions(): {
    load: string;
    supportedLngs: string[];
    fallbackLng: string;
    lng: string;
    fallbackNS: string;
    defaultNS: string;
    ns: string;
    interpolation: {
        escapeValue: boolean;
    };
};
