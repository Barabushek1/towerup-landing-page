
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const { admin, isLoading, login } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login state
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
        variant: "default",
      });
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoginLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-xl border border-slate-700 overflow-hidden">
        <div className="p-6 bg-slate-800 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-center text-white">
            TOWER UP Admin
          </h2>
          <p className="text-slate-400 text-center mt-1">
            Access to admin panel
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoginLoading}>
              {isLoginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
