import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext'; // Assuming context exists
import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  MessageSquare,
  UsersRound,
  History,
  LogOut,
  X, // Icon for mobile close
  ChevronRight, // Icon for nav item right arrow
  Building2, // Icon for apartments
  Receipt, // Icon for tenders
  Inbox, // Icon for tender submissions
  HandCoins, // Icon for commercial offers
  FileBadge, // Icon for vacancy applications
  Newspaper // Added missing Newspaper icon import
} from 'lucide-react'; // Ensure all necessary icons are imported
import { cn } from '@/lib/utils'; // Assuming utility exists
import { Button } from '@/components/ui/button'; // Assuming Button component exists and is styled
import { Separator } from '@/components/ui/separator'; // Assuming Separator component exists and is styled
import { useToast } from '@/hooks/use-toast'; // Assuming hook exists
import { motion } from 'framer-motion'; // Using motion for transitions

interface AdminSidebarProps {
  mobileOpen: boolean; // State for mobile sidebar (Sheet)
  onClose: () => void; // Handler to close mobile sidebar
  collapsed: boolean; // State for desktop sidebar collapse (Passed from Layout)
}

// Define the explicit widths (matching Layout)
const SIDEBAR_WIDTH_FULL_CLASS = 'w-64';
const SIDEBAR_WIDTH_COLLAPSED_CLASS = 'md:w-20';


