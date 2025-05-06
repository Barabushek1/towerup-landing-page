/**
 * Simple cache utility for reducing database egress
 */

type CacheItem<T> = {
  data: T;
  timestamp: number;
};

/**
 * Get cached data or fetch it if not available or expired
 * 
 * @param key Cache key
 * @param fetchFunction Function to fetch data if not cached
 * @param expirationMinutes Time-to-live in minutes
 * @returns The cached or freshly fetched data
 */
export async function getCachedData<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  expirationMinutes: number = 120
): Promise<T> {
  try {
    // Check if we have data in sessionStorage and if it's still valid
    const cachedDataStr = sessionStorage.getItem(key);
    if (cachedDataStr) {
      const { data, timestamp } = JSON.parse(cachedDataStr);
      const expirationTime = timestamp + expirationMinutes * 60 * 1000;
      
      // If the cached data is still valid, return it
      if (expirationTime > Date.now()) {
        console.log(`[Cache] Using cached data for ${key}`);
        return data as T;
      }
      console.log(`[Cache] Cache expired for ${key}, fetching new data`);
    }
    
    // If no cached data or expired, fetch new data
    console.log(`[Cache] Fetching new data for ${key}`);
    const newData = await fetchFunction();
    
    // Store the fetched data in sessionStorage
    const cacheEntry = {
      data: newData,
      timestamp: Date.now()
    };
    sessionStorage.setItem(key, JSON.stringify(cacheEntry));
    
    return newData;
  } catch (error) {
    console.error(`[Cache] Error getting data for ${key}:`, error);
    throw error;
  }
}

/**
 * Check if a seeding operation has been performed in this session
 * to avoid repeated database checks
 * 
 * @param key Unique identifier for the seeding operation
 * @returns True if seeding check is needed, false if already done
 */
export function needsSeedingCheck(key: string): boolean {
  try {
    const seedCheckKey = `tower_seed_check_${key}`;
    const hasChecked = sessionStorage.getItem(seedCheckKey) === 'true';
    
    if (!hasChecked) {
      sessionStorage.setItem(seedCheckKey, 'true');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[Seed] Error checking seed status:', error);
    return true; // Default to true if storage is unavailable
  }
}
