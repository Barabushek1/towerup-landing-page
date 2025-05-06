
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Admin = {
  id: string;
  email: string;
  name?: string;
} | null;

export type AdminContextType = {
  admin: Admin;
  setAdmin: (admin: Admin) => void;
  isLoading: boolean;
};

const initialState: AdminContextType = {
  admin: null,
  setAdmin: () => {},
  isLoading: true,
};

const AdminContext = createContext<AdminContextType>(initialState);

export const useAdmin = () => useContext(AdminContext);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);
      } catch (error) {
        console.error('Error parsing stored admin data:', error);
        localStorage.removeItem('admin');
      }
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (admin) {
      localStorage.setItem('admin', JSON.stringify(admin));
    } else {
      localStorage.removeItem('admin');
    }
  }, [admin]);

  return (
    <AdminContext.Provider value={{ admin, setAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};
