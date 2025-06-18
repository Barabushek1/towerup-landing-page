
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Home, Layers, MessageSquare, Users, FileCode, BriefcaseBusiness, Newspaper, Users2, PanelLeftClose, HandCoins, FileBadge, Building, User, Construction, LayoutDashboard, History, Calculator, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { useUnreadCounts } from '@/hooks/use-unread-counts';

interface AdminSidebarProps {
  onClose?: () => void;
  collapsed?: boolean;
  mobileOpen?: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  onClose,
  collapsed,
  mobileOpen
}) => {
  const location = useLocation();
  const { unreadCounts } = useUnreadCounts();
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    {
      name: 'Панель управления',
      path: '/admin/dashboard',
      icon: <Home className="w-5 h-5 mr-3" />
    },
    {
      name: 'Новости',
      path: '/admin/news',
      icon: <Newspaper className="w-5 h-5 mr-3" />
    },
    {
      name: 'Проекты',
      path: '/admin/projects',
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />
    },
    {
      name: 'История компании',
      path: '/admin/timeline-events',
      icon: <History className="w-5 h-5 mr-3" />
    },
    {
      name: 'Вакансии',
      path: '/admin/vacancies',
      icon: <BriefcaseBusiness className="w-5 h-5 mr-3" />
    },
    {
      name: 'Заявки на вакансии',
      path: '/admin/vacancy-applications',
      icon: <FileBadge className="w-5 h-5 mr-3" />,
      unreadCount: unreadCounts.vacancyApplications
    },
    {
      name: 'Сообщения',
      path: '/admin/messages',
      icon: <MessageSquare className="w-5 h-5 mr-3" />,
      unreadCount: unreadCounts.messages
    },
    {
      name: 'Telegram бот',
      path: '/admin/telegram-bot',
      icon: <Bot className="w-5 h-5 mr-3" />
    },
    {
      name: 'Партнеры',
      path: '/admin/partners',
      icon: <Users2 className="w-5 h-5 mr-3" />
    },
    {
      name: 'Сотрудники',
      path: '/admin/staff',
      icon: <User className="w-5 h-5 mr-3" />
    },
    {
      name: 'Отделы',
      path: '/admin/departments',
      icon: <Users className="w-5 h-5 mr-3" />
    },
    {
      name: 'Будущие проекты',
      path: '/admin/future-projects',
      icon: <Construction className="w-5 h-5 mr-3" />
    },
    {
      name: 'Тендеры',
      path: '/admin/tenders',
      icon: <FileCode className="w-5 h-5 mr-3" />
    },
    {
      name: 'Заявки на тендеры',
      path: '/admin/tender-submissions',
      icon: <FileText className="w-5 h-5 mr-3" />,
      unreadCount: unreadCounts.tenderSubmissions
    },
    {
      name: 'Коммерческие предложения',
      path: '/admin/commercial-offers',
      icon: <HandCoins className="w-5 h-5 mr-3" />,
      unreadCount: unreadCounts.commercialOffers
    },
    {
      name: 'Цены за м²',
      path: '/admin/floor-prices',
      icon: <Layers className="w-5 h-5 mr-3" />
    },
    {
      name: 'Квартиры',
      path: '/admin/apartment-units',
      icon: <Building className="w-5 h-5 mr-3" />
    },
    {
      name: 'Расчет стоимости - Yangi Uzbekistan',
      path: '/admin/yangi-uzbekistan-prices',
      icon: <Calculator className="w-5 h-5 mr-3" />
    },
    {
      name: 'Квартиры - Yangi Uzbekistan',
      path: '/admin/yangi-uzbekistan-apartments',
      icon: <Building className="w-5 h-5 mr-3" />
    },
    {
      name: 'Планировки - Yangi Uzbekistan',
      path: '/admin/yangi-uzbekistan-floor-plans',
      icon: <Layers className="w-5 h-5 mr-3" />
    },
    {
      name: 'Аудит логи',
      path: '/admin/audit-logs',
      icon: <BarChart3 className="w-5 h-5 mr-3" />
    },
    {
      name: 'Детальные аудит логи',
      path: '/admin/detailed-audit-logs',
      icon: <BarChart3 className="w-5 h-5 mr-3" />
    },
    {
      name: 'Company Statistics',
      path: '/admin/company-stats',
      icon: <BarChart3 className="w-5 h-5 mr-3" />
    }
  ];

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 bg-slate-900 text-white flex flex-col shadow-lg z-30 ${mobileOpen === false ? '-translate-x-full lg:translate-x-0' : ''} transition-transform duration-200`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-xl font-bold">Админ панель</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        )}
      </div>
      <nav className="flex-1 overflow-auto pb-6 pt-2 bg-gray-800">
        <ul className="space-y-1 px-3">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                  isActive(link.path) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-slate-800 text-gray-200 hover:text-white'
                }`} 
                onClick={onClose}
              >
                <div className="flex items-center">
                  {link.icon}
                  <span>{link.name}</span>
                </div>
                {link.unreadCount && link.unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                    {link.unreadCount > 99 ? '99+' : link.unreadCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
