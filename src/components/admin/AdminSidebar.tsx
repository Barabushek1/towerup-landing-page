
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  MessagesSquare,
  Newspaper,
  Briefcase,
  Users,
  ClipboardList,
  Home,
  X,
  AlertTriangle,
  PencilRuler,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onClose }) => {
  const { admin } = useAdmin();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Вернуться на сайт', link: '/' },
    { icon: LayoutDashboard, label: 'Панель управления', link: '/admin/dashboard' },
    { icon: Newspaper, label: 'Новости', link: '/admin/news' },
    { icon: Briefcase, label: 'Вакансии', link: '/admin/vacancies' },
    { icon: MessagesSquare, label: 'Сообщения', link: '/admin/messages' },
    { icon: Users, label: 'Партнеры', link: '/admin/partners' },
    { icon: ClipboardList, label: 'Тендеры', link: '/admin/tenders' },
    { icon: AlertTriangle, label: 'Аудит логи', link: '/admin/audit-logs' },
    { icon: PencilRuler, label: 'Цены на квартиры', link: '/admin/floor-prices' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-slate-800 text-slate-100 z-50 transition-transform duration-300 ease-in-out",
          mobileOpen ? "transform-none" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg">Админ-панель</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 py-2">
              <h3 className="text-xs uppercase tracking-wider opacity-50 mb-2 px-2">
                Навигация
              </h3>
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.link}
                    to={item.link}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                      location.pathname === item.link
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                    onClick={item.link === '/' ? undefined : onClose}
                  >
                    <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="font-bold text-primary-foreground">
                    {admin?.email[0]?.toUpperCase() || 'A'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">{admin?.email}</div>
                <div className="text-xs opacity-50">Администратор</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
