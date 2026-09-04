 import React, { createContext, useContext, ReactNode } from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";

type TranslationContextType = {
  language: string;
  toggleLanguage: () => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useI18nTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
   
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);
  };

  return (
    <TranslationContext.Provider
      value={{
        toggleLanguage,
        language: i18n.language,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error(
      "useTranslation must be used within a TranslationProvider"
    );
  }
  return context;
};
