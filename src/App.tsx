
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";
import { usePartnerSeeder } from "./hooks/use-partner-seeder";
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
import ChatBot from "./components/ChatBot";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminVacancies from "./pages/admin/AdminVacancies";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AdminDetailedAuditLogs from "./pages/admin/AdminDetailedAuditLogs";
import AdminLayout from "./components/admin/AdminLayout";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminFloorPrices from './pages/admin/AdminFloorPrices';
import Collaboration from "./pages/Collaboration";
import Tenders from "./pages/collaboration/Tenders";
import CommercialOffers from "./pages/collaboration/CommercialOffers";
import { 
  ManagementCompany,
  Design as ServiceDesign,
  Construction as ServiceConstruction,
  Renovation,
  Laboratory,
  ProcessAutomation
} from "./pages/services";

const helmetContext = {};

const App = () => {
  usePartnerSeeder();
  
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
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/collaboration/tenders" element={<Tenders />} />
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
          <Route path="/admin/audit-logs" element={<AdminLayout><AdminAuditLogs /></AdminLayout>} />
          <Route path="/admin/detailed-audit-logs" element={<AdminLayout><AdminDetailedAuditLogs /></AdminLayout>} />
          <Route path="/admin/floor-prices" element={<AdminLayout><AdminFloorPrices /></AdminLayout>} />
          
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </TooltipProvider>
    </HelmetProvider>
  );
};

export default App;
