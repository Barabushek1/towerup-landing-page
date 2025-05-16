
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminDataProvider } from './contexts/AdminDataContext';
import TestModeIndicator from './components/TestModeIndicator';

// Public Pages
import Index from './pages/Index';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import FutureProjects from './pages/FutureProjects';
import FutureProjectDetail from './pages/FutureProjectDetail';
import NewUzbekistan from './pages/NewUzbekistan';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import History from './pages/History';
import Partners from './pages/Partners';
import Vacancies from './pages/Vacancies';
import VacancyDetail from './pages/VacancyDetail';
import Collaboration from './pages/Collaboration';
import Tenders from './pages/collaboration/Tenders';
import TenderDetail from './pages/TenderDetail';
import CommercialOffers from './pages/collaboration/CommercialOffers';
import Solutions from './pages/Solutions';
import Construction from './pages/Construction';
import Design from './pages/Design';
import ManagementCompany from './pages/services/ManagementCompany';
import BankingTechnology from './pages/BankingTechnology';
import Renovation from './pages/services/Renovation';
import ProcessAutomation from './pages/services/ProcessAutomation';
import Laboratory from './pages/services/Laboratory';
import TrcBochka from './pages/TrcBochka';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminProjects from './pages/admin/AdminProjects';
import AdminFutureProjects from './pages/admin/AdminFutureProjects';
import AdminTimelineEvents from './pages/admin/AdminTimelineEvents';
import AdminVacancies from './pages/admin/AdminVacancies';
import AdminVacancyApplications from './pages/admin/AdminVacancyApplications';
import AdminMessages from './pages/admin/AdminMessages';
import AdminPartners from './pages/admin/AdminPartners';
import AdminStaff from './pages/admin/AdminStaff';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminTenders from './pages/admin/AdminTenders';
import AdminTenderSubmissions from './pages/admin/AdminTenderSubmissions';
import AdminCommercialOffers from './pages/admin/AdminCommercialOffers';
import AdminFloorPrices from './pages/admin/AdminFloorPrices';
import AdminApartmentUnits from './pages/admin/AdminApartmentUnits';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminDetailedAuditLogs from './pages/admin/AdminDetailedAuditLogs';
import AdminCompanyStats from './pages/admin/AdminCompanyStats';
import AdminProjectCharacteristics from './pages/admin/AdminProjectCharacteristics';

// Error Pages
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AdminDataProvider>
        <LanguageProvider>
          <ThemeProvider defaultTheme="dark" storageKey="towerup-theme">
            <TestModeIndicator />
            <Helmet>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet" />
            </Helmet>
            <Routes>
              {/* Public facing pages */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/future-projects" element={<FutureProjects />} />
              <Route path="/future-projects/:slug" element={<FutureProjectDetail />} />
              <Route path="/new-uzbekistan" element={<NewUzbekistan />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/history" element={<History />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/vacancies" element={<Vacancies />} />
              <Route path="/vacancies/:id" element={<VacancyDetail />} />
              <Route path="/collaboration" element={<Collaboration />} />
              <Route path="/tenders" element={<Tenders />} />
              <Route path="/tenders/:id" element={<TenderDetail />} />
              <Route path="/commercial-offers" element={<CommercialOffers />} />
              <Route path="/services" element={<Solutions />} />
              <Route path="/services/construction" element={<Construction />} />
              <Route path="/services/design" element={<Design />} />
              <Route path="/services/management" element={<ManagementCompany />} />
              <Route path="/services/banking-technology" element={<BankingTechnology />} />
              <Route path="/services/renovation" element={<Renovation />} />
              <Route path="/services/process-automation" element={<ProcessAutomation />} />
              <Route path="/services/laboratory" element={<Laboratory />} />
              <Route path="/trc-bochka" element={<TrcBochka />} />
              
              {/* Admin panel routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/news" element={<AdminNews />} />
              <Route path="/admin/projects" element={<AdminProjects />} />
              <Route path="/admin/future-projects" element={<AdminFutureProjects />} />
              <Route path="/admin/project-characteristics" element={<AdminProjectCharacteristics />} />
              <Route path="/admin/timeline-events" element={<AdminTimelineEvents />} />
              <Route path="/admin/vacancies" element={<AdminVacancies />} />
              <Route path="/admin/vacancy-applications" element={<AdminVacancyApplications />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/admin/partners" element={<AdminPartners />} />
              <Route path="/admin/staff" element={<AdminStaff />} />
              <Route path="/admin/departments" element={<AdminDepartments />} />
              <Route path="/admin/tenders" element={<AdminTenders />} />
              <Route path="/admin/tender-submissions" element={<AdminTenderSubmissions />} />
              <Route path="/admin/commercial-offers" element={<AdminCommercialOffers />} />
              <Route path="/admin/floor-prices" element={<AdminFloorPrices />} />
              <Route path="/admin/apartment-units" element={<AdminApartmentUnits />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
              <Route path="/admin/detailed-audit-logs" element={<AdminDetailedAuditLogs />} />
              <Route path="/admin/company-stats" element={<AdminCompanyStats />} />
              
              {/* Error pages */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
      </AdminDataProvider>
    </BrowserRouter>
  );
}

export default App;
