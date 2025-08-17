"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Language,
  DEFAULT_LANGUAGE,
  getCurrentLanguage,
  setLanguage,
  getMessages,
  Messages,
} from "@/locales";

interface LanguageContextType {
  language: Language;
  messages: Messages;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [messages, setMessages] = useState<Messages>(
    getMessages(DEFAULT_LANGUAGE)
  );

  useEffect(() => {
    // Obtener idioma guardado al montar el componente
    const savedLanguage = getCurrentLanguage();
    setCurrentLanguage(savedLanguage);
    setMessages(getMessages(savedLanguage));
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setCurrentLanguage(lang);
    setMessages(getMessages(lang));
  };

  // Función para obtener texto anidado usando dot notation
  const t = (key: string): string => {
    const keys = key.split(".");
    let result: unknown = messages;

    for (const k of keys) {
      if (
        result &&
        typeof result === "object" &&
        result !== null &&
        k in result
      ) {
        result = (result as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Retorna la clave si no encuentra la traducción
      }
    }

    return typeof result === "string" ? result : key;
  };

  const value: LanguageContextType = {
    language,
    messages,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personalizado para usar el contexto de idioma
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Hook alias para mantener compatibilidad
export const useTranslation = useLanguage;
