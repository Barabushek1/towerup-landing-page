
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
      // We'll use a direct check for our known admin credentials
      // since we have a fixed admin account
      if (email === 'towerup@admin.ru' && password === 'Towerup_admin1234') {
        // Query the admin_users table to check if admin exists
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email);

        // Create admin user in database if not found
        let adminInfo: Admin;

        if (error || !adminData || adminData.length === 0) {
          // Admin not found in database, create one
          const { data: newAdmin, error: insertError } = await supabase
            .from('admin_users')
            .insert([
              { email: 'towerup@admin.ru', name: 'Администратор' }
            ])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating admin:', insertError);
            throw new Error('Ошибка создания администратора');
          }

          adminInfo = {
            id: newAdmin.id,
            email: newAdmin.email,
            name: newAdmin.name || 'Администратор'
          };
        } else {
          // Admin found in database
          adminInfo = {
            id: adminData[0].id,
            email: adminData[0].email,
            name: adminData[0].name || 'Администратор'
          };
        }

        setAdmin(adminInfo);
        localStorage.setItem('admin', JSON.stringify(adminInfo));
        console.log('Успешный вход:', adminInfo);
      } else {
        throw new Error('Неверные учетные данные');
      }
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
