
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLogin: React.FC = () => {
  const { admin, isLoading, login, register, isMaxAdminsReached } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Состояние формы входа
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  
  // Состояние формы регистрации
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerName, setRegisterName] = useState<string>('');
  const [isRegisterLoading, setIsRegisterLoading] = useState<boolean>(false);
  
  // Состояние вкладок
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

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
        title: "Вход выполнен успешно",
        description: "Добро пожаловать в панель администратора",
        variant: "default",
      });
      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Ошибка входа",
        description: "Неверный email или пароль",
        variant: "destructive",
      });
    } finally {
      setIsLoginLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    
    try {
      await register(registerEmail, registerPassword, registerName);
      toast({
        title: "Регистрация выполнена успешно",
        description: "Ваш аккаунт администратора создан",
        variant: "default",
      });
      navigate('/admin/dashboard');
    } catch (error) {
      // Сообщение об ошибке будет отображено через контекст администратора
    } finally {
      setIsRegisterLoading(false);
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
          <h2 className="text-2xl font-bold text-center text-white">TOWER UP Администратор</h2>
          <p className="text-slate-400 text-center mt-1">Доступ к панели администратора</p>
        </div>

        <div className="flex border-b border-slate-700">
          <button
            className={`w-1/2 py-3 text-center font-medium ${
              activeTab === 'login'
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Вход
          </button>
          <button
            className={`w-1/2 py-3 text-center font-medium ${
              activeTab === 'register'
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-400 hover:text-slate-200'
            } ${isMaxAdminsReached ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => !isMaxAdminsReached && setActiveTab('register')}
            disabled={isMaxAdminsReached}
          >
            Регистрация
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
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
                    Вход...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Войти
                  </>
                )}
              </Button>
            </form>
          ) : (
            <>
              {isMaxAdminsReached ? (
                <Alert className="bg-red-900/20 border-red-900 text-red-300 my-4">
                  <AlertDescription>
                    Достигнуто максимальное количество администраторов. Регистрация новых аккаунтов невозможна.
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Имя</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Иван Иванов"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isRegisterLoading}>
                    {isRegisterLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Регистрация...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Зарегистрироваться
                      </>
                    )}
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
