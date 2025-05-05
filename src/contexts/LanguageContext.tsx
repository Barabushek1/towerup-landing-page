
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
  
  // Detect user's browser language on initial load or use saved preference
  useEffect(() => {
    const detectBrowserLanguage = () => {
      const browserLang = navigator.language.split('-')[0];
      
      // If browser language is Russian, set language to Russian
      if (browserLang === 'ru') {
        return 'ru';
      }
      
      // If browser language is English, set language to English
      if (browserLang === 'en') {
        return 'en';
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
  
  // Translation function
  const t = (key: string): string => {
    if (!translations || !translations[key]) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
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
