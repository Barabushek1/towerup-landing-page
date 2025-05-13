
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Lazy load all pages for better performance
const Index = lazy(() => import('./pages/Index'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Vacancies = lazy(() => import('./pages/Vacancies'));
const VacancyDetail = lazy(() => import('./pages/VacancyDetail'));
const History = lazy(() => import('./pages/History'));
const Partners = lazy(() => import('./pages/Partners'));
const FutureProjects = lazy(() => import('./pages/FutureProjects'));
const FutureProjectDetail = lazy(() => import('./pages/FutureProjectDetail'));
const NewUzbekistan = lazy(() => import('./pages/NewUzbekistan'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
// const TermsOfService = lazy(() => import('./pages/TermsOfService'));

// Lazy load admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminNews = lazy(() => import('./pages/admin/AdminNews'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminPartners = lazy(() => import('./pages/admin/AdminPartners'));
const AdminVacancies = lazy(() => import('./pages/admin/AdminVacancies'));
const AdminVacancyApplications = lazy(() => import('./pages/admin/AdminVacancyApplications'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff'));
const AdminDepartments = lazy(() => import('./pages/admin/AdminDepartments'));
const AdminFutureProjects = lazy(() => import('./pages/admin/AdminFutureProjects'));
const AdminTenders = lazy(() => import('./pages/admin/AdminTenders'));
const AdminTenderSubmissions = lazy(() => import('./pages/admin/AdminTenderSubmissions'));
const AdminTimelineEvents = lazy(() => import('./pages/admin/AdminTimelineEvents'));
const AdminCommercialOffers = lazy(() => import('./pages/admin/AdminCommercialOffers'));
const AdminFloorPrices = lazy(() => import('./pages/admin/AdminFloorPrices'));
const AdminFloorApartmentPrices = lazy(() => import('./pages/admin/AdminFloorApartmentPrices'));
const AdminApartmentUnits = lazy(() => import('./pages/admin/AdminApartmentUnits'));
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminDetailedAuditLogs = lazy(() => import('./pages/admin/AdminDetailedAuditLogs'));
const AdminHeroImages = lazy(() => import('./pages/admin/AdminHeroImages'));

// Collaboration Pages
const Tenders = lazy(() => import('./pages/collaboration/Tenders'));
const CommercialOffers = lazy(() => import('./pages/collaboration/CommercialOffers'));

// Services Pages
const Construction = lazy(() => import('./pages/services/Construction'));
const Design = lazy(() => import('./pages/services/Design'));
const Laboratory = lazy(() => import('./pages/services/Laboratory'));
const ManagementCompany = lazy(() => import('./pages/services/ManagementCompany'));
const ProcessAutomation = lazy(() => import('./pages/services/ProcessAutomation'));
const Renovation = lazy(() => import('./pages/services/Renovation'));

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen bg-[#161616] text-white">
    <div className="text-2xl">Loading...</div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/vacancies" element={<Vacancies />} />
        <Route path="/vacancies/:id" element={<VacancyDetail />} />
        <Route path="/history" element={<History />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/future-projects" element={<FutureProjects />} />
        <Route path="/future-projects/:slug" element={<FutureProjectDetail />} />
        <Route path="/new-uzbekistan" element={<NewUzbekistan />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* <Route path="/terms-of-service" element={<TermsOfService />} /> */}

        {/* Collaboration Routes */}
        <Route path="/tenders" element={<Tenders />} />
        <Route path="/commercial-offers" element={<CommercialOffers />} />

        {/* Services Routes */}
        <Route path="/services/construction" element={<Construction />} />
        <Route path="/services/design" element={<Design />} />
        <Route path="/services/laboratory" element={<Laboratory />} />
        <Route path="/services/management-company" element={<ManagementCompany />} />
        <Route path="/services/process-automation" element={<ProcessAutomation />} />
        <Route path="/services/renovation" element={<Renovation />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/partners" element={<AdminPartners />} />
        <Route path="/admin/vacancies" element={<AdminVacancies />} />
        <Route path="/admin/vacancy-applications" element={<AdminVacancyApplications />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/departments" element={<AdminDepartments />} />
        <Route path="/admin/future-projects" element={<AdminFutureProjects />} />
        <Route path="/admin/tenders" element={<AdminTenders />} />
        <Route path="/admin/tender-submissions" element={<AdminTenderSubmissions />} />
        <Route path="/admin/timeline-events" element={<AdminTimelineEvents />} />
        <Route path="/admin/commercial-offers" element={<AdminCommercialOffers />} />
        <Route path="/admin/floor-prices" element={<AdminFloorPrices />} />
        <Route path="/admin/floor-apartment-prices" element={<AdminFloorApartmentPrices />} />
        <Route path="/admin/apartment-units" element={<AdminApartmentUnits />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        <Route path="/admin/detailed-audit-logs" element={<AdminDetailedAuditLogs />} />
        <Route path="/admin/hero-images" element={<AdminHeroImages />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
