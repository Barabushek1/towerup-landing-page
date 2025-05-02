
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
