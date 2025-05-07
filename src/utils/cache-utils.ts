
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
  PROJECTS: 'projects',
  PROJECT: 'project',
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

// Get all projects data with optional filter function
export function getProjectsData(filterFn?: (project: any) => boolean) {
  const projects = [
    {
      id: "banking-technology",
      title: "БЦ \"Banking Technology\"",
      description: "Современный бизнес-центр класса А+ с уникальной архитектурой, сочетающий высотное здание с панорамным остеклением и стильный павильон.",
      shortDescription: "Инновационный бизнес-центр с современной архитектурой и передовыми технологиями.",
      location: "Ташкент",
      status: "Проектируется",
      type: "Бизнес-центр",
      area: "24 000 м²",
      floors: "12 этажей",
      completion: "Q4 2027",
      mainImage: "/lovable-uploads/7ad10dee-9292-47bf-a026-8ebd56478382.png",
      gallery: [
        "/lovable-uploads/7ad10dee-9292-47bf-a026-8ebd56478382.png",
        "/lovable-uploads/df3e5ae7-5e64-42ad-852c-436270958842.png",
        "/lovable-uploads/9bc69f30-37ae-4cd1-954b-c7c6bb9d350a.png",
        "/lovable-uploads/7bb17164-6341-4bd5-bd24-6a4d660bf298.png",
        "/lovable-uploads/32ed9232-76ab-4193-9167-491242d8a059.png",
        "/lovable-uploads/96953409-c5c5-4fbe-8373-4459cb21b064.png",
        "/lovable-uploads/7fc72432-7f60-43b3-bb9d-3d74b3f1e298.png",
        "/lovable-uploads/02ee241b-8839-4af3-a468-497a0ffe6d60.png"
      ],
      features: [
        "Уникальный архитектурный облик с изогнутыми стеклянными фасадами",
        "Энергоэффективное остекление",
        "Современная система управления зданием (BMS)",
        "Панорамный ресторан на верхнем этаже",
        "Зеленая терраса на крыше с зонами для отдыха"
      ]
    },
    {
      id: "pushkin",
      title: "ЖК \"Пушкин\"",
      description: "Современный эко-комплекс из 5 домов с благоустроенной территорией, детскими площадками и парковой зоной.",
      shortDescription: "Жилой комплекс премиум-класса с эко-концепцией.",
      location: "Ташкент",
      status: "Строится",
      type: "Жилой комплекс",
      area: "45 000 м²",
      floors: "9-12 этажей",
      completion: "Q4 2025",
      mainImage: "/assets/Pushkin/18.jpg",
      gallery: [
        "/assets/Pushkin/18.jpg",
        "/assets/Pushkin/17.jpg",
        "/assets/Pushkin/16.jpg"
      ]
    },
    {
      id: "new-uzbekistan",
      title: "ЖК \"Yangi Uzbekistan\"",
      description: "Современный комплекс с инновационной архитектурой, зелеными зонами и развитой инфраструктурой.",
      shortDescription: "Современный комплекс с инновационной архитектурой.",
      location: "Ташкент",
      status: "Строится",
      type: "Жилой комплекс",
      area: "60 000 м²",
      floors: "12-16 этажей",
      completion: "Q3 2025",
      mainImage: "/lovable-uploads/36f32494-e938-41ca-815a-e71e74b2e791.png"
    },
    {
      id: "bochka",
      title: "БЦ \"Бочка\"",
      description: "Современный бизнес-центр класса А с конференц-залами, подземным паркингом и зелёной зоной отдыха.",
      shortDescription: "Бизнес-центр с уникальной концепцией и развитой инфраструктурой.",
      location: "Ташкент",
      status: "Строится",
      type: "Бизнес-центр",
      area: "18 000 м²",
      floors: "8 этажей",
      completion: "Q2 2026",
      mainImage: "/assets/Bochka/bochka_hero.jpg"
    },
    {
      id: "kumaryk",
      title: "ЖК \"Кумарык\"",
      description: "Курортный комплекс из отеля 5* и апартаментов с панорамным видом на море и собственным пляжем.",
      shortDescription: "Курортный комплекс премиум-класса на берегу Иссык-Куля.",
      location: "Иссык-Куль",
      status: "Проектируется",
      type: "Курортный комплекс",
      area: "35 000 м²",
      floors: "5-7 этажей",
      completion: "Q3 2026",
      mainImage: "/assets/Kumaryk/kumaryk_exterior.jpg"
    }
  ];
  
  return filterFn ? projects.filter(filterFn) : projects;
}

// Get single project by ID
export function getProjectById(projectId: string) {
  const projects = getProjectsData();
  return projects.find(project => project.id === projectId);
}
