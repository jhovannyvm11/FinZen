import { es, Messages } from './es';

// Idiomas disponibles
export const AVAILABLE_LANGUAGES = {
  es: 'Español'
} as const;

export type Language = keyof typeof AVAILABLE_LANGUAGES;

// Diccionarios de idiomas
const messages: Record<Language, Messages> = {
  es
};

// Idioma por defecto
export const DEFAULT_LANGUAGE: Language = 'es';

// Función para obtener el idioma actual
export const getCurrentLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const saved = localStorage.getItem('language') as Language;
  return saved && saved in AVAILABLE_LANGUAGES ? saved : DEFAULT_LANGUAGE;
};

// Función para cambiar el idioma
export const setLanguage = (language: Language): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', language);
  }
};

// Función para obtener mensajes del idioma actual
export const getMessages = (language?: Language): Messages => {
  const currentLanguage = language || getCurrentLanguage();
  return messages[currentLanguage] || messages[DEFAULT_LANGUAGE];
};

// Hook personalizado para obtener la función de traducción
export const useTranslation = () => {
  const currentLanguage = getCurrentLanguage();
  const msgs = getMessages(currentLanguage);

  // Función para obtener texto anidado usando dot notation
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: unknown = msgs;

    for (const k of keys) {
      if (result && typeof result === 'object' && result !== null && k in result) {
        result = (result as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Retorna la clave si no encuentra la traducción
      }
    }

    return typeof result === 'string' ? result : key;
  };

  return {
    t,
    language: currentLanguage,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      // Forzar re-render si es necesario
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
    messages: msgs
  };
};

// Exportar tipos y constantes
export type { Messages };
export { es };