
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

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  
  // Detect user's browser language on initial load
  useEffect(() => {
    const detectBrowserLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      
      // If browser language is Russian, set language to Russian
      if (browserLang === 'ru') {
        return 'ru';
      }
      
      // Default to Uzbek for all other languages
      return 'uz';
    };
    
    const storedLanguage = localStorage.getItem('preferredLanguage') as Language;
    const initialLanguage = storedLanguage || detectBrowserLanguage();
    
    setLanguage(initialLanguage);
  }, []);
  
  // Load translations whenever language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../translations/${language}.json`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fall back to Uzbek if translations failed to load
        if (language !== 'uz') {
          const fallbackModule = await import(`../translations/uz.json`);
          setTranslations(fallbackModule.default);
        }
      }
    };
    
    loadTranslations();
    
    // Save selected language to localStorage
    localStorage.setItem('preferredLanguage', language);
  }, [language]);
  
  // Translation function
  const t = (key: string): string => {
    return translations[key] || key; // Return the key if translation is not found
  };
  
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
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
