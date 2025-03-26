
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import NewsManagement from '@/components/admin/NewsManagement';
import VacanciesManagement from '@/components/admin/VacanciesManagement';
import MessagesManagement from '@/components/admin/MessagesManagement';
import Login from '@/components/admin/Login';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Session } from '@supabase/supabase-js';

const Admin: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          checkIfAdmin(currentSession.user.id);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        checkIfAdmin(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkIfAdmin = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161616] text-gray-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen antialiased bg-[#161616] text-gray-200 overflow-x-hidden">
      <NavBar />
      <main className="py-16 container mx-auto px-6">
        {!session ? (
          <Login />
        ) : !isAdmin ? (
          <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-700/30 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-medium mb-4 text-slate-200 font-benzin">Доступ запрещен</h2>
            <p className="text-slate-300 mb-6">У вас нет прав администратора для доступа к этой странице.</p>
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                navigate('/');
              }}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-benzin"
            >
              Выйти
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-3xl font-bold text-white font-benzin">Административная панель</h1>
              <button 
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/');
                }}
                className="mt-4 sm:mt-0 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-benzin"
              >
                Выйти
              </button>
            </div>
            
            <Tabs defaultValue="news" className="w-full">
              <TabsList className="mb-8 bg-slate-800/40 border border-slate-700/30 p-1 rounded-lg">
                <TabsTrigger value="news" className="font-benzin">Новости</TabsTrigger>
                <TabsTrigger value="vacancies" className="font-benzin">Вакансии</TabsTrigger>
                <TabsTrigger value="messages" className="font-benzin">Сообщения</TabsTrigger>
              </TabsList>
              <TabsContent value="news">
                <NewsManagement />
              </TabsContent>
              <TabsContent value="vacancies">
                <VacanciesManagement />
              </TabsContent>
              <TabsContent value="messages">
                <MessagesManagement />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
