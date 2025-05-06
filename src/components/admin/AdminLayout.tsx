
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminSidebar from './AdminSidebar';
import { Loader2, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, isLoading, logout } = useAdmin();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !admin) {
      navigate('/admin');
    }
  }, [admin, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "default",
    });
    navigate('/admin');
  };

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
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">
      <AdminSidebar 
        mobileOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-10 p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="p-2 md:hidden rounded-full bg-slate-700 text-white hover:bg-slate-600 transition"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="ml-4 md:ml-0">
              <span className="font-semibold text-lg">Admin Panel</span>
              <span className="text-xs text-slate-400 block">{admin.email}</span>
            </div>
          </div>
          
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
