import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import pt from "./locales/pt.json";
import es from "./locales/es.json";
import en from "./locales/en.json";

const savedLanguage = localStorage.getItem("bytrust-language");
const browserLanguage = navigator.language.toLowerCase();
const initialLanguage = savedLanguage ?? (browserLanguage.startsWith("es") ? "es" : browserLanguage.startsWith("en") ? "en" : "pt");

i18n.use(initReactI18next).init({
  resources: { pt: { translation: pt }, es: { translation: es }, en: { translation: en } },
  lng: initialLanguage,
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  localStorage.setItem("bytrust-language", language);
  document.documentElement.lang = language === "pt" ? "pt-BR" : language;
});

document.documentElement.lang = initialLanguage === "pt" ? "pt-BR" : initialLanguage;

export default i18n;
