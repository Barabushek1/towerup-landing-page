
import { Suspense, lazy } from 'react'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import ScrollToTop from "./components/ScrollToTop"
import { LanguageProvider } from "./contexts/LanguageContext"
import TestModeIndicator from "./components/TestModeIndicator"
import { AdminProvider } from "./contexts/AdminContext"
import { AdminDataProvider } from "./contexts/AdminDataContext"
import { Helmet, HelmetProvider } from 'react-helmet-async'

// Lazy load components for better performance
const About = lazy(() => import("./pages/About"))
const Management = lazy(() => import("./pages/Management"))
const Projects = lazy(() => import("./pages/Projects"))
const FutureProjects = lazy(() => import("./pages/FutureProjects"))
const FutureProjectDetail = lazy(() => import("./pages/FutureProjectDetail"))
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"))
const TrcBochka = lazy(() => import("./pages/TrcBochka"))
const BankingTechnology = lazy(() => import("./pages/BankingTechnology"))
const NewUzbekistan = lazy(() => import("./pages/NewUzbekistan"))
const News = lazy(() => import("./pages/News"))
const NewsDetail = lazy(() => import("./pages/NewsDetail"))
const Vacancies = lazy(() => import("./pages/Vacancies"))
const VacancyDetail = lazy(() => import("./pages/VacancyDetail"))
const Partners = lazy(() => import("./pages/Partners"))
const Contact = lazy(() => import("./pages/Contact"))
const Construction = lazy(() => import("./pages/Construction"))
const Design = lazy(() => import("./pages/Design"))
const Solutions = lazy(() => import("./pages/Solutions"))
const Collaboration = lazy(() => import("./pages/Collaboration"))
const CollaborationOffers = lazy(() => import("./pages/CollaborationOffers"))
const TenderDetail = lazy(() => import("./pages/TenderDetail"))
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"))
const History = lazy(() => import("./pages/History"))
const NotFound = lazy(() => import("./pages/NotFound"))

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"))
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"))
const AdminNews = lazy(() => import("./pages/admin/AdminNews"))
const AdminVacancies = lazy(() => import("./pages/admin/AdminVacancies"))
const AdminVacancyApplications = lazy(() => import("./pages/admin/AdminVacancyApplications"))
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"))
const AdminFutureProjects = lazy(() => import("./pages/admin/AdminFutureProjects"))
const AdminPartners = lazy(() => import("./pages/admin/AdminPartners"))
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"))
const AdminStaff = lazy(() => import("./pages/admin/AdminStaff"))
const AdminDepartments = lazy(() => import("./pages/admin/AdminDepartments"))
const AdminTimelineEvents = lazy(() => import("./pages/admin/AdminTimelineEvents"))
const AdminTenders = lazy(() => import("./pages/admin/AdminTenders"))
const AdminTenderSubmissions = lazy(() => import("./pages/admin/AdminTenderSubmissions"))
const AdminCommercialOffers = lazy(() => import("./pages/admin/AdminCommercialOffers"))
const AdminCompanyStats = lazy(() => import("./pages/admin/AdminCompanyStats"))
const AdminYangiUzbekistanApartments = lazy(() => import("./pages/admin/AdminYangiUzbekistanApartments"))
const AdminYangiUzbekistanFloorPlans = lazy(() => import("./pages/admin/AdminYangiUzbekistanFloorPlans"))
const AdminYangiUzbekistanPrices = lazy(() => import("./pages/admin/AdminYangiUzbekistanPrices"))
const AdminFloorPrices = lazy(() => import("./pages/admin/AdminFloorPrices"))
const AdminFloorApartmentPrices = lazy(() => import("./pages/admin/AdminFloorApartmentPrices"))
const AdminApartmentUnits = lazy(() => import("./pages/admin/AdminApartmentUnits"))
const AdminAuditLogs = lazy(() => import("./pages/admin/AdminAuditLogs"))
const AdminDetailedAuditLogs = lazy(() => import("./pages/admin/AdminDetailedAuditLogs"))

