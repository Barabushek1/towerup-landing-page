import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';

// Import pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import History from '@/pages/History';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import Vacancies from '@/pages/Vacancies';
import VacancyDetail from '@/pages/VacancyDetail';
import News from '@/pages/News';
import NewsDetail from '@/pages/NewsDetail';
import Partners from '@/pages/Partners';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import NotFound from '@/pages/NotFound';
import Collaboration from '@/pages/Collaboration';

// Import New Uzbekistan Project pages
import NewUzbekistan from '@/pages/NewUzbekistan';
import TrcBochka from '@/pages/TrcBochka';

// Import Services pages
import Design from '@/pages/services/Design';
import Construction from '@/pages/services/Construction';
import Management from '@/pages/services/Management';
import Solutions from '@/pages/services/Solutions';

// Import Admin pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminFloorPrices from '@/pages/admin/AdminFloorPrices';
import AdminNews from '@/pages/admin/AdminNews';
import AdminVacancies from '@/pages/admin/AdminVacancies';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminPartners from '@/pages/admin/AdminPartners';
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs';
import AdminDetailedAuditLogs from '@/pages/admin/AdminDetailedAuditLogs';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDataProvider from '@/contexts/AdminDataContext';
import ScrollToTop from '@/components/ScrollToTop';
import AdminTenders from '@/pages/admin/AdminTenders';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AdminDataProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/history" element={<History />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/vacancies/:vacancyId" element={<VacancyDetail />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:newsId" element={<NewsDetail />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/collaboration" element={<Collaboration />} />
            
            {/* New Uzbekistan Project Routes */}
            <Route path="/new-uzbekistan" element={<NewUzbekistan />} />
            <Route path="/trc-bochka" element={<TrcBochka />} />
            
            {/* Services Routes */}
            <Route path="/design" element={<Design />} />
            <Route path="/construction" element={<Construction />} />
            <Route path="/management" element={<Management />} />
            <Route path="/solutions" element={<Solutions />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route 
              path="/admin/floor-prices" 
              element={
                <AdminLayout>
                  <AdminFloorPrices />
                </AdminLayout>
              }
            />
            <Route 
              path="/admin/news" 
              element={
                <AdminLayout>
                  <AdminNews />
                </AdminLayout>
              }
            />
            <Route 
              path="/admin/vacancies" 
              element={
                <AdminLayout>
                  <AdminVacancies />
                </AdminLayout>
              }
            />
            <Route 
              path="/admin/messages" 
              element={
                <AdminLayout>
                  <AdminMessages />
                </AdminLayout>
              }
            />
            <Route 
              path="/admin/partners" 
              element={
                <AdminLayout>
                  <AdminPartners />
                </AdminLayout>
              }
            />
            <Route 
              path="/admin/tenders" 
              element={
                <AdminLayout>
                  <AdminTenders />
                </AdminLayout>
              }
            />
            <Route 
              path="/admin/audit-logs" 
              element={
                <AdminLayout>
                  <AdminAuditLogs />
                </AdminLayout>
              }
            />
            <Route 
              path="/admin/detailed-audit-logs" 
              element={
                <AdminLayout>
                  <AdminDetailedAuditLogs />
                </AdminLayout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminDataProvider>
      </BrowserRouter>
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
