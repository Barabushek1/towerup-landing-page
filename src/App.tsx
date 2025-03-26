import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import SEOMetaTags from "./components/SEOMetaTags";
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
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SEOMetaTags />
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
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Services routes */}
            <Route path="/construction" element={<Construction />} />
            <Route path="/design" element={<Design />} />
            <Route path="/solutions" element={<Solutions />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<Admin />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
