
/**
 * Format number with spaces as thousand separators
 */
export const formatNumberWithSpaces = (num: number): string => {
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
