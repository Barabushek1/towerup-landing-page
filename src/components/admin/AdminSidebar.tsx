import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import {
  LayoutDashboard,
  Newspaper,
  ListChecks,
  Users,
  Mail,
  FilePlus,
  Building2,
  UserPlus,
  Star,
  BarChart,
  CalendarClock,
  FileText,
  FileSearch,
  FileSpreadsheet,
  Layout,
  Coins,
  Landmark,
  KeyRound,
  FileSignature,
  ClipboardList,
  ScrollText
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className={`bg-slate-800 text-slate-200 w-64 flex-shrink-0 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
      <div className="p-4">
        <h1 className="text-lg font-semibold">Панель администратора</h1>
        <p className="text-sm text-slate-400">Вы вошли как {admin?.email}</p>
        <button onClick={handleLogout} className="mt-2 text-sm text-blue-500 hover:text-blue-400">Выйти</button>
      </div>
      <div className="space-y-1">
        <div className="py-4">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500">Общее</div>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Главная
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="py-4">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500">Контент</div>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin/messages"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Mail className="mr-2 h-4 w-4" />
                Сообщения
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/news"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Newspaper className="mr-2 h-4 w-4" />
                Новости
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/testimonials"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Star className="mr-2 h-4 w-4" />
                Отзывы
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/tenders"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <FileText className="mr-2 h-4 w-4" />
                Тендеры
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/commercial-offers"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <FileSignature className="mr-2 h-4 w-4" />
                Коммерческие предложения
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="py-4">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500">Проекты</div>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin/projects"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Текущие проекты
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/future-projects"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Landmark className="mr-2 h-4 w-4" />
                Будущие проекты
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/yangi-uzbekistan-floor-plans"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Layout className="mr-2 h-4 w-4" />
                Yangi Uzbekistan Floor Plans
              </NavLink>
            </li>
             <li>
              <NavLink
                to="/admin/yangi-uzbekistan-prices"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Coins className="mr-2 h-4 w-4" />
                Yangi Uzbekistan Prices
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/yangi-uzbekistan-apartments"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Layout className="mr-2 h-4 w-4" />
                Yangi Uzbekistan Apartments
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/floor-prices"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Coins className="mr-2 h-4 w-4" />
                Floor Prices
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/floor-apartment-prices"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Coins className="mr-2 h-4 w-4" />
                Floor Apartment Prices
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="py-4">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500">Компания</div>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin/vacancies"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <ListChecks className="mr-2 h-4 w-4" />
                Вакансии
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/vacancy-applications"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Заявки на вакансии
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/partners"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Users className="mr-2 h-4 w-4" />
                Партнеры
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/departments"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <Building2 className="mr-2 h-4 w-4" />
                Отделы
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/staff"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Сотрудники
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/company-stats"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <BarChart className="mr-2 h-4 w-4" />
                Статистика компании
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/timeline-events"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                События таймлайна
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="py-4">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500">Тендеры</div>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin/tenders"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <FilePlus className="mr-2 h-4 w-4" />
                Тендеры
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/tender-submissions"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <FileSearch className="mr-2 h-4 w-4" />
                Предложения на тендер
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="py-4">
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500">Аудит</div>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/admin/audit-logs"
                className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm ${isActive ? 'bg-primary text-white' : 'text-slate-300 hover:bg-primary/20'}`}
              >
                <ScrollText className="mr-2 h-4 w-4" />
                Журнал аудита
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
