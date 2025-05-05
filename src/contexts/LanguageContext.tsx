
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

// Queue to prevent too many translation requests at once
interface TranslationQueueItem {
  key: string;
  targetLang: Language;
  resolve: (text: string) => void;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('uz');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationQueue, setTranslationQueue] = useState<TranslationQueueItem[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  
  // Detect user's browser language on initial load or use saved preference
  useEffect(() => {
    const detectBrowserLanguage = () => {
      const savedLanguage = localStorage.getItem('preferredLanguage');
      if (savedLanguage && ['ru', 'uz', 'en'].includes(savedLanguage)) {
        return savedLanguage as Language;
      }
      
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
    
    const initialLanguage = detectBrowserLanguage();
    console.log(`Initial language detection: ${initialLanguage}`);
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

  // Process translation queue
  useEffect(() => {
    const processQueue = async () => {
      if (translationQueue.length === 0 || isBusy) return;
      
      setIsBusy(true);
      const item = translationQueue[0];
      
      try {
        console.log(`Processing translation of "${item.key}" to ${item.targetLang}`);
        const translatedText = await autoTranslate(item.key, item.targetLang);
        
        // Store in translations state for immediate use
        setTranslations(prev => ({
          ...prev,
          [item.key]: translatedText
        }));
        
        item.resolve(translatedText);
      } catch (error) {
        console.error('Translation error:', error);
        item.resolve(item.key); // Fallback to key
      }
      
      setTranslationQueue(queue => queue.slice(1));
      setIsBusy(false);
    };
    
    processQueue();
  }, [translationQueue, isBusy]);

  // Auto-translate missing keys using DeepL
  const autoTranslate = async (key: string, targetLanguage: Language): Promise<string> => {
    // Check if we have it in cache
    if (translationCache[targetLanguage] && translationCache[targetLanguage][key]) {
      console.log(`Using cached translation for "${key}" to ${targetLanguage}`);
      return translationCache[targetLanguage][key];
    }

    try {
      console.log(`Translating key "${key}" to ${targetLanguage} using DeepL`);
      
      // Call our Supabase Edge Function for translation
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { 
          text: key,
          targetLang: targetLanguage
        }
      });

      if (error) {
        console.error('Translation function error:', error);
        toast.error(`Translation failed: ${error.message}`);
        throw new Error(`Translation failed: ${error.message}`);
      }

      if (!data || !data.translatedText) {
        console.error('Invalid translation response:', data);
        toast.error('Translation service returned invalid data');
        throw new Error('Translation service returned invalid data');
      }

      const translatedText = data.translatedText;
      console.log(`Translated "${key}" to "${translatedText}"`);

      // Store in cache
      if (!translationCache[targetLanguage]) {
        translationCache[targetLanguage] = {};
      }
      translationCache[targetLanguage][key] = translatedText;

      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed, please try again later');
      
      // Provide a fallback in case of error
      const fallbackText = key;
      
      // Store fallback in cache to prevent repeated failed requests
      if (!translationCache[targetLanguage]) {
        translationCache[targetLanguage] = {};
      }
      translationCache[targetLanguage][key] = fallbackText;
      
      return fallbackText;
    }
  };
  
  // Queue a translation request and return a promise
  const queueTranslation = (key: string, targetLang: Language): Promise<string> => {
    return new Promise(resolve => {
      setTranslationQueue(queue => [...queue, { key, targetLang, resolve }]);
    });
  };
  
  // Translation function with DeepL auto-translation fallback
  const t = (key: string): string => {
    // Return empty string for empty keys
    if (!key) return '';
    
    // If translation exists in our loaded translations, return it
    if (translations && translations[key]) {
      return translations[key];
    }
    
    console.warn(`Translation missing for key: ${key} in language: ${language}`);
    
    // Check if we already have a cached translation
    if (translationCache[language] && translationCache[language][key]) {
      console.log(`Using cached translation for "${key}"`);
      return translationCache[language][key];
    }
    
    // Only attempt auto-translation if we're not already in the process
    if (!isTranslating) {
      setIsTranslating(true);
      
      // Queue translation request
      queueTranslation(key, language).then(translation => {
        // Update the cache
        if (!translationCache[language]) {
          translationCache[language] = {};
        }
        translationCache[language][key] = translation;
        
        // Allow future translation attempts
        setIsTranslating(false);
      });
    }
    
    // Return the key as fallback while waiting for translation
    return key;
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
