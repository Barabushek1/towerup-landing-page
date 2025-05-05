
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { LanguageProvider } from './contexts/LanguageContext';

// Lazy-loaded pages for better initial load performance
const Index = lazy(() => import('./pages/Index'));
const About = lazy(() => import('./pages/About'));
const History = lazy(() => import('./pages/History'));
const Management = lazy(() => import('./pages/Management'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const TrcBochka = lazy(() => import('./pages/TrcBochka'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Vacancies = lazy(() => import('./pages/Vacancies'));
const VacancyDetail = lazy(() => import('./pages/VacancyDetail'));
const Partners = lazy(() => import('./pages/Partners'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Construction = lazy(() => import('./pages/Construction'));
const Design = lazy(() => import('./pages/Design'));
const Solutions = lazy(() => import('./pages/Solutions'));
const NewUzbekistan = lazy(() => import('./pages/NewUzbekistan'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners'));
const AdminVacancies = lazy(() => import('./pages/admin/AdminVacancies'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminFloorPrices = lazy(() => import('./pages/admin/AdminFloorPrices'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminDetailedAuditLogs = lazy(() => import('./pages/admin/AdminDetailedAuditLogs'));

// Loading fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#121212]">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/history" element={<History />} />
            <Route path="/management" element={<Management />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/trc-bochka" element={<TrcBochka />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/vacancies/:id" element={<VacancyDetail />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/construction" element={<Construction />} />
            <Route path="/design" element={<Design />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/new-uzbekistan" element={<NewUzbekistan />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/news" element={<AdminNews />} />
            <Route path="/admin/partners" element={<AdminPartners />} />
            <Route path="/admin/vacancies" element={<AdminVacancies />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/floor-prices" element={<AdminFloorPrices />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            <Route path="/admin/audit-logs/:id" element={<AdminDetailedAuditLogs />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;
