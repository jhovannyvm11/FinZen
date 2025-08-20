/**
 * Utilidades para internacionalización (i18n)
 */

/**
 * Interpola variables en una cadena de traducción
 * @param template - La cadena de traducción con placeholders en formato {variable}
 * @param variables - Objeto con las variables a interpolar
 * @returns La cadena con las variables interpoladas
 * 
 * @example
 * interpolate("Hola {name}, tienes {count} mensajes", { name: "Juan", count: "5" })
 * // Retorna: "Hola Juan, tienes 5 mensajes"
 */
export const interpolate = (
  template: string, 
  variables: Record<string, string | number>
): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key];
    return value !== undefined ? String(value) : match;
  });
};

/**
 * Función auxiliar para obtener una traducción con interpolación
 * @param t - Función de traducción
 * @param key - Clave de traducción
 * @param variables - Variables para interpolar
 * @param fallback - Texto de respaldo si no se encuentra la traducción
 * @returns La traducción interpolada o el fallback
 */
export const getTranslationWithInterpolation = (
  t: (key: string) => string,
  key: string,
  variables: Record<string, string | number> = {},
  fallback?: string
): string => {
  const template = t(key);
  
  // Si la traducción no se encontró (retorna la clave), usar fallback
  if (template === key && fallback) {
    return interpolate(fallback, variables);
  }
  
  // Si se encontró la traducción, interpolar variables
  return interpolate(template, variables);
};