
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from './components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import './App.css';

// Lazy-loaded pages
const Index = React.lazy(() => import('./pages/Index'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const News = React.lazy(() => import('./pages/News'));
const NewsDetail = React.lazy(() => import('./pages/NewsDetail'));
const Vacancies = React.lazy(() => import('./pages/Vacancies'));
const VacancyDetail = React.lazy(() => import('./pages/VacancyDetail'));
const Partners = React.lazy(() => import('./pages/Partners'));
const History = React.lazy(() => import('./pages/History'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const TrcBochka = React.lazy(() => import('./pages/TrcBochka'));
const NewUzbekistan = React.lazy(() => import('./pages/NewUzbekistan'));
const Collaboration = React.lazy(() => import('./pages/Collaboration'));
const TenderDetail = React.lazy(() => import('./pages/TenderDetail'));
const FutureProjects = React.lazy(() => import('./pages/FutureProjects'));
const FutureProjectDetail = React.lazy(() => import('./pages/FutureProjectDetail'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));

// Admin pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminNews = React.lazy(() => import('./pages/admin/AdminNews'));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'));
const AdminTimelineEvents = React.lazy(() => import('./pages/admin/AdminTimelineEvents'));
const AdminVacancies = React.lazy(() => import('./pages/admin/AdminVacancies'));
const AdminVacancyApplications = React.lazy(() => import('./pages/admin/AdminVacancyApplications'));
const AdminMessages = React.lazy(() => import('./pages/admin/AdminMessages'));
const AdminFutureProjects = React.lazy(() => import('./pages/admin/AdminFutureProjects'));
const AdminTenders = React.lazy(() => import('./pages/admin/AdminTenders'));
const AdminTenderSubmissions = React.lazy(() => import('./pages/admin/AdminTenderSubmissions'));
const AdminCommercialOffers = React.lazy(() => import('./pages/admin/AdminCommercialOffers'));
const AdminPartners = React.lazy(() => import('./pages/admin/AdminPartners'));
const AdminStaff = React.lazy(() => import('./pages/admin/AdminStaff'));
const AdminDepartments = React.lazy(() => import('./pages/admin/AdminDepartments'));
const AdminFloorPrices = React.lazy(() => import('./pages/admin/AdminFloorPrices'));
const AdminApartmentUnits = React.lazy(() => import('./pages/admin/AdminApartmentUnits'));
const AdminAuditLogs = React.lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminDetailedAuditLogs = React.lazy(() => import('./pages/admin/AdminDetailedAuditLogs'));
const AdminCompanyStats = React.lazy(() => import('./pages/admin/AdminCompanyStats'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminPushkinFloorPrices = React.lazy(() => import('./pages/admin/AdminPushkinFloorPrices'));
const AdminPushkinApartmentUnits = React.lazy(() => import('./pages/admin/AdminPushkinApartmentUnits'));
const AdminYangiUzbekistanFloorPrices = React.lazy(() => import('./pages/admin/AdminYangiUzbekistanFloorPrices'));
const AdminYangiUzbekistanApartmentUnits = React.lazy(() => import('./pages/admin/AdminYangiUzbekistanApartmentUnits'));

// Service pages
const Design = React.lazy(() => import('./pages/Design'));
const Construction = React.lazy(() => import('./pages/Construction'));
const Management = React.lazy(() => import('./pages/Management'));
const BankingTechnology = React.lazy(() => import('./pages/BankingTechnology'));
const Solutions = React.lazy(() => import('./pages/Solutions'));

const ServiceConstructionPage = React.lazy(() => import('./pages/services/Construction'));
const ServiceDesignPage = React.lazy(() => import('./pages/services/Design'));
const ServiceLaboratoryPage = React.lazy(() => import('./pages/services/Laboratory'));
const ServiceManagementCompanyPage = React.lazy(() => import('./pages/services/ManagementCompany'));
const ServiceProcessAutomationPage = React.lazy(() => import('./pages/services/ProcessAutomation'));
const ServiceRenovationPage = React.lazy(() => import('./pages/services/Renovation'));

// Collaboration pages
const TendersPage = React.lazy(() => import('./pages/collaboration/Tenders'));
const CommercialOffersPage = React.lazy(() => import('./pages/collaboration/CommercialOffers'));

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Index />
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <About />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Contact />
          </Suspense>
        } />
        <Route path="/projects" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Projects />
          </Suspense>
        } />
        <Route path="/projects/:slug" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <ProjectDetail />
          </Suspense>
        } />
        <Route path="/news" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <News />
          </Suspense>
        } />
        <Route path="/news/:id" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <NewsDetail />
          </Suspense>
        } />
        <Route path="/vacancies" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Vacancies />
          </Suspense>
        } />
        <Route path="/vacancies/:id" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <VacancyDetail />
          </Suspense>
        } />
        <Route path="/partners" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Partners />
          </Suspense>
        } />
        <Route path="/history" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <History />
          </Suspense>
        } />
        <Route path="/projects/trc-bochka" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <TrcBochka />
          </Suspense>
        } />
        <Route path="/projects/new-uzbekistan" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <NewUzbekistan />
          </Suspense>
        } />
        <Route path="/collaboration" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Collaboration />
          </Suspense>
        } />
        <Route path="/collaboration/tenders" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <TendersPage />
          </Suspense>
        } />
        <Route path="/collaboration/commercial-offers" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <CommercialOffersPage />
          </Suspense>
        } />
        <Route path="/tenders/:id" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <TenderDetail />
          </Suspense>
        } />
        <Route path="/future-projects" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <FutureProjects />
          </Suspense>
        } />
        <Route path="/future-projects/:slug" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <FutureProjectDetail />
          </Suspense>
        } />
        <Route path="/privacy-policy" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <PrivacyPolicy />
          </Suspense>
        } />

        {/* Service routes */}
        <Route path="/services/design" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Design />
          </Suspense>
        } />
        <Route path="/services/construction" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Construction />
          </Suspense>
        } />
        <Route path="/services/management" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Management />
          </Suspense>
        } />
        <Route path="/services/banking-technology" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <BankingTechnology />
          </Suspense>
        } />
        <Route path="/services/solutions" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Solutions />
          </Suspense>
        } />

        {/* New service pages */}
        <Route path="/services/construction-services" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <ServiceConstructionPage />
          </Suspense>
        } />
        <Route path="/services/design-services" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <ServiceDesignPage />
          </Suspense>
        } />
        <Route path="/services/laboratory" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <ServiceLaboratoryPage />
          </Suspense>
        } />
        <Route path="/services/management-company" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <ServiceManagementCompanyPage />
          </Suspense>
        } />
        <Route path="/services/process-automation" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <ServiceProcessAutomationPage />
          </Suspense>
        } />
        <Route path="/services/renovation" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <ServiceRenovationPage />
          </Suspense>
        } />

        {/* Admin routes */}
        <Route path="/admin/login" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminLogin />
          </Suspense>
        } />
        <Route path="/admin/dashboard" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="/admin/news" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminNews />
          </Suspense>
        } />
        <Route path="/admin/projects" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminProjects />
          </Suspense>
        } />
        <Route path="/admin/timeline-events" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminTimelineEvents />
          </Suspense>
        } />
        <Route path="/admin/vacancies" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminVacancies />
          </Suspense>
        } />
        <Route path="/admin/vacancy-applications" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminVacancyApplications />
          </Suspense>
        } />
        <Route path="/admin/messages" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminMessages />
          </Suspense>
        } />
        <Route path="/admin/partners" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminPartners />
          </Suspense>
        } />
        <Route path="/admin/staff" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminStaff />
          </Suspense>
        } />
        <Route path="/admin/departments" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminDepartments />
          </Suspense>
        } />
        <Route path="/admin/future-projects" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminFutureProjects />
          </Suspense>
        } />
        <Route path="/admin/tenders" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminTenders />
          </Suspense>
        } />
        <Route path="/admin/tender-submissions" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminTenderSubmissions />
          </Suspense>
        } />
        <Route path="/admin/commercial-offers" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminCommercialOffers />
          </Suspense>
        } />
        <Route path="/admin/floor-prices" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminFloorPrices />
          </Suspense>
        } />
        <Route path="/admin/apartment-units" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminApartmentUnits />
          </Suspense>
        } />
        <Route path="/admin/audit-logs" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminAuditLogs />
          </Suspense>
        } />
        <Route path="/admin/detailed-audit-logs" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminDetailedAuditLogs />
          </Suspense>
        } />
        <Route path="/admin/company-stats" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminCompanyStats />
          </Suspense>
        } />

        {/* Pushkin project admin routes */}
        <Route path="/admin/pushkin/floor-prices" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminPushkinFloorPrices />
          </Suspense>
        } />
        <Route path="/admin/pushkin/apartment-units" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminPushkinApartmentUnits />
          </Suspense>
        } />

        {/* Yangi Uzbekistan project admin routes */}
        <Route path="/admin/yangi-uzbekistan/floor-prices" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminYangiUzbekistanFloorPrices />
          </Suspense>
        } />
        <Route path="/admin/yangi-uzbekistan/apartment-units" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <AdminYangiUzbekistanApartmentUnits />
          </Suspense>
        } />

        {/* 404 page */}
        <Route path="*" element={
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
      <Toaster />
      <SonnerToaster position="top-right" />
    </HelmetProvider>
  );
}

export default App;
