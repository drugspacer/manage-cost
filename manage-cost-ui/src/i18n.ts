import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend, { HttpBackendOptions } from "i18next-http-backend";

i18n
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    fallbackLng: "ru",
    supportedLngs: ["ru", "en"],
    ns: ["common"],
    defaultNS: "common",
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      allowMultiLoading: false,
      crossDomain: true,
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: true,
    },
  });

i18n.services.formatter?.add("required", (value) => `${value} *`);

export default i18n;