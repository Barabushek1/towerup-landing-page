
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
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isMaxAdminsReached: boolean;
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
  const [isMaxAdminsReached, setIsMaxAdminsReached] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadAdminStatus = async () => {
      try {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
          const parsedAdmin = JSON.parse(storedAdmin);
          
          // Verify if the admin still exists in the database
          const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', parsedAdmin.id)
            .single();
          
          if (error || !data) {
            console.log('Stored admin no longer exists in database, logging out');
            localStorage.removeItem('admin');
            setAdmin(null);
          } else {
            setAdmin(parsedAdmin);
          }
        }
        
        // Check total number of admin users
        const { count, error } = await supabase
          .from('admin_users')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        // Changed from 5 to 2 admin users limit
        setIsMaxAdminsReached(count !== null && count >= 2);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in loadAdminStatus:', error);
        // In case of error, still set loading to false but clear admin
        localStorage.removeItem('admin');
        setAdmin(null);
        setIsLoading(false);
      }
    };

    loadAdminStatus();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    if (isMaxAdminsReached) {
      throw new Error('Maximum number of admin users reached (2)');
    }

    try {
      const { data, error } = await supabase.functions.invoke('verify-admin-credentials', {
        body: { 
          email, 
          password,
          action: 'signup',
          name
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Signup failed');
      }

      const adminData = data[0];
      
      const adminInfo: Admin = {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name || name
      };
      
      setAdmin(adminInfo);
      localStorage.setItem('admin', JSON.stringify(adminInfo));
      console.log('Signup successful:', adminInfo);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-admin-credentials', {
        body: { email, password },
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid credentials');
      }

      const adminData = data[0];
      
      const adminInfo: Admin = {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name || 'Administrator'
      };
      
      setAdmin(adminInfo);
      localStorage.setItem('admin', JSON.stringify(adminInfo));
      console.log('Login successful:', adminInfo);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AdminContext.Provider value={{ 
      admin, 
      isLoading, 
      login, 
      signup, 
      logout, 
      isMaxAdminsReached 
    }}>
      {children}
    </AdminContext.Provider>
  );
};
