
import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={cn(
        "fixed bottom-6 right-6 p-3 rounded-full bg-brand-primary text-white shadow-lg z-50",
        "hover:bg-primary/90 transition-all duration-300 transform",
        "active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}
      onClick={scrollToTop}
      aria-label="Прокрутить вверх"
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default ScrollToTopButton;
