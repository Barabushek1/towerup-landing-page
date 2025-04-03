import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down 300px
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Add scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <AnimatePresence>
      {isVisible && <motion.div initial={{
      opacity: 0,
      scale: 0.5
    }} animate={{
      opacity: 1,
      scale: 1
    }} exit={{
      opacity: 0,
      scale: 0.5
    }} transition={{
      duration: 0.2
    }} className="fixed bottom-6 right-6 z-50 my-[57px]">
          <Button onClick={scrollToTop} size="icon" aria-label="Scroll to top" className="h-12 w-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 my-[46px]">
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>}
    </AnimatePresence>;
};
export default ScrollToTopButton;