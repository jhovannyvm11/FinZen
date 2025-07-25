/**
 * Utility functions for currency formatting
 */

/**
 * Formats a number as Colombian Peso currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formats a number as Colombian Peso currency with decimals
 * @param amount - The amount to format
 * @returns Formatted currency string with decimals
 */
export const formatCurrencyWithDecimals = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a number as Colombian Peso without currency symbol
 * @param amount - The amount to format
 * @returns Formatted number string
 */
export const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};