const queryClient = new QueryClient()

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AdminProvider>
          <AdminDataProvider>
            <TooltipProvider>
              <LanguageProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <TestModeIndicator />
                  <Helmet>
                    <title>TOWER UP - Премиум недвижимость в Ташкенте</title>
                    <meta name="description" content="TOWER UP - ведущая строительная компания в Ташкенте. Современные жилые комплексы премиум-класса с развитой инфраструктурой." />
                    <meta name="keywords" content="TOWER UP, строительство, недвижимость, Ташкент, жилые комплексы, премиум класс" />
                    <meta property="og:title" content="TOWER UP - Премиум недвижимость в Ташкенте" />
                    <meta property="og:description" content="TOWER UP - ведущая строительная компания в Ташкенте. Современные жилые комплексы премиум-класса с развитой инфраструктурой." />
                    <meta property="og:type" content="website" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <link rel="canonical" href="https://towerup.uz" />
                  </Helmet>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/management" element={<Management />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/future" element={<FutureProjects />} />
                      <Route path="/projects/future/:id" element={<FutureProjectDetail />} />
                      <Route path="/projects/:id" element={<ProjectDetail />} />
                      <Route path="/projects/trc-bochka" element={<TrcBochka />} />
                      <Route path="/projects/banking-technology" element={<BankingTechnology />} />
                      <Route path="/projects/new-uzbekistan" element={<NewUzbekistan />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/news/:id" element={<NewsDetail />} />
                      <Route path="/vacancies" element={<Vacancies />} />
                      <Route path="/vacancies/:id" element={<VacancyDetail />} />
                      <Route path="/partners" element={<Partners />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/services/construction" element={<Construction />} />
                      <Route path="/services/design" element={<Design />} />
                      <Route path="/services/solutions" element={<Solutions />} />
                      <Route path="/collaboration" element={<Collaboration />} />
                      <Route path="/collaboration/offers" element={<CollaborationOffers />} />
                      <Route path="/collaboration/tenders" element={<TenderDetail />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/history" element={<History />} />
                      
                      {/* Admin routes */}
                      <Route path="/admin" element={<AdminLogin />} />
                      <Route path="/admin/dashboard" element={<AdminDashboard />} />
                      <Route path="/admin/news" element={<AdminNews />} />
                      <Route path="/admin/vacancies" element={<AdminVacancies />} />
                      <Route path="/admin/vacancy-applications" element={<AdminVacancyApplications />} />
                      <Route path="/admin/projects" element={<AdminProjects />} />
                      <Route path="/admin/future-projects" element={<AdminFutureProjects />} />
                      <Route path="/admin/partners" element={<AdminPartners />} />
                      <Route path="/admin/messages" element={<AdminMessages />} />
                      <Route path="/admin/staff" element={<AdminStaff />} />
                      <Route path="/admin/departments" element={<AdminDepartments />} />
                      <Route path="/admin/timeline" element={<AdminTimelineEvents />} />
                      <Route path="/admin/tenders" element={<AdminTenders />} />
                      <Route path="/admin/tender-submissions" element={<AdminTenderSubmissions />} />
                      <Route path="/admin/commercial-offers" element={<AdminCommercialOffers />} />
                      <Route path="/admin/company-stats" element={<AdminCompanyStats />} />
                      <Route path="/admin/yangi-uzbekistan-apartments" element={<AdminYangiUzbekistanApartments />} />
                      <Route path="/admin/yangi-uzbekistan-floor-plans" element={<AdminYangiUzbekistanFloorPlans />} />
                      <Route path="/admin/yangi-uzbekistan-prices" element={<AdminYangiUzbekistanPrices />} />
                      <Route path="/admin/floor-prices" element={<AdminFloorPrices />} />
                      <Route path="/admin/floor-apartment-prices" element={<AdminFloorApartmentPrices />} />
                      <Route path="/admin/apartment-units" element={<AdminApartmentUnits />} />
                      <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
                      <Route path="/admin/detailed-audit-logs" element={<AdminDetailedAuditLogs />} />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </LanguageProvider>
            </TooltipProvider>
          </AdminDataProvider>
        </AdminProvider>
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
