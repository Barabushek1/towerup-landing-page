
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  
  const languages = [
    { code: 'ru', name: 'Русский', flag: '/lang/ru.svg' },
    { code: 'uz', name: 'O\'zbekcha', flag: '/lang/uz.svg' },
    { code: 'en', name: 'English', flag: '/lang/eng.svg' },
  ];

  const currentLanguageData = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (lang: 'ru' | 'uz' | 'en') => {
    console.log(`Setting language to: ${lang}`);
    setLanguage(lang);
    // The saving to localStorage is now handled in the LanguageContext
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 px-2 py-1 text-white hover:bg-white/10"
        >
          <img 
            src={currentLanguageData.flag} 
            alt={currentLanguageData.name} 
            className="h-4 w-auto"
          />
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`flex items-center gap-2 cursor-pointer hover:bg-slate-700 ${
              language === lang.code ? 'bg-slate-700/50' : ''
            }`}
            onClick={() => handleLanguageChange(lang.code as 'ru' | 'uz' | 'en')}
          >
            <img src={lang.flag} alt={lang.name} className="h-4 w-auto" />
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
