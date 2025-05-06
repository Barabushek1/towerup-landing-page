
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AdminLogin: React.FC = () => {
  const { admin, isLoading, login } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoginLoading(true);
    try {
      await login(values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
        variant: "default",
      });
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Login error:", error);
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
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        type="email"
                        className="bg-slate-700 border-slate-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        type="password"
                        className="bg-slate-700 border-slate-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-2">
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
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-400">
                  Default admin: towerup@admin.ru
                </p>
                <p className="text-sm text-slate-400">
                  Password: Towerup_admin1234
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
