
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturesSection from '@/components/FeaturesSection';
import ProjectsSection from '@/components/ProjectsSection';
import NewsVacanciesSection from '@/components/NewsVacanciesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  // Add smooth scrolling animations
  useEffect(() => {
    // Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    );
    
    // Observe all elements with scroll-animate-section class
    document.querySelectorAll('.scroll-animate-section').forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      // Clean up observer
      document.querySelectorAll('.scroll-animate-section').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ProjectsSection />
        <NewsVacanciesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
