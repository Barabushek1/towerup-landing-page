
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

/**
 * Format price in millions for display
 */
export const formatPriceInMillions = (price: number): string => {
  return `${(price / 1000000).toFixed(1).replace(/\.0$/, '')} млн сум`;
};

/**
 * Get price per square meter based on apartment type from the database
 * This is a helper function to use in components that need to calculate prices
 */
export const getPricePerSqmForType = async (apartmentType: string): Promise<number> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase
      .from('floor_prices')
      .select('price_per_sqm')
      .eq('apartment_type', apartmentType)
      .single();
    
    if (error) {
      console.error('Error fetching price per sqm:', error);
      return 12000000; // Default fallback price
    }
    
    return data?.price_per_sqm || 12000000;
  } catch (error) {
    console.error('Error in getPricePerSqmForType:', error);
    return 12000000; // Default fallback price
  }
};
