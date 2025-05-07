import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import AdminSidebar from './AdminSidebar'; // Ensure path is correct
import { Loader2, Menu, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion'; // Added missing import

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Define the explicit widths for the sidebar (matching Sidebar component)
const SIDEBAR_WIDTH_FULL_CLASS = 'w-64'; // Tailwind class for full width
const SIDEBAR_WIDTH_COLLAPSED_CLASS = 'md:w-20'; // Tailwind class for collapsed width on md+
const SIDEBAR_WIDTH_FULL_PX = 256; // Corresponding pixel value for 'w-64' (256px)
const SIDEBAR_WIDTH_COLLAPSED_PX = 80; // Corresponding pixel value for 'md:w-20' (80px)

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { admin, isLoading, logout } = useAdmin();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // State for mobile sidebar (Sheet)
  // State for desktop sidebar collapse - Initialize based on screen size if needed, default to false (expanded)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Default to expanded on desktop

  // Optional: Add state to track if we are on a medium/large screen for desktop collapse logic
  // const [isDesktop, setIsDesktop] = useState(false); // Requires a hook like useMediaQuery

  const { toast } = useToast(); // Assuming hook exists

  // Authentication check effect (Keep as is)
  useEffect(() => {
    if (!isLoading && !admin) {
      navigate('/admin');
    }
  }, [admin, isLoading, navigate]);

  // Handle initial collapse state on desktop if needed
  // useEffect(() => {
  //    // Example using a media query check (requires a hook or manual check)
  //    const mq = window.matchMedia('(min-width: 768px)'); // md breakpoint
  //    setIsDesktop(mq.matches);
  //    // Optionally set collapsed state initially based on desktop status
  //    // if (mq.matches) { setSidebarCollapsed(true); } // Start collapsed on desktop
  //    const handler = (e: any) => setIsDesktop(e.matches);
  //    mq.addListener(handler);
  //    return () => mq.removeListener(handler);
  // }, []);

  // Logout handler (Keep as is)
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out", // Keep hardcoded or translate
      description: "You have been successfully logged out", // Keep hardcoded or translate
      variant: "default",
    });
    // Added timeout for toast visibility before navigation
    setTimeout(() => navigate('/admin'), 500); // Adjust delay as needed
  };

  // Toggle sidebar collapse state (Keep as is)
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Loading state render (Keep as is)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Not authenticated render (Keep as is)
  if (!admin) {
    return null;
  }

  // --- Main Layout Render ---
  return (
    // Main layout container - flex row
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden">

      {/* Sidebar - Rendered by AdminSidebar component */}
      {/* Pass the collapsed state and mobile state */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen} // Passed for mobile Sheet logic
        onClose={() => setMobileSidebarOpen(false)} // Passed for mobile Sheet close
        collapsed={sidebarCollapsed} // Pass the collapse state for desktop view
        // AdminSidebar component is responsible for its own fixed positioning and width classes
        // The sidebar *should* render its own fixed positioning and width logic based on collapsed/mobileOpen
      />

      {/* Main Content Area - Adjust margin and add transition to make space for sidebar */}
      {/* Use explicit pixel values or matching Tailwind margin classes */}
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out", // Add transition
        // Apply margin-left based on the sidebar's collapsed state on medium screens and above
        // Use pixel values that match the Tailwind widths applied in AdminSidebar
        // This pushes the main content area over to make space for the fixed sidebar
        sidebarCollapsed ? `md:ml-[${SIDEBAR_WIDTH_COLLAPSED_PX}px]` : `md:ml-[${SIDEBAR_WIDTH_FULL_PX}px]`,
        // On mobile, when the sidebar is an overlay, there is no persistent margin
        "ml-0" // Ensure ml-0 on mobile
      )}>
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          {/* Left side - Menu button & title */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button (Only visible on mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden" // Hide on medium screens and above
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu" // Accessibility label
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop Sidebar Toggle Button (Only visible on desktop) */}
            <Button
              variant="ghost" // Using ghost variant for a cleaner look in the top bar
              size="icon"
              className="hidden md:flex" // Only show on medium screens and above
              onClick={toggleSidebar} // Call toggleSidebar
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} // Tooltip text
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} // Accessible label
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>

            {/* Admin Panel Title and User Email */}
            <div>
              <span className="font-semibold text-lg">Админ панель</span> {/* Keep hardcoded or translate */}
              {admin && (
                <span className="text-xs text-slate-400 block truncate max-w-[200px]">
                  {admin.email} {/* Keep admin email display */}
                </span>
              )}
            </div>
          </div>

          {/* Right side - Logout button */}
          <Button
            variant="destructive" // Keep destructive variant
            size="sm"
            className="flex items-center whitespace-nowrap"
            onClick={handleLogout} // Keep handler
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти {/* Keep hardcoded or translate */}
          </Button>
        </div>

        {/* Main Content Area (Keep as is) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children} {/* This is where your page content is rendered */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
