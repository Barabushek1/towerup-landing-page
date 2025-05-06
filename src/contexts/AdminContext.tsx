
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Admin = {
  id: string;
  email: string;
  name?: string;
} | null;

export type AdminContextType = {
  admin: Admin;
  setAdmin: (admin: Admin) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const initialState: AdminContextType = {
  admin: null,
  setAdmin: () => {},
  isLoading: true,
  login: async () => {},
  logout: () => {},
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

  const login = async (email: string, password: string) => {
    try {
      // Log admin login attempt
      await supabase
        .from('admin_audit_logs')
        .insert({
          action_type: 'login_attempt',
          admin_email: email,
          details: { method: 'email_password' }
        });
      
      // Use supabase function to verify admin credentials
      const { data, error } = await supabase.functions.invoke('verify-admin-credentials', {
        body: { email, password }
      });
      
      if (error) throw error;
      if (!data || !data.admin) throw new Error('Invalid credentials');
      
      // Set admin data
      setAdmin({
        id: data.admin.id,
        email: data.admin.email,
        name: data.admin.name
      });
      
      // Log successful login
      await supabase
        .from('admin_audit_logs')
        .insert({
          action_type: 'login_success',
          admin_email: email,
          details: { method: 'email_password' }
        });
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Log failed login
      await supabase
        .from('admin_audit_logs')
        .insert({
          action_type: 'login_failed',
          admin_email: email,
          details: { method: 'email_password', error: error instanceof Error ? error.message : 'Unknown error' }
        });
      
      throw error;
    }
  };

  const logout = () => {
    if (admin) {
      // Log logout action
      supabase
        .from('admin_audit_logs')
        .insert({
          action_type: 'logout',
          admin_email: admin.email,
          details: { method: 'manual' }
        })
        .then(() => {
          // Clear admin data
          setAdmin(null);
        })
        .catch((error) => {
          console.error('Error logging admin logout:', error);
          // Still clear admin data even if logging fails
          setAdmin(null);
        });
    }
  };

  return (
    <AdminContext.Provider value={{ admin, setAdmin, isLoading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
