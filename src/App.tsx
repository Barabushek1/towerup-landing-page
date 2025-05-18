import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TestModeIndicator } from './components/TestModeIndicator';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import { Toaster } from "@/components/ui/toaster"
import './App.css';

const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const Services = React.lazy(() => import('./pages/Services'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Vacancies = React.lazy(() => import('./pages/Vacancies'));
const VacancyDetails = React.lazy(() => import('./pages/VacancyDetails'));
const News = React.lazy(() => import('./pages/News'));
const NewsDetails = React.lazy(() => import('./pages/NewsDetails'));
const Tenders = React.lazy(() => import('./pages/Tenders'));
const TenderDetails = React.lazy(() => import('./pages/TenderDetails'));
const CommercialOffers = React.lazy(() => import('./pages/CommercialOffers'));
const CommercialOfferDetails = React.lazy(() => import('./pages/CommercialOfferDetails'));
const Staff = React.lazy(() => import('./pages/Staff'));
const Management = React.lazy(() => import('./pages/Management'));

const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminNews = React.lazy(() => import('./pages/admin/AdminNews'));
const AdminNewsEdit = React.lazy(() => import('./pages/admin/AdminNewsEdit'));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'));
const AdminProjectsEdit = React.lazy(() => import('./pages/admin/AdminProjectsEdit'));
const AdminTimelineEvents = React.lazy(() => import('./pages/admin/AdminTimelineEvents'));
const AdminTimelineEventsEdit = React.lazy(() => import('./pages/admin/AdminTimelineEventsEdit'));
const AdminVacancies = React.lazy(() => import('./pages/admin/AdminVacancies'));
const AdminVacanciesEdit = React.lazy(() => import('./pages/admin/AdminVacanciesEdit'));
const AdminVacancyApplications = React.lazy(() => import('./pages/admin/AdminVacancyApplications'));
const AdminMessages = React.lazy(() => import('./pages/admin/AdminMessages'));
const AdminPartners = React.lazy(() => import('./pages/admin/AdminPartners'));
const AdminPartnersEdit = React.lazy(() => import('./pages/admin/AdminPartnersEdit'));
const AdminStaff = React.lazy(() => import('./pages/admin/AdminStaff'));
const AdminStaffEdit = React.lazy(() => import('./pages/admin/AdminStaffEdit'));
const AdminDepartments = React.lazy(() => import('./pages/admin/AdminDepartments'));
const AdminDepartmentsEdit = React.lazy(() => import('./pages/admin/AdminDepartmentsEdit'));
const AdminFutureProjects = React.lazy(() => import('./pages/admin/AdminFutureProjects'));
const AdminFutureProjectsEdit = React.lazy(() => import('./pages/admin/AdminFutureProjectsEdit'));
const AdminTenders = React.lazy(() => import('./pages/admin/AdminTenders'));
const AdminTendersEdit = React.lazy(() => import('./pages/admin/AdminTendersEdit'));
const AdminTenderSubmissions = React.lazy(() => import('./pages/admin/AdminTenderSubmissions'));
const AdminCommercialOffers = React.lazy(() => import('./pages/admin/AdminCommercialOffers'));
const AdminCommercialOffersEdit = React.lazy(() => import('./pages/admin/AdminCommercialOffersEdit'));
const AdminFloorPrices = React.lazy(() => import('./pages/admin/AdminFloorPrices'));
const AdminFloorPricesEdit = React.lazy(() => import('./pages/admin/AdminFloorPricesEdit'));
const AdminAuditLogs = React.lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminDetailedAuditLogs = React.lazy(() => import('./pages/admin/AdminDetailedAuditLogs'));
const AdminCompanyStats = React.lazy(() => import('./pages/admin/AdminCompanyStats'));
const AdminApartmentUnits = React.lazy(() => import('./pages/admin/AdminApartmentUnits'));
const AdminYangiUzbekistanApartmentUnits = React.lazy(() => import('./pages/admin/AdminYangiUzbekistanApartmentUnits'));

import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLoadingScreen from './components/admin/AdminLoadingScreen';

function App() {
  const testMode = process.env.REACT_APP_TEST_MODE === 'true';
  
  return (
    <React.Fragment>
      {testMode && <TestModeIndicator />}
      
      <Routes>
        <Route path="/" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Home />
          </React.Suspense>
        } />
        <Route path="/about" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <About />
          </React.Suspense>
        } />
        <Route path="/projects" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Projects />
          </React.Suspense>
        } />
        <Route path="/projects/:slug" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <ProjectDetails />
          </React.Suspense>
        } />
        <Route path="/services" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Services />
          </React.Suspense>
        } />
        <Route path="/contact" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Contact />
          </React.Suspense>
        } />
        <Route path="/vacancies" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Vacancies />
          </React.Suspense>
        } />
        <Route path="/vacancies/:slug" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <VacancyDetails />
          </React.Suspense>
        } />
        <Route path="/news" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <News />
          </React.Suspense>
        } />
        <Route path="/news/:slug" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <NewsDetails />
          </React.Suspense>
        } />
         <Route path="/tenders" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Tenders />
          </React.Suspense>
        } />
        <Route path="/tenders/:slug" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <TenderDetails />
          </React.Suspense>
        } />
        <Route path="/commercial-offers" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <CommercialOffers />
          </React.Suspense>
        } />
        <Route path="/commercial-offers/:slug" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <CommercialOfferDetails />
          </React.Suspense>
        } />
        <Route path="/staff" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Staff />
          </React.Suspense>
        } />
        <Route path="/management" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <Management />
          </React.Suspense>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminDashboard />
            </React.Suspense>
          } />
          <Route path="/admin/news" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminNews />
            </React.Suspense>
          } />
          <Route path="/admin/news/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminNewsEdit />
            </React.Suspense>
          } />
          <Route path="/admin/news/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminNewsEdit />
            </React.Suspense>
          } />
          <Route path="/admin/projects" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminProjects />
            </React.Suspense>
          } />
           <Route path="/admin/projects/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminProjectsEdit />
            </React.Suspense>
          } />
          <Route path="/admin/projects/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminProjectsEdit />
            </React.Suspense>
          } />
          <Route path="/admin/timeline-events" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminTimelineEvents />
            </React.Suspense>
          } />
          <Route path="/admin/timeline-events/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminTimelineEventsEdit />
            </React.Suspense>
          } />
           <Route path="/admin/timeline-events/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminTimelineEventsEdit />
            </React.Suspense>
          } />
          <Route path="/admin/vacancies" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminVacancies />
            </React.Suspense>
          } />
          <Route path="/admin/vacancies/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminVacanciesEdit />
            </React.Suspense>
          } />
           <Route path="/admin/vacancies/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminVacanciesEdit />
            </React.Suspense>
          } />
          <Route path="/admin/vacancy-applications" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminVacancyApplications />
            </React.Suspense>
          } />
          <Route path="/admin/messages" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminMessages />
            </React.Suspense>
          } />
          <Route path="/admin/partners" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminPartners />
            </React.Suspense>
          } />
          <Route path="/admin/partners/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminPartnersEdit />
            </React.Suspense>
          } />
          <Route path="/admin/partners/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminPartnersEdit />
            </React.Suspense>
          } />
          <Route path="/admin/staff" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminStaff />
            </React.Suspense>
          } />
          <Route path="/admin/staff/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminStaffEdit />
            </React.Suspense>
          } />
          <Route path="/admin/staff/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminStaffEdit />
            </React.Suspense>
          } />
          <Route path="/admin/departments" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminDepartments />
            </React.Suspense>
          } />
          <Route path="/admin/departments/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminDepartmentsEdit />
            </React.Suspense>
          } />
          <Route path="/admin/departments/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminDepartmentsEdit />
            </React.Suspense>
          } />
          <Route path="/admin/future-projects" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminFutureProjects />
            </React.Suspense>
          } />
          <Route path="/admin/future-projects/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminFutureProjectsEdit />
            </React.Suspense>
          } />
          <Route path="/admin/future-projects/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminFutureProjectsEdit />
            </React.Suspense>
          } />
          <Route path="/admin/tenders" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminTenders />
            </React.Suspense>
          } />
          <Route path="/admin/tenders/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminTendersEdit />
            </React.Suspense>
          } />
          <Route path="/admin/tenders/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminTendersEdit />
            </React.Suspense>
          } />
          <Route path="/admin/tender-submissions" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminTenderSubmissions />
            </React.Suspense>
          } />
          <Route path="/admin/commercial-offers" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminCommercialOffers />
            </React.Suspense>
          } />
           <Route path="/admin/commercial-offers/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminCommercialOffersEdit />
            </React.Suspense>
          } />
          <Route path="/admin/commercial-offers/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminCommercialOffersEdit />
            </React.Suspense>
          } />
          <Route path="/admin/floor-prices" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminFloorPrices />
            </React.Suspense>
          } />
          <Route path="/admin/floor-prices/edit/:id" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminFloorPricesEdit />
            </React.Suspense>
          } />
          <Route path="/admin/floor-prices/create" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminFloorPricesEdit />
            </React.Suspense>
          } />
          
          <Route path="/admin/apartment-units" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminApartmentUnits />
            </React.Suspense>
          } />
          
          <Route path="/admin/yangi-uzbekistan-apartment-units" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminYangiUzbekistanApartmentUnits />
            </React.Suspense>
          } />
          
          <Route path="/admin/audit-logs" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminAuditLogs />
            </React.Suspense>
          } />
           <Route path="/admin/detailed-audit-logs" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminDetailedAuditLogs />
            </React.Suspense>
          } />
          <Route path="/admin/company-stats" element={
            <React.Suspense fallback={<AdminLoadingScreen />}>
              <AdminCompanyStats />
            </React.Suspense>
          } />
        </Route>
        
        <Route path="*" element={
          <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
            <div>Страница не найдена</div>
          </React.Suspense>
        } />
      </Routes>
      
      <Toaster />
    </React.Fragment>
  );
}

export default App;
