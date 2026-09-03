"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var i18next_1 = require("i18next");
var i18next_browser_languagedetector_1 = require("i18next-browser-languagedetector");
var i18next_http_backend_1 = require("i18next-http-backend");
var react_i18next_1 = require("react-i18next");
var settings_js_1 = require("./settings.js");
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
if (import.meta.hot) {
    import.meta.hot.on('locales-update', function () {
        i18next_1.default.reloadResources().then(function () {
            i18next_1.default.changeLanguage(i18next_1.default.language);
        });
    });
}
i18next_1.default
    .use(i18next_http_backend_1.default)
    .use(i18next_browser_languagedetector_1.default)
    .use(react_i18next_1.initReactI18next)
    .init(__assign({ backend: {
        loadPath: '/i18n/{{lng}}/{{ns}}.json',
    } }, settings_js_1.getOptions));
exports.default = i18next_1.default;
