
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaTagData {
  title: string;
  description: string;
  keywords: string;
}

const SEOMetaTags: React.FC = () => {
  const location = useLocation();
  const baseUrl = "https://towerup.uz";
  const currentDate = "2025-03-26"; // Current date as specified

  // Define meta tag data for each route
  const metaTagData: Record<string, MetaTagData> = {
    '/': {
      title: 'TOWER UP - Ведущая строительная компания в Ташкенте | Элитные жилые комплексы',
      description: 'TOWER UP - лидер строительного рынка Узбекистана с 2003 года. Строительство элитных жилых комплексов и бизнес-центров в Ташкенте с безупречным качеством и в срок.',
      keywords: 'строительная компания Ташкент, элитные жилые комплексы, новостройки Ташкент, премиум недвижимость Узбекистан, квартиры в новостройках Ташкент, TOWER UP'
    },
    '/about': {
      title: 'О Компании TOWER UP | Лидер строительного рынка Узбекистана',
      description: 'TOWER UP - ведущий застройщик элитного жилья и бизнес-центров в Ташкенте. Узнайте о нашей миссии, ценностях и достижениях.',
      keywords: 'о компании TOWER UP, застройщик Ташкент, строительная компания Узбекистан, TOWER UP Ташкент, лидер строительного рынка'
    },
    '/history': {
      title: 'История компании TOWER UP | 20 лет успешного строительства в Узбекистане',
      description: 'История развития компании TOWER UP с 2003 года. Ключевые проекты, этапы роста и достижения на строительном рынке Узбекистана.',
      keywords: 'история TOWER UP, строительная компания с 2003 года, развитие строительства в Узбекистане, история застройщика Ташкент'
    },
    '/partners': {
      title: 'Партнёры TOWER UP | Надёжные партнёрские отношения в строительстве',
      description: 'Партнёры компании TOWER UP - ведущие поставщики материалов и технологий для строительства элитной недвижимости в Ташкенте.',
      keywords: 'партнеры TOWER UP, сотрудничество в строительстве, поставщики строительных материалов Узбекистан'
    },
    '/management': {
      title: 'Руководство компании TOWER UP | Команда профессионалов',
      description: 'Руководство и ключевые сотрудники компании TOWER UP. Познакомьтесь с профессиональной командой, создающей элитную недвижимость в Ташкенте.',
      keywords: 'руководство TOWER UP, команда застройщика Ташкент, менеджмент строительной компании, директор TOWER UP'
    },
    '/projects': {
      title: 'Проекты TOWER UP | Элитные жилые комплексы и бизнес-центры в Ташкенте',
      description: 'Каталог проектов TOWER UP: современные жилые комплексы и бизнес-центры в Ташкенте. Инновационная архитектура, качественные материалы и продуманные планировки.',
      keywords: 'проекты TOWER UP, жилые комплексы Ташкент, новостройки премиум класса, бизнес-центры Узбекистан, элитное жилье Ташкент'
    },
    '/news': {
      title: 'Новости TOWER UP | Актуальные события строительной компании',
      description: 'Последние новости компании TOWER UP: запуск новых проектов, ход строительства, акции и специальные предложения на квартиры в Ташкенте.',
      keywords: 'новости TOWER UP, строительство в Ташкенте, новые проекты жилых комплексов, акции на квартиры'
    },
    '/vacancies': {
      title: 'Вакансии TOWER UP | Карьера в ведущей строительной компании Узбекистана',
      description: 'Актуальные вакансии TOWER UP: присоединяйтесь к команде профессионалов в сфере строительства элитной недвижимости в Ташкенте.',
      keywords: 'вакансии TOWER UP, работа в строительной компании, карьера в Ташкенте, трудоустройство в Узбекистане'
    },
    '/construction': {
      title: 'Строительство объектов TOWER UP | Полный цикл строительных работ',
      description: 'Услуги по строительству жилых комплексов и бизнес-центров в Ташкенте от TOWER UP. Современные технологии, качественные материалы и соблюдение сроков.',
      keywords: 'строительство объектов TOWER UP, жилые комплексы под ключ, строительство бизнес-центров Ташкент, услуги застройщика'
    },
    '/design': {
      title: 'Проектирование зданий TOWER UP | Инновационные архитектурные решения',
      description: 'Услуги проектирования жилых комплексов и бизнес-центров от TOWER UP. Создаем современную, функциональную и эстетичную архитектуру в Ташкенте.',
      keywords: 'проектирование зданий TOWER UP, архитектурные решения Ташкент, дизайн жилых комплексов, планировки квартир новостройки'
    },
    '/solutions': {
      title: 'Комплексные решения TOWER UP | Инновации в строительстве',
      description: 'Инновационные решения для строительства от TOWER UP: энергоэффективность, умный дом, экологичные материалы и современные технологии в Ташкенте.',
      keywords: 'решения TOWER UP, инновации в строительстве, энергоэффективные здания Ташкент, умный дом Узбекистан'
    },
    '/contact': {
      title: 'Контакты TOWER UP | Связаться с ведущим застройщиком Ташкента',
      description: 'Контактная информация TOWER UP. Офис продаж в центре Ташкента. Свяжитесь с нами для консультации по вопросам приобретения недвижимости.',
      keywords: 'контакты TOWER UP, офис продаж новостроек Ташкент, связаться с застройщиком, адрес строительной компании Узбекистан'
    }
  };

  useEffect(() => {
    // Get the meta data for current route or default to home page data
    const currentPath = location.pathname;
    const metaData = metaTagData[currentPath] || metaTagData['/'];
    
    // Update page title
    document.title = metaData.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", metaData.description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      metaDescription.content = metaData.description;
      document.head.appendChild(metaDescription);
    }
    
    // Add meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", metaData.keywords);
    } else {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = "keywords";
      metaKeywords.content = metaData.keywords;
      document.head.appendChild(metaKeywords);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", `${baseUrl}${currentPath}`);
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = "canonical";
      canonicalLink.href = `${baseUrl}${currentPath}`;
      document.head.appendChild(canonicalLink);
    }
    
    // Update Open Graph meta tags
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", `${baseUrl}${currentPath}`);
    }
    
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", metaData.title);
    }
    
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute("content", metaData.description);
    }
    
    // Update Twitter meta tags
    let twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute("content", `${baseUrl}${currentPath}`);
    }
    
    let twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute("content", metaData.title);
    }
    
    let twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute("content", metaData.description);
    }

    // Add or update lastmod date in JSON-LD structured data
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      try {
        const structuredData = JSON.parse(jsonLd.textContent || '{}');
        if (currentPath === '/') {
          // Update organizational data if on homepage
          if (!structuredData.dateModified) {
            structuredData.dateModified = currentDate;
          }
        } else {
          // Change to WebPage type for other pages
          let webPageData = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": metaData.title,
            "description": metaData.description,
            "url": `${baseUrl}${currentPath}`,
            "dateModified": currentDate,
            "isPartOf": {
              "@type": "WebSite",
              "name": "TOWER UP",
              "url": baseUrl
            }
          };
          jsonLd.textContent = JSON.stringify(webPageData);
        }
      } catch (e) {
        console.error("Error updating JSON-LD data:", e);
      }
    }
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

export default SEOMetaTags;
