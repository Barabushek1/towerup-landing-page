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

// Import maintenance page
import MaintenancePage from "./components/MaintenancePage";

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
import AdminTelegramBot from "./pages/admin/AdminTelegramBot";
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

function App() {
  const location = useLocation();
  usePartnerSeeder();
  useYangiUzbekistanPriceSeeder();
  useYangiUzbekistanApartmentsSeeder();
  useTenderSeeder();
  
  // Show maintenance page for all routes
  return (
    <HelmetProvider context={helmetContext}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <MaintenancePage />
      </TooltipProvider>
    </HelmetProvider>
  );
};

export default App;
