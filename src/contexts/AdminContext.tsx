
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
  register: (email: string, password: string, name: string) => Promise<void>;
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
  const [isMaxAdminsReached, setIsMaxAdminsReached] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Проверка, вошел ли администратор в систему
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    
    // Проверка, достигнуто ли максимальное количество администраторов
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    setIsMaxAdminsReached(admins.length >= 1);
    
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

  const register = async (email: string, password: string, name: string) => {
    try {
      // Проверка, не существует ли уже максимальное количество администраторов
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      
      if (admins.length >= 1) {
        toast({
          title: "Регистрация невозможна",
          description: "Достигнуто максимальное количество администраторов",
          variant: "destructive",
        });
        setIsMaxAdminsReached(true);
        throw new Error('Достигнуто максимальное количество администраторов');
      }
      
      // Проверка, не существует ли уже администратор с таким email
      if (admins.some((a: any) => a.email === email)) {
        toast({
          title: "Ошибка регистрации",
          description: "Администратор с таким email уже существует",
          variant: "destructive",
        });
        throw new Error('Администратор с таким email уже существует');
      }
      
      // Создание нового администратора
      const newAdmin = {
        id: Date.now().toString(),
        email,
        password,
        name,
      };
      
      admins.push(newAdmin);
      localStorage.setItem('admins', JSON.stringify(admins));
      
      // Автоматический вход после регистрации
      const adminData = {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
      };
      
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
      
      toast({
        title: "Регистрация успешна",
        description: "Аккаунт администратора успешно создан",
      });
      
      // Обновление флага максимального количества администраторов
      setIsMaxAdminsReached(true);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AdminContext.Provider value={{ admin, isLoading, login, logout, register, isMaxAdminsReached }}>
      {children}
    </AdminContext.Provider>
  );
};
