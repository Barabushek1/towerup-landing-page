import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut,
  HelpCircle,
  Building,
  FileImage,
  Handshake 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const navItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/admin'
    },
    {
      title: 'Projects',
      icon: <Building className="h-5 w-5" />,
      href: '/admin/projects'
    },
    {
      title: 'Future Projects',
      icon: <FileImage className="h-5 w-5" />,
      href: '/admin/future-projects'
    },
    {
      title: 'News',
      icon: <FileText className="h-5 w-5" />,
      href: '/admin/news'
    },
    {
      title: 'Vacancies',
      icon: <Briefcase className="h-5 w-5" />,
      href: '/admin/vacancies'
    },
    {
      title: 'Messages',
      icon: <MessageSquare className="h-5 w-5" />,
      href: '/admin/messages'
    },
    {
      title: 'Partners',
      icon: <Handshake className="h-5 w-5" />,
      href: '/admin/partners'
    },
    {
      title: 'Users',
      icon: <Users className="h-5 w-5" />,
      href: '/admin/users'
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/admin/settings'
    },
    {
      title: 'Help',
      icon: <HelpCircle className="h-5 w-5" />,
      href: '/admin/help'
    }
  ];
  
  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 h-full py-4">
      <div className="px-6 mb-6">
        <Link to="/" className="flex items-center text-lg font-semibold text-white">
          Admin Panel
        </Link>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className={cn(
              "group flex items-center space-x-3 py-2 px-6 hover:bg-zinc-800 rounded-md transition-colors duration-200",
              location.pathname === item.href
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-6 pt-6">
        <button
          onClick={signOut}
          className="flex items-center space-x-3 py-2 px-6 hover:bg-zinc-800 rounded-md transition-colors duration-200 text-zinc-400 hover:text-zinc-100 w-full justify-start"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
