
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

type Language = 'ru' | 'uz' | 'en';

// Updated type to support nested translation structures
type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationsRecord = Record<string, TranslationValue>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isTranslationsLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Simple in-memory cache for translations
const translationCache: Record<string, TranslationsRecord> = {};

// Preload translations for all languages
const preloadTranslations = async () => {
  try {
    // Preload all language translations in parallel
    const languages: Language[] = ['en', 'ru', 'uz'];
    await Promise.all(
      languages.map(async (lang) => {
        if (!translationCache[lang]) {
          try {
            const module = await import(`../locales/${lang}.json`);
            translationCache[lang] = module.default;
            console.log(`Preloaded translations for ${lang}`);
          } catch (err) {
            console.error(`Failed to preload translations for ${lang}:`, err);
          }
        }
      })
    );
  } catch (error) {
    console.error('Error preloading translations:', error);
  }
};

// Start preloading translations immediately when this file is imported
preloadTranslations();

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Initialize with localStorage value if available, otherwise detect browser language
  const [language, setLanguage] = useState<Language>(() => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as Language;
    if (storedLanguage && ['ru', 'uz', 'en'].includes(storedLanguage)) {
      return storedLanguage;
    }
    
    // Detect browser language if no stored preference
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ru') return 'ru';
    if (browserLang === 'en') return 'en';
    return 'uz'; // Default to Uzbek
  });
  
  const [translations, setTranslations] = useState<TranslationsRecord>(() => {
    // Try to use preloaded translations from cache during initial render
    return translationCache[language] || {};
  });
  
  // Important: Set isTranslationsLoaded based on having actual translations in cache
  const [isTranslationsLoaded, setIsTranslationsLoaded] = useState(
    !!translationCache[language] && Object.keys(translationCache[language] || {}).length > 0
  );
  
  // Load translations whenever language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Set loading state to false immediately when language changes
        setIsTranslationsLoaded(false);
        
        // If we already have cached translations for this language, use them immediately
        if (translationCache[language] && Object.keys(translationCache[language]).length > 0) {
          setTranslations(translationCache[language]);
          // Small timeout to ensure UI updates properly
          setTimeout(() => {
            setIsTranslationsLoaded(true);
          }, 10);
          return;
        }
        
        console.log(`Loading translations for language: ${language}`);
        
        const translationModule = await import(`../locales/${language}.json`);
        
        // Validate that we have a proper translation object
        if (translationModule && translationModule.default && typeof translationModule.default === 'object') {
          console.log(`Successfully loaded ${Object.keys(translationModule.default).length} translations for ${language}`);
          
          // Cache the translations for future use
          translationCache[language] = translationModule.default;
          
          setTranslations(translationModule.default);
          setIsTranslationsLoaded(true);
        } else {
          console.error(`Invalid translation module format for ${language}:`, translationModule);
          throw new Error('Invalid translation format');
        }
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fall back to Uzbek if translations failed to load
        if (language !== 'uz') {
          try {
            // Try to use cached Uzbek translations if available
            if (translationCache['uz']) {
              setTranslations(translationCache['uz']);
              setIsTranslationsLoaded(true);
              return;
            }
            
            console.log('Attempting to load fallback translations (uz)...');
            const fallbackModule = await import(`../locales/uz.json`);
            const fallbackTranslations = fallbackModule.default;
            
            // Cache the fallback translations
            translationCache['uz'] = fallbackTranslations;
            
            setTranslations(fallbackTranslations);
            setIsTranslationsLoaded(true);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError);
            setIsTranslationsLoaded(true); // Set to true even on error to prevent infinite loading state
          }
        } else {
          setIsTranslationsLoaded(true); // Set to true even on error to prevent infinite loading state
        }
      }
    };
    
    loadTranslations();
    
    // Save selected language to localStorage
    localStorage.setItem('preferredLanguage', language);
  }, [language]);
  
  // Memoize the translation function to prevent unnecessary re-renders
  const t = useMemo(() => {
    return (key: string): string => {
      // If translations aren't loaded yet, return empty string to prevent showing keys
      if (!isTranslationsLoaded) {
        return '';
      }
      
      // First, try to get exact match
      if (key in translations) {
        const value = translations[key];
        if (typeof value === 'string') {
          return value;
        }
      }
      
      // If not found or not a string, try to handle nested keys (e.g., "projectAdvantages.title")
      if (key.includes('.')) {
        const parts = key.split('.');
        let current: any = translations;
        
        for (const part of parts) {
          if (current && typeof current === 'object' && part in current) {
            current = current[part];
          } else {
            // Try to fallback to English for missing translations
            if (language !== 'en' && translationCache['en']) {
              const enTranslations = translationCache['en'];
              let enCurrent: any = enTranslations;
              
              for (const enPart of parts) {
                if (enCurrent && typeof enCurrent === 'object' && enPart in enCurrent) {
                  enCurrent = enCurrent[enPart];
                } else {
                  // Return empty string if translations aren't loaded yet
                  return isTranslationsLoaded ? key : '';
                }
              }
              
              if (typeof enCurrent === 'string') {
                return enCurrent;
              }
            }
            
            // Return empty string if translations aren't loaded yet
            return isTranslationsLoaded ? key : '';
          }
        }
        
        if (typeof current === 'string') {
          return current;
        }
      }
      
      // Return empty string if translations aren't loaded yet, otherwise return key
      return isTranslationsLoaded ? key : '';
    };
  }, [language, translations, isTranslationsLoaded]);
  
  const changeLanguage = (newLanguage: Language) => {
    console.log(`Changing language to: ${newLanguage}`);
    setLanguage(newLanguage);
  };
  
  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    isTranslationsLoaded
  };
  
  // If translations aren't loaded yet, we still provide the context but with empty strings for translations
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
