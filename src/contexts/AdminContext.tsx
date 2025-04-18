
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [isMaxAdminsReached, setIsMaxAdminsReached] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadAdminStatus = async () => {
      try {
        // Check if there's a stored admin session
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin));
        }
        
        // Fetch admin data from Supabase to verify credentials
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching admin data:', error);
          setAdmin(null);
          localStorage.removeItem('admin');
        }

        setIsMaxAdminsReached(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in loadAdminStatus:', error);
        setIsLoading(false);
      }
    };

    loadAdminStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Query the admin_users table to find the admin with the given email
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !adminData) {
        throw new Error('Неверные учетные данные');
      }

      // For demonstration, we're using the default password
      // In a real application, you should use proper authentication
      if (password !== 'Towerup_admin1234') {
        throw new Error('Неверные учетные данные');
      }

      const adminInfo = {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
      };

      setAdmin(adminInfo);
      localStorage.setItem('admin', JSON.stringify(adminInfo));
      console.log('Успешный вход:', adminInfo);
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
