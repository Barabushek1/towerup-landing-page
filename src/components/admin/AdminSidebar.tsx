
import React from 'react';
import {
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Image,
  LayoutTemplate,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    {
      title: 'Главная',
      href: '/admin',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: 'Пользователи',
      href: '/admin/users',
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: 'Проекты',
      href: '/admin/projects',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: 'Медиа',
      href: '/admin/media',
      icon: <Image className="h-4 w-4" />,
    },
    {
      title: 'Настройки',
      href: '/admin/settings',
      icon: <Settings className="h-4 w-4" />,
    },
    {
      title: 'Yangi UZ Планировки',
      href: '/admin/yangi-uzbekistan-floor-plans',
      icon: <LayoutTemplate className="h-4 w-4" />,
    },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-full flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex-1">
        <ul>
          {menuItems.map((item) => (
            <li key={item.title} className="hover:bg-slate-800">
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center p-4 space-x-2 ${
                    isActive ? 'bg-slate-800' : ''
                  }`
                }
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
