
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'uz' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Simple in-memory cache for translations
const translationCache: Record<string, Record<string, string>> = {};

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
  
  const [translations, setTranslations] = useState<Record<string, string>>({});
  
  // Load translations whenever language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        console.log(`Loading translations for language: ${language}`);
        const translationModule = await import(`../translations/${language}.json`);
        console.log('Loaded translation module:', translationModule);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fall back to Uzbek if translations failed to load
        if (language !== 'uz') {
          try {
            const fallbackModule = await import(`../translations/uz.json`);
            setTranslations(fallbackModule.default);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError);
          }
        }
      }
    };
    
    loadTranslations();
    
    // Save selected language to localStorage
    localStorage.setItem('preferredLanguage', language);
  }, [language]);
  
  // Translation function with fallback to key
  const t = (key: string): string => {
    if (!translations || !translations[key]) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      
      // Check if we already have a cached translation
      if (translationCache[language] && translationCache[language][key]) {
        return translationCache[language][key];
      }
      
      return key; // Return the key if translation is not found
    }
    return translations[key];
  };
  
  const changeLanguage = (newLanguage: Language) => {
    console.log(`Changing language to: ${newLanguage}`);
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };
  
  const value = {
    language,
    setLanguage: changeLanguage,
    t
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
