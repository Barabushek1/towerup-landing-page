import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Index from './pages/Index';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNews from './pages/admin/AdminNews';
import AdminProjects from './pages/admin/AdminProjects';
import AdminFutureProjects from './pages/admin/AdminFutureProjects';
import AdminVacancies from './pages/admin/AdminVacancies';
import AdminPartners from './pages/admin/AdminPartners';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminStaff from './pages/admin/AdminStaff';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminCompanyStats from './pages/admin/AdminCompanyStats';
import AdminTimelineEvents from './pages/admin/AdminTimelineEvents';
import AdminVacancyApplications from './pages/admin/AdminVacancyApplications';
import AdminTenders from './pages/admin/AdminTenders';
import AdminTenderSubmissions from './pages/admin/AdminTenderSubmissions';
import AdminCommercialOffers from './pages/admin/AdminCommercialOffers';
import AdminYangiUzbekistanFloorPlans from './pages/admin/AdminYangiUzbekistanFloorPlans';
import AdminYangiUzbekistanPrices from './pages/admin/AdminYangiUzbekistanPrices';
import AdminYangiUzbekistanApartments from './pages/admin/AdminYangiUzbekistanApartments';
import AdminFloorPrices from './pages/admin/AdminFloorPrices';
import AdminFloorApartmentPrices from './pages/admin/AdminFloorApartmentPrices';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminDetailedAuditLogs from './pages/admin/AdminDetailedAuditLogs';
import UnderConstruction from './pages/UnderConstruction';
import YangiUzbekistan from './pages/YangiUzbekistan';
import FloorApartmentPrices from './pages/FloorApartmentPrices';
import FloorPrices from './pages/FloorPrices';
import Tenders from './pages/Tenders';
import Vacancies from './pages/Vacancies';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Function to update the online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Set initial online status
    setIsOnline(navigator.onLine);

    // Add event listeners to listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/under-construction" element={<UnderConstruction />} />
        <Route path="/yangi-uzbekistan" element={<YangiUzbekistan />} />
        <Route path="/floor-apartment-prices/:id" element={<FloorApartmentPrices />} />
        <Route path="/floor-prices/:id" element={<FloorPrices />} />
        <Route path="/tenders" element={<Tenders />} />
        <Route path="/vacancies" element={<Vacancies />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="/admin/future-projects" element={<AdminFutureProjects />} />
        <Route path="/admin/vacancies" element={<AdminVacancies />} />
        <Route path="/admin/partners" element={<AdminPartners />} />
        <Route path="/admin/departments" element={<AdminDepartments />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/testimonials" element={<AdminTestimonials />} />
        <Route path="/admin/company-stats" element={<AdminCompanyStats />} />
        <Route path="/admin/timeline-events" element={<AdminTimelineEvents />} />
        <Route path="/admin/vacancy-applications" element={<AdminVacancyApplications />} />
        <Route path="/admin/tender-submissions" element={<AdminTenderSubmissions />} />
        <Route path="/admin/tenders" element={<AdminTenders />} />
        <Route path="/admin/commercial-offers" element={<AdminCommercialOffers />} />
        <Route path="/admin/yangi-uzbekistan-floor-plans" element={<AdminYangiUzbekistanFloorPlans />} />
        <Route path="/admin/yangi-uzbekistan-prices" element={<AdminYangiUzbekistanPrices />} />
        <Route path="/admin/yangi-uzbekistan-apartments" element={<AdminYangiUzbekistanApartments />} />
        <Route path="/admin/floor-prices" element={<AdminFloorPrices />} />
        <Route path="/admin/floor-apartment-prices" element={<AdminFloorApartmentPrices />} />
        <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
        <Route path="/admin/audit-logs/:id" element={<AdminDetailedAuditLogs />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    
  );
}

export default App;
