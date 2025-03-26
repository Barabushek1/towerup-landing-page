
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    // Проверка, вошел ли администратор в систему
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
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
    <AdminContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
