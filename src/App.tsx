import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import { usePartnerSeeder } from "./hooks/use-partner-seeder";
import { useYangiUzbekistanPriceSeeder } from "./hooks/use-yangi-uzbekistan-price-seeder";
import { useTenderSeeder } from "./hooks/use-tender-seeder";
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

const App = () => {
  usePartnerSeeder();
  useYangiUzbekistanPriceSeeder();
  useTenderSeeder();
  
  return (
    <HelmetProvider context={helmetContext}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/management" element={<Management />} />
          
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/projects/trcbochka" element={<TrcBochka />} />
          <Route path="/projects/new-uzbekistan" element={<NewUzbekistan />} />
          <Route path="/projects/banking-technology" element={<BankingTechnology />} />
          <Route path="/future-projects" element={<FutureProjects />} />
          <Route path="/future-projects/:slug" element={<FutureProjectDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/collaboration/tenders" element={<Tenders />} />
          <Route path="/tenders/:id" element={<TenderDetail />} />
          <Route path="/collaboration/offers" element={<CommercialOffers />} />
          
          {/* Service Pages */}
          <Route path="/services/management-company" element={<ManagementCompany />} />
          <Route path="/services/design" element={<ServiceDesign />} />
          <Route path="/services/construction" element={<ServiceConstruction />} />
          <Route path="/services/renovation" element={<Renovation />} />
          <Route path="/services/laboratory" element={<Laboratory />} />
          <Route path="/services/process-automation" element={<ProcessAutomation />} />
          
          <Route path="/construction" element={<Construction />} />
          <Route path="/design" element={<Design />} />
          <Route path="/solutions" element={<Solutions />} />
          
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/news" element={<AdminLayout><AdminNews /></AdminLayout>} />
          <Route path="/admin/vacancies" element={<AdminLayout><AdminVacancies /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
          <Route path="/admin/partners" element={<AdminLayout><AdminPartners /></AdminLayout>} />
          <Route path="/admin/tenders" element={<AdminLayout><AdminTenders /></AdminLayout>} />
          <Route path="/admin/commercial-offers" element={<AdminLayout><AdminCommercialOffers /></AdminLayout>} />
          <Route path="/admin/vacancy-applications" element={<AdminLayout><AdminVacancyApplications /></AdminLayout>} />
          <Route path="/admin/audit-logs" element={<AdminLayout><AdminAuditLogs /></AdminLayout>} />
          <Route path="/admin/detailed-audit-logs" element={<AdminLayout><AdminDetailedAuditLogs /></AdminLayout>} />
          <Route path="/admin/floor-prices" element={<AdminLayout><AdminFloorPrices /></AdminLayout>} />
          <Route path="/admin/tender-submissions" element={<AdminLayout><AdminTenderSubmissions /></AdminLayout>} />
          <Route path="/admin/apartment-units" element={<AdminLayout><AdminApartmentUnits /></AdminLayout>} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/future-projects" element={<AdminLayout><AdminFutureProjects /></AdminLayout>} />
          <Route path="/admin/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
          <Route path="/admin/timeline-events" element={<AdminLayout><AdminTimelineEvents /></AdminLayout>} />
          <Route path="/admin/company-stats" element={<AdminLayout><AdminCompanyStats /></AdminLayout>} />
          <Route path="/admin/yangi-uzbekistan-prices" element={<AdminLayout><AdminYangiUzbekistanPrices /></AdminLayout>} />
          
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </TooltipProvider>
    </HelmetProvider>
  );
};

export default App;
