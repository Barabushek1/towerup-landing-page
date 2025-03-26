
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
  register: (email: string, password: string, name: string) => Promise<void>;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call in localStorage
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      const foundAdmin = admins.find((a: any) => a.email === email && a.password === password);
      
      if (!foundAdmin) {
        throw new Error('Invalid credentials');
      }
      
      const adminData = {
        id: foundAdmin.id,
        email: foundAdmin.email,
        name: foundAdmin.name,
      };
      
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Simulate API call in localStorage
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      
      // Check if email already exists
      if (admins.some((admin: any) => admin.email === email)) {
        throw new Error('Email already exists');
      }
      
      const newAdmin = {
        id: `admin_${Date.now()}`,
        email,
        password,
        name,
      };
      
      admins.push(newAdmin);
      localStorage.setItem('admins', JSON.stringify(admins));
      
      // Auto login
      const adminData = {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
      };
      
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
      
      return adminData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return (
    <AdminContext.Provider value={{ admin, isLoading, login, logout, register }}>
      {children}
    </AdminContext.Provider>
  );
};
