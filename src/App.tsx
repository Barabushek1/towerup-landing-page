import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminDataProvider } from './contexts/AdminDataContext';
import Loader from './components/Loader';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNews from './pages/admin/AdminNews';
import AdminVacancies from './pages/admin/AdminVacancies';
import AdminPartners from './pages/admin/AdminPartners';
import AdminMessages from './pages/admin/AdminMessages';
import AdminFutureProjects from './pages/admin/AdminFutureProjects';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import ServicesPage from './pages/Services';
import ProjectsPage from './pages/Projects';
import VacanciesPage from './pages/Vacancies';
import ContactPage from './pages/Contact';
import CollaborationPage from './pages/Collaboration';
import FutureProjectsPage from './pages/FutureProjects';
import FutureProjectDetail from './pages/FutureProjectDetail';
import VacancyDetail from './pages/VacancyDetail';
import NewsDetail from './pages/NewsDetail';
import TendersPage from './pages/Tenders';
import OffersPage from './pages/Offers';
import NotFoundPage from './pages/NotFound';
import ManagementPage from './pages/Management';
import PartnersPage from './pages/Partners';
import DesignPage from './pages/Design';
import ConstructionPage from './pages/Construction';
import RenovationPage from './pages/Renovation';
import LaboratoryPage from './pages/Laboratory';
import ProcessAutomationPage from './pages/ProcessAutomation';
import ProjectPushkin from './pages/ProjectPushkin';
import ProjectTrcBochka from './pages/ProjectTrcBochka';
import ProjectNewUzbekistan from './pages/ProjectNewUzbekistan';
import BankingTechnology from './pages/BankingTechnology';

// Import the AdminProjects component
import AdminProjects from './pages/admin/AdminProjects';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className='antialiased text-zinc-50'>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/vacancies" element={<VacanciesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/collaboration" element={<CollaborationPage />} />
          <Route path="/future-projects" element={<FutureProjectsPage />} />
          <Route path="/future-projects/:slug" element={<FutureProjectDetail />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/collaboration/tenders" element={<TendersPage />} />
          <Route path="/collaboration/offers" element={<OffersPage />} />
          <Route path="/management" element={<ManagementPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/services/design" element={<DesignPage />} />
          <Route path="/services/construction" element={<ConstructionPage />} />
          <Route path="/services/renovation" element={<RenovationPage />} />
          <Route path="/services/laboratory" element={<LaboratoryPage />} />
          <Route path="/services/process-automation" element={<ProcessAutomationPage />} />
          <Route path="/projects/pushkin" element={<ProjectPushkin />} />
          <Route path="/projects/trcbochka" element={<ProjectTrcBochka />} />
          <Route path="/projects/new-uzbekistan" element={<ProjectNewUzbekistan />} />
          <Route path="/projects/banking-technology" element={<BankingTechnology />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <AuthProvider>
              <LoginPage />
            </AuthProvider>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AuthProvider>
              <AdminDataProvider>
                <Suspense fallback={<Loader />}>
                  <AdminDashboard />
                </Suspense>
              </AdminDataProvider>
            </AuthProvider>
          } />
          <Route path="/admin/news" element={
            <AuthProvider>
              <AdminDataProvider>
                <Suspense fallback={<Loader />}>
                  <AdminNews />
                </Suspense>
              </AdminDataProvider>
            </AuthProvider>
          } />
          <Route path="/admin/vacancies" element={
            <AuthProvider>
              <AdminDataProvider>
                <Suspense fallback={<Loader />}>
                  <AdminVacancies />
                </Suspense>
              </AdminDataProvider>
            </AuthProvider>
          } />
          <Route path="/admin/partners" element={
            <AuthProvider>
              <AdminDataProvider>
                <Suspense fallback={<Loader />}>
                  <AdminPartners />
                </Suspense>
              </AdminDataProvider>
            </AuthProvider>
          } />
          <Route path="/admin/messages" element={
            <AuthProvider>
              <AdminDataProvider>
                <Suspense fallback={<Loader />}>
                  <AdminMessages />
                </Suspense>
              </AdminDataProvider>
            </AuthProvider>
          } />
          <Route path="/admin/future-projects" element={
            <AuthProvider>
              <AdminDataProvider>
                <Suspense fallback={<Loader />}>
                  <AdminFutureProjects />
                </Suspense>
              </AdminDataProvider>
            </AuthProvider>
          } />
          <Route path="/admin/projects" element={
            <AdminDataProvider>
              <Suspense fallback={<Loader />}>
                <AdminProjects />
              </Suspense>
            </AdminDataProvider>
          } />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
