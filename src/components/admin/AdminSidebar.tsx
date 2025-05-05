
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  LogOut, 
  User,
  Users,
  Shield,
  FileSearch,
  Menu,
  Settings // Using allowed icon: settings
} from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onClose }) => {
  const { admin, logout } = useAdmin();
  const location = useLocation();
  const { messages } = useAdminData();
  
  const unreadMessages = messages.filter(msg => !msg.read).length;

  const navItems = [
    {
      name: 'Дашборд',
      href: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      badge: null,
    },
    {
      name: 'Новости',
      href: '/admin/news',
      icon: <FileText className="h-5 w-5" />,
      badge: null,
    },
    {
      name: 'Вакансии',
      href: '/admin/vacancies',
      icon: <Briefcase className="h-5 w-5" />,
      badge: null,
    },
    {
      name: 'Партнеры',
      href: '/admin/partners',
      icon: <Users className="h-5 w-5" />,
      badge: null,
    },
    {
      name: 'Сообщения',
      href: '/admin/messages',
      icon: <MessageSquare className="h-5 w-5" />,
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    {
      name: 'Цены планировок',
      href: '/admin/floor-prices',
      icon: <Settings className="h-5 w-5" />,
      badge: null,
    },
    {
      name: 'Журнал действий',
      href: '/admin/audit-logs',
      icon: <Shield className="h-5 w-5" />,
      badge: null,
    },
    {
      name: 'Системный журнал',
      href: '/admin/detailed-audit-logs',
      icon: <FileSearch className="h-5 w-5" />,
      badge: null,
    }
  ];

  const handleLogout = () => {
    logout();
  };

  // Add overlay for mobile menu when open
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed md:static left-0 top-0 z-50 md:z-auto h-full w-64 bg-slate-800 text-white border-r border-slate-700 flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
        tabIndex={-1}
      >
        {/* Mobile - close button */}
        <div className="flex md:hidden justify-end p-2">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700 focus:outline-none"
            aria-label="Закрыть меню"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar header */}
        <div className="p-4 border-b border-slate-700 hidden md:block">
          <div className="text-lg font-bold text-primary">TOWER UP Админ</div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-slate-700 hidden md:flex items-center gap-3">
          <div className="bg-slate-700 p-2 rounded-full">
            <User className="h-5 w-5 text-slate-300" />
          </div>
          <div>
            <div className="text-sm font-medium">{admin?.name}</div>
            <div className="text-xs text-slate-400">{admin?.email}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-300 hover:text-white hover:bg-slate-700"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button, always visible at the bottom */}
        <div className="p-4 border-t border-slate-700 mb-14 md:mb-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-slate-300 hover:text-white w-full px-3 py-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Выйти</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
