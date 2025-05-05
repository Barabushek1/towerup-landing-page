
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  
  const [translations, setTranslations] = useState<TranslationsRecord>({});
  const [isTranslationsLoaded, setIsTranslationsLoaded] = useState(false);
  
  // Load translations whenever language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        console.log(`Loading translations for language: ${language}`);
        setIsTranslationsLoaded(false);
        
        const translationModule = await import(`../translations/${language}.json`);
        console.log('Loaded translation module:', translationModule);
        
        // Validate that we have a proper translation object
        if (translationModule && translationModule.default && typeof translationModule.default === 'object') {
          console.log(`Successfully loaded ${Object.keys(translationModule.default).length} translations for ${language}`);
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
            console.log('Attempting to load fallback translations (uz)...');
            const fallbackModule = await import(`../translations/uz.json`);
            setTranslations(fallbackModule.default);
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
  
  // Updated translation function that supports nested keys
  const t = (key: string): string => {
    // For debugging, log every 20th translation request to avoid console spam
    if (Math.random() < 0.05) {
      console.log(`t("${key}") called with language: ${language}, isTranslationsLoaded: ${isTranslationsLoaded}`);
    }
    
    // If translations aren't loaded yet, just return the key
    if (!isTranslationsLoaded || !translations) {
      return key;
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
          console.warn(`Translation part missing for key: ${key} at ${part} in language: ${language}`);
          return key;
        }
      }
      
      if (typeof current === 'string') {
        return current;
      }
    }
    
    console.warn(`Translation missing or not a string for key: ${key} in language: ${language}`);
    
    // Check if we already have a cached translation
    if (translationCache[language] && key in translationCache[language]) {
      const cached = translationCache[language][key];
      if (typeof cached === 'string') {
        return cached;
      }
    }
    
    return key; // Return the key if translation is not found or not a string
  };
  
  const changeLanguage = (newLanguage: Language) => {
    console.log(`Changing language to: ${newLanguage}`);
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };
  
  const value = {
    language,
    setLanguage: changeLanguage,
    t,
    isTranslationsLoaded
  };
  
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
