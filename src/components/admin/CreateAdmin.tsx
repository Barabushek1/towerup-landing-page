
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CreateAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Step 1: Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Step 2: Add user to admin_users table
      if (authData.user) {
        const { error: adminError } = await supabase
          .from('admin_users')
          .insert([
            { id: authData.user.id, email, name }
          ]);
        
        if (adminError) throw adminError;
        
        toast({
          title: "Успешно",
          description: "Администратор создан. Запишите эти данные для входа:\nEmail: " + email + "\nПароль: " + password,
        });

        // Clear form
        setEmail('');
        setPassword('');
        setName('');
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: "Ошибка создания администратора",
        description: error.message || "Что-то пошло не так",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 bg-slate-800/40 rounded-xl p-8 border border-slate-700/30">
      <h2 className="text-2xl font-medium mb-6 text-slate-200 font-benzin">Создать нового администратора</h2>
      
      <form onSubmit={handleCreateAdmin} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Имя</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="admin-email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white"
            required
          />
        </div>
        
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-1">Пароль</label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600/50 text-white"
            required
            minLength={6}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white font-benzin py-2"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Создание...
            </span>
          ) : 'Создать администратора'}
        </Button>
      </form>
    </div>
  );
};

export default CreateAdmin;
