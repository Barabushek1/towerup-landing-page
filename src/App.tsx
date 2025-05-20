
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React, { Suspense } from "react";
import ScrollToTop from "./components/ScrollToTop";
import { usePartnerSeeder } from "./hooks/use-partner-seeder";
import { useYangiUzbekistanPriceSeeder } from "./hooks/use-yangi-uzbekistan-price-seeder";
import { useTenderSeeder } from "./hooks/use-tender-seeder";
import { useYangiUzbekistanApartmentsSeeder } from "./hooks/use-yangi-uzbekistan-apartments-seeder";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Partners from "./pages/Partners";
import Management from "./pages/Management";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Vacancies from "./pages/Vacancies";
import VacancyDetail from "./pages/VacancyDetail";
import Contact from "./pages/Contact";
import Construction from "./pages/Construction";
import Design from "./pages/Design";
import Solutions from "./pages/Solutions";
import TrcBochka from "./pages/TrcBochka"; 
import NewUzbekistan from "./pages/NewUzbekistan";
import BankingTechnology from "./pages/BankingTechnology";
import ChatBot from "./components/ChatBot";
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminVacancies from './pages/admin/AdminVacancies';
import AdminVacancyApplications from './pages/admin/AdminVacancyApplications';
import AdminMessages from './pages/admin/AdminMessages';
import AdminPartners from './pages/admin/AdminPartners';
import AdminTenders from './pages/admin/AdminTenders';
import AdminTenderSubmissions from './pages/admin/AdminTenderSubmissions';
import AdminCommercialOffers from './pages/admin/AdminCommercialOffers';
import AdminFloorPrices from './pages/admin/AdminFloorPrices';
import AdminApartmentUnits from './pages/admin/AdminApartmentUnits';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminDetailedAuditLogs from './pages/admin/AdminDetailedAuditLogs';
import AdminLayout from "./components/admin/AdminLayout";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminDepartments from "./pages/admin/AdminDepartments";
import AdminFutureProjects from "./pages/admin/AdminFutureProjects";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminYangiUzbekistanPrices from "./pages/admin/AdminYangiUzbekistanPrices";
import AdminYangiUzbekistanApartments from "./pages/admin/AdminYangiUzbekistanApartments";
import AdminYangiUzbekistanFloorPlans from "./pages/admin/AdminYangiUzbekistanFloorPlans";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Collaboration from "./pages/Collaboration";
import Tenders from "./pages/collaboration/Tenders";
import TenderDetail from "./pages/TenderDetail";
import CommercialOffers from "./pages/collaboration/CommercialOffers";
import FutureProjects from "./pages/FutureProjects";
import FutureProjectDetail from "./pages/FutureProjectDetail";

// Import the service page components
import ManagementCompany from "./pages/services/ManagementCompany";
import ServiceDesign from "./pages/services/Design";
import ServiceConstruction from "./pages/services/Construction";
import Renovation from "./pages/services/Renovation";
import Laboratory from "./pages/services/Laboratory";
import ProcessAutomation from "./pages/services/ProcessAutomation";

// Import AdminTimelineEvents explicitly
import AdminTimelineEvents from "./pages/admin/AdminTimelineEvents";

import AdminCompanyStats from "./pages/admin/AdminCompanyStats";