const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onClose, collapsed }) => {
  const { admin, logout } = useAdmin(); // Keep context usage
  const navigate = useNavigate(); // Keep hook usage
  const location = useLocation(); // Keep hook usage
  const sidebarRef = useRef<HTMLDivElement>(null); // Keep ref for outside click
  const { toast } = useToast(); // Keep toast usage

  // Effect to close mobile sidebar on outside click (Keep as is)
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Only trigger when mobile menu is open and click is outside sidebar
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Only add event listener if mobile menu is open
    if (mobileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [mobileOpen, onClose]); // mobileOpen should be a dependency

  // Logout handler (Keep as is)
  const handleLogout = () => {
    logout();
    // Added timeout for toast visibility before navigation
    toast({
      title: "Выход выполнен", // Keep hardcoded or translate
      description: "Вы успешно вышли из системы", // Keep hardcoded or translate
      variant: "default",
    });
    setTimeout(() => navigate('/admin'), 500); // Adjust delay as needed
  };

  // Navigation items - Ensure all desired items are included
  // Using Russian hardcoded text as per instruction
  const navItems = [
    { name: "Дашборд", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Новости", path: "/admin/news", icon: <Newspaper className="h-5 w-5" /> }, // Using Newspaper icon
    { name: "Вакансии", path: "/admin/vacancies", icon: <BriefcaseBusiness className="h-5 w-5" /> },
    { name: "Заявки на вакансии", path: "/admin/vacancy-applications", icon: <FileBadge className="h-5 w-5" /> }, // Using FileBadge icon
    { name: "Сообщения", path: "/admin/messages", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Партнеры", path: "/admin/partners", icon: <UsersRound className="h-5 w-5" /> }, // Using UsersRound icon
    { name: "Тендеры", path: "/admin/tenders", icon: <Receipt className="h-5 w-5" /> }, // Using Receipt icon
    { name: "Заявки на тендеры", path: "/admin/tender-submissions", icon: <FileText className="h-5 w-5" /> }, // Using FileText icon for submissions? Or maybe Inbox? Let's use FileText for consistency with original code.
    { name: "Коммерческие предложения", path: "/admin/commercial-offers", icon: <HandCoins className="h-5 w-5" /> }, // Using HandCoins icon
    { name: "Цены на квартиры", path: "/admin/floor-prices", icon: <Building2 className="h-5 w-5" /> }, // Using Building2 icon
    { name: "Аудит", path: "/admin/audit-logs", icon: <History className="h-5 w-5" /> }, // Using History icon
    // Assuming "Детальные аудит логи" is separate, but wasn't in previous list
    // { name: "Детальные аудит логи", path: "/admin/detailed-audit-logs", icon: <BarChart4 className="h-5 w-5" /> }
  ];

  // --- Render ---
  return (
    <>
      {/* Mobile overlay */}
      {/* The overlay should only be active when mobileOpen is true */}
      {mobileOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
           className="fixed inset-0 bg-black/50 z-40 md:hidden"
           onClick={onClose} // Close overlay on click
        />
      )}

      {/* Sidebar - Apply collapse/expand styles */}
      <motion.div // Added motion for potential transitions if needed
        ref={sidebarRef} // Assign ref for mobile outside click
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col",
          // Apply widths based on collapsed state on medium screens and above
          // Note: AdminLayout uses md:w-20 and w-64, matching these
          collapsed ? SIDEBAR_WIDTH_COLLAPSED_CLASS : SIDEBAR_WIDTH_FULL_CLASS,
          // Mobile state (translate in/out based on mobileOpen)
          // This handles the Sheet-like behavior on small screens
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // On medium screens and above, the sidebar is *always* translated to 0,
          // its visibility/position is controlled by its width and the main content's margin
          "md:translate-x-0"
        )}
        aria-expanded={!collapsed} // Accessibility attribute
      >
        {/* Sidebar Header (Admin Title and Close Button) - Adjust visibility based on collapsed state */}
        <div className="flex items-center justify-between p-4">
          <h2 className={cn(
            "text-xl font-bold transition-opacity duration-200",
            // Hide text on collapse on desktop (md+)
            collapsed && "md:opacity-0 md:w-0 md:overflow-hidden"
          )}>
            Админ {/* Keep hardcoded or translate */}
          </h2>
          {/* Mobile close button (Only visible on mobile, uses ghost variant as in AdminLayout) */}
          {/* Removed this close button as it seems redundant with the overlay click */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
            aria-label="Закрыть меню"
          >
            <X className="h-5 w-5" />
          </Button> */}
        </div>

        <Separator className="bg-slate-800" />

        {/* User info (Only visible when not collapsed on desktop) - Adjust visibility */}
        {admin && (
          <div className={cn(
            "p-4 transition-opacity duration-200 overflow-hidden", // Added overflow-hidden
            collapsed && "md:opacity-0 md:h-0 md:p-0" // Hide and collapse space on collapse
          )}>
            <div className="flex items-center space-x-2">
              {/* User Avatar/Initial */}
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                {/* Ensure admin.email exists before accessing index 0 */}
                {admin.email ? admin.email[0].toUpperCase() : '?'}
              </div>
              {/* User Name and Email (Hide on collapse) */}
              {/* Only render this div if not collapsed on desktop */}
              <div className={cn(
                "overflow-hidden flex-grow transition-opacity duration-200",
                 collapsed && "md:opacity-0 md:h-0 md:w-0 md:hidden" // Hide text on collapse, collapse space
              )}>
                <p className="text-sm font-medium truncate">{admin.name || 'Администратор'}</p> {/* Keep hardcoded or translate */}
                <p className="text-xs text-slate-400 truncate">{admin.email}</p>
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-slate-800" />

        {/* Navigation (Keep structure, adjust visibility) */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                    location.pathname === item.path
                      ? "bg-slate-800 text-white font-medium" // Active state style
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50", // Default/Hover style
                    collapsed && "md:justify-center md:w-16 md:mx-auto" // Center items and constrain width when collapsed
                  )}
                  // Close mobile menu on click (only applies if mobileOpen is true)
                  onClick={() => mobileOpen && onClose()}
                  // Show tooltip on collapse on desktop (md+)
                  title={collapsed && !mobileOpen ? item.name : undefined}
                >
                  <div className="flex items-center min-w-0 flex-grow"> {/* Allow inner div to grow */}
                    {/* Icon - Always visible */}
                    <div className="flex-shrink-0">{item.icon}</div>
                    {/* Nav Item Name - Hide on collapse */}
                    <span className={cn(
                      "ml-3 truncate transition-opacity duration-200",
                      collapsed && "md:opacity-0 md:w-0 md:hidden" // Hide text on collapse
                    )}>
                      {item.name} {/* Keep hardcoded or translate */}
                    </span>
                  </div>
                  {/* Right Arrow Icon - Hide on collapse on desktop (md+) and on mobile view */}
                  <ChevronRight className={cn(
                    "h-4 w-4 flex-shrink-0 transition-opacity",
                    location.pathname === item.path ? "opacity-100" : "opacity-0", // Keep visibility for active state
                    collapsed && "md:hidden", // Hide arrow on collapse on desktop
                    mobileOpen && "md:hidden" // Also hide arrow in mobile view (Sheet is wide enough)
                  )} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button (Keep structure, adjust visibility/size) */}
        <div className={cn("p-4", collapsed && "md:p-2")}> {/* Adjust padding */}
          <Button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center justify-center", // Default button style
              collapsed && "md:p-2 md:h-10 md:w-auto" // Adjust size and padding on collapse
            )}
            variant="destructive" // Keep destructive variant
            // Show tooltip on collapse on desktop (md+)
            title={collapsed && !mobileOpen ? 'Выйти' : undefined}
          >
            <LogOut className="h-4 w-4" /> {/* Logout icon */}
            {/* Button text - Hide on collapse on desktop (md+) */}
            <span className={cn(
              "ml-2",
              collapsed && "md:hidden" // Hide text on collapse
            )}>
              Выйти {/* Keep hardcoded or translate */}
            </span>
          </Button>
        </div>
      </motion.div> {/* End motion.div for Sidebar */}
    </>
  );
};

export default AdminSidebar;
