
/**
 * Format number with spaces as thousand separators
 */
export const formatNumberWithSpaces = (num: number): string => {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

/**
 * Extract numeric value from an area string (e.g., "31.01 м²" -> 31.01)
 */
export const extractAreaNumber = (areaString: string): number => {
  const areaMatch = areaString.match(/(\d+(?:\.\d+)?)/);
  if (areaMatch) {
    return parseFloat(areaMatch[1]);
  }
  return 0;
};

/**
 * Format price per square meter for display
 */
export const formatPricePerSqm = (price: number): string => {
  return `${formatNumberWithSpaces(price)} сум/м²`;
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return `${formatNumberWithSpaces(price)} сум`;
};

/**
 * Calculate total price based on area and price per square meter
 */
export const calculateTotalPrice = (area: number, pricePerSqm: number): number => {
  return area * pricePerSqm;
};
