import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminSidebar from './AdminSidebar';
import { Loader2, Menu } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, isLoading } = useAdmin();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !admin) {
      navigate('/admin');
    }
  }, [admin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 relative">
      <button
        className="absolute top-3 left-3 z-50 md:hidden p-2 rounded-full bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Открыть меню"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
      >
        <Menu className="h-7 w-7" />
      </button>
      <AdminSidebar 
        mobileOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />
      <main className="flex-1 overflow-auto p-4 md:p-6 pt-16 md:pt-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
