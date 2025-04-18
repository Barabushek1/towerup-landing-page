
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
      // Query the admin_users table and verify password using pgcrypto
      const { data, error } = await supabase
        .rpc('verify_admin_credentials', {
          p_email: email,
          p_password: password
        });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('Неверные учетные данные');
      }

      // Extract the first result from the data array
      const adminData = data[0];
      
      const adminInfo: Admin = {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name || 'Администратор'
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
