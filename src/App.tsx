
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Projects from '@/pages/Projects';
import Vacancies from '@/pages/Vacancies';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import { HelmetProvider } from 'react-helmet-async';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminNews from '@/pages/admin/AdminNews';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminVacancies from '@/pages/admin/AdminVacancies';
import AdminMessages from '@/pages/admin/AdminMessages';
import AdminPartners from '@/pages/admin/AdminPartners';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminStaff from '@/pages/admin/AdminStaff';
import AdminDepartments from '@/pages/admin/AdminDepartments';
import AdminFutureProjects from '@/pages/admin/AdminFutureProjects';
import AdminTenders from '@/pages/admin/AdminTenders';
import AdminTenderSubmissions from '@/pages/admin/AdminTenderSubmissions';
import AdminCommercialOffers from '@/pages/admin/AdminCommercialOffers';
import AdminFloorPrices from '@/pages/admin/AdminFloorPrices';
import AdminApartmentUnits from '@/pages/admin/AdminApartmentUnits';
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs';
import AdminDetailedAuditLogs from '@/pages/admin/AdminDetailedAuditLogs';
import AdminVacancyApplications from '@/pages/admin/AdminVacancyApplications';
import AdminTimelineEvents from '@/pages/admin/AdminTimelineEvents';
import { useAdmin } from '@/contexts/AdminContext';
import { Toaster } from '@/components/ui/toaster';
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminHeroImages from "./pages/admin/AdminHeroImages";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { admin, isLoading } = useAdmin();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return admin ? element : <Navigate to="/admin/login" />;
};

function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Returns null on first render, so the client can hydrate.
    return null;
  }
  
  return (
    <div className="min-h-screen text-foreground antialiased">
      <HelmetProvider>
        {/* Removed the redundant BrowserRouter here */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/admin">
            <Route path="dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
            <Route path="news" element={<ProtectedRoute element={<AdminNews />} />} />
            <Route path="projects" element={<ProtectedRoute element={<AdminProjects />} />} />
            <Route path="timeline-events" element={<ProtectedRoute element={<AdminTimelineEvents />} />} />
            <Route path="testimonials" element={<ProtectedRoute element={<AdminTestimonials />} />} />
            <Route path="hero-images" element={<ProtectedRoute element={<AdminHeroImages />} />} />
            <Route path="vacancies" element={<ProtectedRoute element={<AdminVacancies />} />} />
            <Route path="vacancy-applications" element={<ProtectedRoute element={<AdminVacancyApplications />} />} />
            <Route path="messages" element={<ProtectedRoute element={<AdminMessages />} />} />
            <Route path="partners" element={<ProtectedRoute element={<AdminPartners />} />} />
            <Route path="staff" element={<ProtectedRoute element={<AdminStaff />} />} />
            <Route path="departments" element={<ProtectedRoute element={<AdminDepartments />} />} />
            <Route path="future-projects" element={<ProtectedRoute element={<AdminFutureProjects />} />} />
            <Route path="tenders" element={<ProtectedRoute element={<AdminTenders />} />} />
            <Route path="tender-submissions" element={<ProtectedRoute element={<AdminTenderSubmissions />} />} />
            <Route path="commercial-offers" element={<ProtectedRoute element={<AdminCommercialOffers />} />} />
            <Route path="floor-prices" element={<ProtectedRoute element={<AdminFloorPrices />} />} />
            <Route path="apartment-units" element={<ProtectedRoute element={<AdminApartmentUnits />} />} />
            <Route path="audit-logs" element={<ProtectedRoute element={<AdminAuditLogs />} />} />
            <Route path="detailed-audit-logs" element={<ProtectedRoute element={<AdminDetailedAuditLogs />} />} />
            <Route path="login" element={<AdminLogin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HelmetProvider>
      <Toaster />
    </div>
  );
}

export default App;
