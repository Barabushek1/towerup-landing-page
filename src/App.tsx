
import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "./components/ui/toaster";

// Import pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetail from "./pages/ProjectDetail";
import ContactPage from "./pages/ContactPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NewUzbekistan from "./pages/NewUzbekistan";
import MassivUzbekistan from "./pages/MassivUzbekistan";
import NotFoundPage from "./pages/NotFoundPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminBlogPosts from "./pages/admin/AdminBlogPosts";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProjectEdit from "./pages/admin/AdminProjectEdit";
import AdminBlogPostEdit from "./pages/admin/AdminBlogPostEdit";

// Import providers
import { LanguageProvider } from "./contexts/LanguageContext";

// Loader component for suspense fallback
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#1A1F2C]">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <HelmetProvider>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/new-uzbekistan" element={<NewUzbekistan />} />
              <Route path="/massiv-uzbekistan" element={<MassivUzbekistan />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="projects/:id" element={<AdminProjectEdit />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="blog" element={<AdminBlogPosts />} />
                <Route path="blog/:id" element={<AdminBlogPostEdit />} />
                <Route path="login" element={<AdminLogin />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster />
      </HelmetProvider>
    </LanguageProvider>
  );
}

export default App;
