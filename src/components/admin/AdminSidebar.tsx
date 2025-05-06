import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import {
  LayoutDashboard,
  FileText,
  BriefcaseBusiness,
  MessageSquare,
  UsersRound,
  History,
  LogOut,
  X,
  ChevronRight,
  Building2,
  Receipt,
  Inbox,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast'; // Assuming hook exists

interface AdminSidebarProps {
  mobileOpen: boolean; // State for mobile sidebar (Sheet)
  onClose: () => void; // Handler to close mobile sidebar
  collapsed: boolean; // State for desktop sidebar collapse
}

// Define the explicit widths for the sidebar (matching Layout)
const SIDEBAR_WIDTH_FULL = 'w-64'; // Tailwind class for full width
const SIDEBAR_WIDTH_COLLAPSED = 'md:w-20'; // Tailwind class for collapsed width on md+

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onClose, collapsed }) => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast(); // Assuming hook exists

  // Effect to close mobile sidebar on outside click (Keep as is)
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [mobileOpen, onClose]);


  // Logout handler (Keep as is)
  const handleLogout = () => {
    logout();
    navigate('/admin');

    toast({
      title: "Выход выполнен", // Keep hardcoded or translate
      description: "Вы успешно вышли из системы" // Keep hardcoded or translate
    });
  };

  // Navigation items with new item for commercial offers
  const navItems = [
    { name: "Дашборд", path: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Новости", path: "/admin/news", icon: <FileText className="h-5 w-5" /> },
    { name: "Вакансии", path: "/admin/vacancies", icon: <BriefcaseBusiness className="h-5 w-5" /> },
    { name: "Сообщения", path: "/admin/messages", icon: <MessageSquare className="h-5 w-5" /> },
    { name: "Партнеры", path: "/admin/partners", icon: <UsersRound className="h-5 w-5" /> },
    { name: "Тендеры", path: "/admin/tenders", icon: <Receipt className="h-5 w-5" /> },
    { name: "Заявки на тендеры", path: "/admin/tender-submissions", icon: <Inbox className="h-5 w-5" /> },
    { name: "Коммерческие предложения", path: "/admin/commercial-offers", icon: <Mail className="h-5 w-5" /> },
    { name: "Цены на квартиры", path: "/admin/floor-prices", icon: <Building2 className="h-5 w-5" /> },
    { name: "Аудит", path: "/admin/audit-logs", icon: <History className="h-5 w-5" /> }
  ];

  // --- Render ---
  return (
    <>
      {/* Mobile overlay (Keep as is) */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar - Apply collapse/expand styles */}
      <div
        ref={sidebarRef} // Assign ref for outside click detection
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col",
          // Apply widths based on collapsed state on medium screens and above
          collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_FULL,
          // Mobile state (translate in/out)
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        aria-expanded={!collapsed} // Accessibility attribute
      >
        {/* Sidebar Header (Admin Title and Close Button) - Adjust visibility based on collapsed state */}
        <div className="flex items-center justify-between p-4">
          <h2 className={cn(
            "text-xl font-bold transition-opacity duration-200",
            collapsed && "md:opacity-0 md:w-0 md:overflow-hidden" // Hide text on collapse
          )}>
            Админ {/* Keep hardcoded or translate */}
          </h2>
          {/* Mobile close button (Only visible on mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
            aria-label="Закрыть меню" // Accessibility label
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Separator className="bg-slate-800" />

        {/* User info (Only visible when not collapsed on desktop) - Adjust visibility */}
        {admin && (
          <div className={cn(
            "p-4 transition-opacity duration-200",
            collapsed && "md:opacity-0 md:h-0 md:overflow-hidden md:p-0" // Hide and collapse space on collapse
          )}>
            <div className="flex items-center space-x-2">
              {/* User Avatar/Initial */}
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                {/* Ensure admin.email exists before accessing index 0 */}
                {admin.email ? admin.email[0].toUpperCase() : '?'}
              </div>
              {/* User Name and Email (Hide on collapse) */}
              <div className={cn(
                "overflow-hidden flex-grow transition-opacity duration-200",
                collapsed && "md:opacity-0 md:w-0 md:hidden" // Hide text on collapse
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
                    collapsed && "md:justify-center" // Center items when collapsed
                  )}
                  onClick={() => mobileOpen && onClose()} // Close mobile menu on click
                  title={collapsed ? item.name : undefined} // Show tooltip on collapse
                >
                  <div className="flex items-center min-w-0">
                    {/* Icon - Always visible */}
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    {/* Nav Item Name - Hide on collapse */}
                    <span className={cn(
                      "ml-3 truncate transition-all duration-200",
                      collapsed && "md:opacity-0 md:w-0 md:hidden" // Hide text on collapse
                    )}>
                      {item.name} {/* Keep hardcoded or translate */}
                    </span>
                  </div>
                  {/* Right Arrow Icon - Hide on collapse */}
                  <ChevronRight className={cn(
                    "h-4 w-4 flex-shrink-0 transition-opacity",
                    location.pathname === item.path ? "opacity-100" : "opacity-0", // Keep visibility for active state
                    collapsed && "md:hidden" // Hide arrow on collapse
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
            title={collapsed ? 'Выйти' : undefined} // Tooltip on collapse
          >
            <LogOut className="h-4 w-4" /> {/* Logout icon */}
            {/* Button text - Hide on collapse */}
            <span className={cn(
              "ml-2",
              collapsed && "md:hidden" // Hide text on collapse
            )}>
              Выйти {/* Keep hardcoded or translate */}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
