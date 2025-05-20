import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminSidebar from './AdminSidebar'; // Ensure path is correct
import { Loader2, Menu, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast'; // Assuming hook exists
import { cn } from '@/lib/utils'; // Assuming utility exists

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Define the explicit widths for the sidebar
const SIDEBAR_WIDTH_FULL = 'w-64'; // Tailwind class for full width
const SIDEBAR_WIDTH_COLLAPSED = 'md:w-20'; // Tailwind class for collapsed width on md+

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children
}) => {
  const {
    admin,
    isLoading,
    logout
  } = useAdmin();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // State for mobile sidebar (Sheet)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // State for desktop sidebar collapse
  const {
    toast
  } = useToast();

  // Authentication check effect (Keep as is)
  useEffect(() => {
    if (!isLoading && !admin) {
      navigate('/admin');
    }
  }, [admin, isLoading, navigate]);

  // Logout handler (Keep as is)
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      // Assuming these are hardcoded strings or translated elsewhere
      description: "You have been successfully logged out",
      variant: "default"
    });
    navigate('/admin');
  };

  // Toggle sidebar collapse state (Keep as is)
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Loading state render (Keep as is)
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-slate-900">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>;
  }

  // Not authenticated render (Keep as is)
  if (!admin) {
    return null;
  }

  // --- Main Layout Render ---
  return (
    // Main layout container - flex row
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">

      {/* Sidebar - fixed sidebar */}
      <div className={cn(
        "fixed top-0 bottom-0 left-0 z-20 h-full bg-slate-900",
        sidebarCollapsed ? "md:w-20" : "md:w-64",
        "w-64 transform transition-all duration-300 ease-in-out",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <AdminSidebar />
      </div>

      {/* Main Content Area - Adjust positioning and add transition */}
      <div className={cn("flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
      // Add transition
      // Apply margin-left based on the sidebar's collapsed state on medium screens and above
      // The margin should match the sidebar's width
      sidebarCollapsed ? "md:ml-20" : "md:ml-64",
      // For mobile, there's no persistent sidebar, so no margin needed
      "ml-0" // Ensure ml-0 on mobile
      )}>
        {/* Top Navigation Bar (Keep as is) */}
        <div className="sticky top-0 z-10 p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          {/* Left side - Menu button & title */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>

            {/* Desktop Sidebar Toggle Button */}
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleSidebar}>
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
              <span className="sr-only">
                {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </span>
            </Button>

            {/* Admin Panel Title and User Email */}
            <div>
              <span className="font-semibold text-lg">Admin Panel</span> {/* Keep hardcoded or translate */}
              {admin && <span className="text-xs text-slate-400 block truncate max-w-[200px]">
                  {admin.email} {/* Keep admin email display */}
                </span>}
            </div>
          </div>

          {/* Right side - Logout button */}
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-300 hover:text-white">
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span> {/* Keep hardcoded or translate */}
          </Button>
        </div>

        {/* Main Content Area (Keep as is) */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children} {/* This is where your page content is rendered */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
