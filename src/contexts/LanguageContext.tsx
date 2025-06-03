import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "original" | "translated";

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>("original");

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("blog-language") as Language;
    if (savedLanguage === "original" || savedLanguage === "translated") {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem("blog-language", language);
  };

  const toggleLanguage = () => {
    const newLanguage =
      currentLanguage === "original" ? "translated" : "original";
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
