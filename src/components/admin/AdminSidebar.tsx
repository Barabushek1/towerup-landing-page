
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Building, 
  Calendar,
  Newspaper,
  UserCheck,
  TrendingUp,
  Building2,
  Clock,
  DollarSign,
  Home,
  Bot,
  Send,
  Award,
  Handshake,
  FileSpreadsheet,
  UserCog,
  GitBranch,
  ShieldCheck,
  BarChart3,
  Archive
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      section: 'Главная',
      items: [
        { name: 'Панель управления', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Статистика аудита', path: '/admin/audit-logs', icon: ShieldCheck },
        { name: 'Детальный аудит', path: '/admin/detailed-audit-logs', icon: BarChart3 },
      ]
    },
    {
      section: 'Контент',
      items: [
        { name: 'Новости', path: '/admin/news', icon: Newspaper },
        { name: 'Будущие проекты', path: '/admin/future-projects', icon: Building2 },
        { name: 'Проекты', path: '/admin/projects', icon: Building },
        { name: 'Вакансии', path: '/admin/vacancies', icon: Briefcase },
        { name: 'Партнеры', path: '/admin/partners', icon: Handshake },
        { name: 'События', path: '/admin/timeline-events', icon: GitBranch },
        { name: 'Статистика', path: '/admin/company-stats', icon: TrendingUp },
      ]
    },
    {
      section: 'Сообщения',
      items: [
        { name: 'Сообщения', path: '/admin/messages', icon: MessageSquare },
        { name: 'Заявки на вакансии', path: '/admin/vacancy-applications', icon: UserCheck },
        { name: 'Тендеры', path: '/admin/tenders', icon: FileText },
        { name: 'Заявки на тендеры', path: '/admin/tender-submissions', icon: FileSpreadsheet },
        { name: 'Коммерческие предложения', path: '/admin/commercial-offers', icon: Send },
        { name: 'Telegram бот', path: '/admin/telegram-bot', icon: Bot },
      ]
    },
    {
      section: 'Сотрудники',
      items: [
        { name: 'Сотрудники', path: '/admin/staff', icon: Users },
        { name: 'Отделы', path: '/admin/departments', icon: UserCog },
      ]
    },
    {
      section: 'Yangi Uzbekistan',
      items: [
        { name: 'Планировки', path: '/admin/yangi-uzbekistan-floor-plans', icon: Home },
        { name: 'Цены за этаж', path: '/admin/yangi-uzbekistan-prices', icon: DollarSign },
        { name: 'Квартиры', path: '/admin/yangi-uzbekistan-apartments', icon: Archive },
      ]
    },
    {
      section: 'Цены',
      items: [
        { name: 'Цены за этаж', path: '/admin/floor-prices', icon: DollarSign },
        { name: 'Цены квартир по этажам', path: '/admin/floor-apartment-prices', icon: Clock },
        { name: 'Квартиры', path: '/admin/apartment-units', icon: Building },
      ]
    }
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 h-full overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">Админ панель</h2>
      </div>
      
      <nav className="px-4 pb-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive 
                        ? "bg-primary text-white" 
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
