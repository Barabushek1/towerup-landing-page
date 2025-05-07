// Utility for managing data caching in memory
const cacheMap = new Map<string, { data: any; timestamp: number }>();

// Store whether we've already checked for seeding different collections
const seedingChecksMap = new Map<string, boolean>();

// Unified query keys for consistent cache references
export const QUERY_KEYS = {
  VACANCIES: 'vacancies',
  VACANCY: 'vacancy',
  NEWS: 'news',
  NEWS_ITEM: 'news_item',
  PARTNERS: 'partners',
  MESSAGES: 'messages',
  // Add other query keys as needed
};

// Function to check if we need to run seeding
export function needsSeedingCheck(type: string): boolean {
  if (seedingChecksMap.has(type)) {
    return false;
  }
  
  seedingChecksMap.set(type, true);
  return true;
}

// Function to get cached data with key
export async function getCachedData<T>(
  key: string, 
  fetchFn: () => Promise<T>, 
  expirationMinutes = 60
): Promise<T> {
  const cachedItem = cacheMap.get(key);
  const now = Date.now();
  
  // If we have cached data that hasn't expired, return it
  if (cachedItem && (now - cachedItem.timestamp < expirationMinutes * 60 * 1000)) {
    console.log(`[Cache] Using cached data for ${key}`);
    return cachedItem.data;
  }
  
  // Otherwise fetch fresh data
  console.log(`[Cache] Fetching fresh data for ${key}`);
  const data = await fetchFn();
  
  // Store it in cache
  cacheMap.set(key, {
    data,
    timestamp: now
  });
  
  return data;
}

// Function to invalidate cached data by key
export function invalidateCache(key: string): void {
  console.log(`[Cache] Invalidating cache for ${key}`);
  cacheMap.delete(key);
}

// Function to invalidate cached data by key prefix
export function invalidateCacheByPrefix(prefix: string): void {
  console.log(`[Cache] Invalidating all cache entries with prefix: ${prefix}`);
  for (const key of cacheMap.keys()) {
    if (key.startsWith(prefix)) {
      cacheMap.delete(key);
    }
  }
}

// Clear the entire cache
export function clearCache(): void {
  console.log('[Cache] Clearing entire cache');
  cacheMap.clear();
}
