
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
 * @param fetchFn Function to fetch data if not cached
 * @param ttlMinutes Time-to-live in minutes
 * @returns The cached or freshly fetched data
 */
export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMinutes: number = 60
): Promise<T> {
  // Try to get data from localStorage cache
  try {
    const cacheKey = `tower_cache_${key}`;
    const cachedItem = localStorage.getItem(cacheKey);
    
    if (cachedItem) {
      const parsedCache = JSON.parse(cachedItem) as CacheItem<T>;
      const now = Date.now();
      const expiryTime = parsedCache.timestamp + (ttlMinutes * 60 * 1000);
      
      // Return cached data if not expired
      if (now < expiryTime) {
        console.log(`[Cache] Using cached data for ${key}`);
        return parsedCache.data;
      }
      console.log(`[Cache] Expired cache for ${key}, fetching fresh data`);
    }
  } catch (error) {
    console.error('[Cache] Error retrieving from cache:', error);
  }
  
  // Fetch fresh data if cache miss or error
  const freshData = await fetchFn();
  
  // Save to cache
  try {
    const cacheKey = `tower_cache_${key}`;
    const cacheItem: CacheItem<T> = {
      data: freshData,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    console.log(`[Cache] Updated cache for ${key}`);
  } catch (error) {
    console.error('[Cache] Error saving to cache:', error);
  }
  
  return freshData;
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
