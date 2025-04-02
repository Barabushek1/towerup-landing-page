import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { usePartnerSeeder } from "./hooks/use-partner-seeder";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import History from "./pages/History";
import Partners from "./pages/Partners";
import Management from "./pages/Management";
import Projects from "./pages/Projects";
import News from "./pages/News";
import Vacancies from "./pages/Vacancies";
import Contact from "./pages/Contact";
import Construction from "./pages/Construction";
import Design from "./pages/Design";
import Solutions from "./pages/Solutions";
import ChatBot from "./components/ChatBot";

// Детальные страницы
import NewsDetail from "./pages/NewsDetail";
import VacancyDetail from "./pages/VacancyDetail";

// Admin Panel Routes
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminVacancies from "./pages/admin/AdminVacancies";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminPartners from "./pages/admin/AdminPartners";
import AdminLayout from "./components/admin/AdminLayout";

const queryClient = new QueryClient();

const AppContent = () => {
  // Seed partners data if needed
  usePartnerSeeder();
  
  return (
    <>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Company routes */}
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<History />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/management" element={<Management />} />
          
          {/* Other main routes */}
          <Route path="/projects" element={<Projects />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Services routes */}
          <Route path="/construction" element={<Construction />} />
          <Route path="/design" element={<Design />} />
          <Route path="/solutions" element={<Solutions />} />
          
          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/news" element={<AdminLayout><AdminNews /></AdminLayout>} />
          <Route path="/admin/vacancies" element={<AdminLayout><AdminVacancies /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />
          <Route path="/admin/partners" element={<AdminLayout><AdminPartners /></AdminLayout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatBot />
      </TooltipProvider>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
