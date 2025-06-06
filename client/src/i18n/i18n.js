import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import bn from "./locales/bn.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes by default
  },
});

export default i18n;
