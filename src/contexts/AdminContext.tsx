
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

type Admin = {
  id: string;
  email: string;
  name: string;
};

type AdminContextType = {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isMaxAdminsReached: boolean;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin должен использоваться внутри AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMaxAdminsReached, setIsMaxAdminsReached] = useState<boolean>(true); // Always true to prevent registration
  const { toast } = useToast();

  useEffect(() => {
    // Проверка, вошел ли администратор в систему
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    
    // Создаем дефолтный аккаунт администратора, если его еще нет
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    if (admins.length === 0) {
      const defaultAdmin = {
        id: '1',
        email: 'admin@towerup.ru',
        password: 'admin123',
        name: 'Администратор',
      };
      
      localStorage.setItem('admins', JSON.stringify([defaultAdmin]));
    }
    
    setIsMaxAdminsReached(true); // Запрещаем регистрацию новых администраторов
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Симуляция вызова API в localStorage
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      const foundAdmin = admins.find((a: any) => a.email === email && a.password === password);
      
      if (!foundAdmin) {
        throw new Error('Неверные учетные данные');
      }
      
      const adminData = {
        id: foundAdmin.id,
        email: foundAdmin.email,
        name: foundAdmin.name,
      };
      
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AdminContext.Provider value={{ admin, isLoading, login, logout, isMaxAdminsReached }}>
      {children}
    </AdminContext.Provider>
  );
};
