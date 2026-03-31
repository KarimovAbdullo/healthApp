import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "./translations";

export const LANGUAGE_STORAGE_KEY = "app-language";

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export async function loadSavedLanguage(): Promise<void> {
  const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (saved && ["en", "ru", "uz"].includes(saved)) {
    await i18n.changeLanguage(saved);
  }
}

export async function setAppLanguage(lang: "en" | "ru" | "uz"): Promise<void> {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

export default i18n;

