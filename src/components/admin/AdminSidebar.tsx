
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
  Users
} from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';

const AdminSidebar: React.FC = () => {
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
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-slate-800 text-white border-r border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <div className="text-lg font-bold text-primary">TOWER UP Админ</div>
      </div>
      
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="bg-slate-700 p-2 rounded-full">
            <User className="h-5 w-5 text-slate-300" />
          </div>
          <div>
            <div className="text-sm font-medium">{admin?.name}</div>
            <div className="text-xs text-slate-400">{admin?.email}</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
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

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-slate-300 hover:text-white w-full px-3 py-2 rounded-md hover:bg-slate-700 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
