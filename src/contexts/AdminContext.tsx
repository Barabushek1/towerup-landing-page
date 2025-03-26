
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
    
    // Создаем или проверяем наличие дефолтного аккаунта администратора
    const defaultAdmin = {
      id: '1',
      email: 'admin@towerup.ru',
      password: 'admin123', // пароль будет доступен только в localStorage
      name: 'Администратор',
    };
    
    // Получаем текущий список администраторов
    let admins = JSON.parse(localStorage.getItem('admins') || '[]');
    
    // Проверяем наличие дефолтного админа
    const hasDefaultAdmin = admins.some((a: any) => a.id === '1');
    
    // Если дефолтный админ отсутствует, добавляем его
    if (!hasDefaultAdmin) {
      admins = [defaultAdmin];
      localStorage.setItem('admins', JSON.stringify(admins));
      console.log('Создан дефолтный аккаунт администратора');
    }
    
    setIsMaxAdminsReached(true); // Запрещаем регистрацию новых администраторов
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Получаем список администраторов из localStorage
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      
      // Ищем администратора с указанными учетными данными
      const foundAdmin = admins.find((a: any) => 
        a.email === email && a.password === password
      );
      
      // Выводим для отладки
      console.log('Trying to login with:', { email, password });
      console.log('Available admins:', admins);
      console.log('Found admin:', foundAdmin);
      
      if (!foundAdmin) {
        throw new Error('Неверные учетные данные');
      }
      
      // Создаем объект администратора без пароля для хранения в состоянии
      const adminData = {
        id: foundAdmin.id,
        email: foundAdmin.email,
        name: foundAdmin.name,
      };
      
      // Обновляем состояние и сохраняем в localStorage
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
      
      console.log('Успешный вход:', adminData);
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