const helmetContext = {};
const routes = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/partners',
    element: <Partners />,
  },
  {
    path: '/management',
    element: <Management />,
  },
  {
    path: '/projects',
    element: <Projects />,
  },
  {
    path: '/projects/:slug',
    element: <ProjectDetail />,
  },
  {
    path: '/projects/trcbochka',
    element: <TrcBochka />,
  },
  {
    path: '/projects/new-uzbekistan',
    element: <NewUzbekistan />,
  },
  {
    path: '/projects/banking-technology',
    element: <BankingTechnology />,
  },
  {
    path: '/future-projects',
    element: <FutureProjects />,
  },
  {
    path: '/future-projects/:slug',
    element: <FutureProjectDetail />,
  },
  {
    path: '/news',
    element: <News />,
  },
  {
    path: '/news/:id',
    element: <NewsDetail />,
  },
  {
    path: '/vacancies',
    element: <Vacancies />,
  },
  {
    path: '/vacancies/:id',
    element: <VacancyDetail />,
  },
  {
    path: '/contact',
    element: <Contact />,
  },
  {
    path: '/collaboration',
    element: <Collaboration />,
  },
  {
    path: '/collaboration/tenders',
    element: <Tenders />,
  },
  {
    path: '/tenders/:id',
    element: <TenderDetail />,
  },
  {
    path: '/collaboration/offers',
    element: <CommercialOffers />,
  },
  {
    path: '/services/management-company',
    element: <ManagementCompany />,
  },
  {
    path: '/services/design',
    element: <ServiceDesign />,
  },
  {
    path: '/services/construction',
    element: <ServiceConstruction />,
  },
  {
    path: '/services/renovation',
    element: <Renovation />,
  },
  {
    path: '/services/laboratory',
    element: <Laboratory />,
  },
  {
    path: '/services/process-automation',
    element: <ProcessAutomation />,
  },
  {
    path: '/construction',
    element: <Construction />,
  },
  {
    path: '/design',
    element: <Design />,
  },
  {
    path: '/solutions',
    element: <Solutions />,
  },
  {
    path: '/admin',
    element: <AdminLogin />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminLayout><AdminDashboard /></AdminLayout>,
  },
  {
    path: '/admin/news',
    element: <AdminLayout><AdminNews /></AdminLayout>,
  },
  {
    path: '/admin/vacancies',
    element: <AdminLayout><AdminVacancies /></AdminLayout>,
  },
  {
    path: '/admin/messages',
    element: <AdminLayout><AdminMessages /></AdminLayout>,
  },
  {
    path: '/admin/partners',
    element: <AdminLayout><AdminPartners /></AdminLayout>,
  },
  {
    path: '/admin/tenders',
    element: <AdminLayout><AdminTenders /></AdminLayout>,
  },
  {
    path: '/admin/commercial-offers',
    element: <AdminLayout><AdminCommercialOffers /></AdminLayout>,
  },
  {
    path: '/admin/vacancy-applications',
    element: <AdminLayout><AdminVacancyApplications /></AdminLayout>,
  },
  {
    path: '/admin/audit-logs',
    element: <AdminLayout><AdminAuditLogs /></AdminLayout>,
  },
  {
    path: '/admin/detailed-audit-logs',
    element: <AdminLayout><AdminDetailedAuditLogs /></AdminLayout>,
  },
  {
    path: '/admin/floor-prices',
    element: <AdminLayout><AdminFloorPrices /></AdminLayout>,
  },
  {
    path: '/admin/tender-submissions',
    element: <AdminLayout><AdminTenderSubmissions /></AdminLayout>,
  },
  {
    path: '/admin/apartment-units',
    element: <AdminLayout><AdminApartmentUnits /></AdminLayout>,
  },
  {
    path: '/admin/staff',
    element: <AdminStaff />,
  },
  {
    path: '/admin/departments',
    element: <AdminDepartments />,
  },
  {
    path: '/admin/future-projects',
    element: <AdminLayout><AdminFutureProjects /></AdminLayout>,
  },
  {
    path: '/admin/projects',
    element: <AdminLayout><AdminProjects /></AdminLayout>,
  },
  {
    path: '/admin/timeline-events',
    element: <AdminLayout><AdminTimelineEvents /></AdminLayout>,
  },
  {
    path: '/admin/company-stats',
    element: <AdminLayout><AdminCompanyStats /></AdminLayout>,
  },
  {
    path: '/admin/yangi-uzbekistan-prices',
    element: <AdminLayout><AdminYangiUzbekistanPrices /></AdminLayout>,
  },
  {
    path: '/admin/yangi-uzbekistan-apartments',
    element: <AdminLayout><AdminYangiUzbekistanApartments /></AdminLayout>,
  },
  {
    path: '/admin/yangi-uzbekistan-floor-plans',
    element: <AdminYangiUzbekistanFloorPlans />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

function App() {
  const location = useLocation();
  usePartnerSeeder();
  useYangiUzbekistanPriceSeeder();
  useYangiUzbekistanApartmentsSeeder();
  useTenderSeeder();
  
  return (
    <HelmetProvider context={helmetContext}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
        </Routes>
        <ChatBot />
      </TooltipProvider>
    </HelmetProvider>
  );
};

export default App;
