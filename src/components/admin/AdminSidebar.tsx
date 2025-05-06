
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
  Inbox
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, onClose, collapsed }) => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handleLogout = () => {
    logout();
    navigate('/admin');
    
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы"
    });
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
      name: "Заявки на тендеры",
      path: "/admin/tender-submissions",
      icon: <Inbox className="h-5 w-5" />
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
          "fixed top-0 bottom-0 left-0 z-50 bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col",
          collapsed ? "md:w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        aria-expanded={!collapsed}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className={cn(
            "text-xl font-bold transition-opacity duration-200",
            collapsed && "md:opacity-0"
          )}>
            Админ
          </h2>
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
          <div className={cn(
            "p-4 transition-opacity duration-200",
            collapsed && "md:opacity-0 md:h-16"
          )}>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                {admin.email && admin.email[0].toUpperCase()}
              </div>
              <div className={cn(
                "overflow-hidden transition-opacity duration-200", 
                collapsed && "md:opacity-0"
              )}>
                <p className="text-sm font-medium truncate">{admin.name || 'Администратор'}</p>
                <p className="text-xs text-slate-400 truncate">{admin.email}</p>
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
                  title={collapsed ? item.name : undefined}
                >
                  <div className="flex items-center min-w-0">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className={cn(
                      "ml-3 truncate transition-all duration-200",
                      collapsed && "md:opacity-0 md:w-0 md:hidden"
                    )}>
                      {item.name}
                    </span>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 flex-shrink-0 transition-opacity",
                    location.pathname === item.path ? "opacity-100" : "opacity-0",
                    collapsed && "md:hidden"
                  )} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={cn("p-4", collapsed && "md:p-2")}>
          <Button 
            onClick={handleLogout} 
            className={cn(
              "w-full flex items-center justify-center",
              collapsed && "md:p-2 md:h-10 md:w-auto"
            )} 
            variant="destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className={cn(
              "ml-2",
              collapsed && "md:hidden"
            )}>
              Выйти
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
