"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieName = exports.defaultNS = exports.languages = exports.fallbackLng = void 0;
exports.getOptions = getOptions;
exports.fallbackLng = 'en';
exports.languages = [exports.fallbackLng, 'de'];
exports.defaultNS = 'translation';
exports.cookieName = 'i18next';
function getOptions() {
    return {
        // debug: true,
        load: 'languageOnly',
        supportedLngs: exports.languages,
        // preload: languages,
        fallbackLng: exports.fallbackLng,
        lng: exports.fallbackLng,
        fallbackNS: exports.defaultNS,
        defaultNS: exports.defaultNS,
        ns: exports.defaultNS,
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    };
}
