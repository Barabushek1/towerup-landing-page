
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
  GanttChartSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onClose }) => {
  const { admin, setAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    try {
      // Clear session state
      setAdmin(null);
      
      // Log admin action
      await supabase
        .from('admin_audit_logs')
        .insert({
          action_type: 'logout',
          admin_email: admin?.email || '',
          details: { method: 'manual_logout' }
        });
      
      // Navigate to login page
      navigate('/admin');
      
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы"
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Ошибка выхода",
        description: "Произошла ошибка при выходе из системы",
        variant: "destructive"
      });
    }
  };

  // Navigation items
  const navItems = [
    {
      name: "Дашборд",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      name: "Новости",
      path: "/admin/news",
      icon: <FileText className="h-5 w-5" />
    },
    {
      name: "Вакансии",
      path: "/admin/vacancies",
      icon: <BriefcaseBusiness className="h-5 w-5" />
    },
    {
      name: "Сообщения",
      path: "/admin/messages",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      name: "Партнеры",
      path: "/admin/partners",
      icon: <UsersRound className="h-5 w-5" />
    },
    {
      name: "Тендеры",
      path: "/admin/tenders",
      icon: <Receipt className="h-5 w-5" />
    },
    {
      name: "Цены на квартиры",
      path: "/admin/floor-prices",
      icon: <Building2 className="h-5 w-5" />
    },
    {
      name: "Аудит",
      path: "/admin/audit-logs",
      icon: <History className="h-5 w-5" />
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" />
      )}
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 flex-col bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out flex",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">Админ панель</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Separator className="bg-slate-800" />
        
        {admin && (
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                {admin.email[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{admin.name || 'Администратор'}</p>
                <p className="text-xs text-slate-400 truncate max-w-[180px]">{admin.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <Separator className="bg-slate-800" />
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                    location.pathname === item.path 
                      ? "bg-slate-800 text-white font-medium" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  )}
                  onClick={() => mobileOpen && onClose()}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 transition-opacity",
                    location.pathname === item.path ? "opacity-100" : "opacity-0"
                  )} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4">
          <Button onClick={handleLogout} className="w-full" variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
