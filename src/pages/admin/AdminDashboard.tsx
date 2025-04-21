
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, MessageSquare, BarChart3 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NewsItem {
  id: string;
  title: string;
  image_url?: string;
  created_at: string;
}

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
}

const AdminDashboard: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Загрузка новостей
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (newsError) throw newsError;
        setNews(newsData || []);

        // Загрузка вакансий
        const { data: vacanciesData, error: vacanciesError } = await supabase
          .from('vacancies')
          .select('*')
          .order('created_at', { ascending: false });

        if (vacanciesError) throw vacanciesError;
        setVacancies(vacanciesData || []);

        // Загрузка сообщений
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const unreadMessages = messages.filter(msg => !msg.read).length;

  const stats = [
    {
      title: 'Total News',
      value: news.length,
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-500/10 border-blue-500/20',
      textColor: 'text-blue-500',
    },
    {
      title: 'Total Vacancies',
      value: vacancies.length,
      icon: <Briefcase className="h-8 w-8 text-green-500" />,
      color: 'bg-green-500/10 border-green-500/20',
      textColor: 'text-green-500',
    },
    {
      title: 'Unread Messages',
      value: unreadMessages,
      icon: <MessageSquare className="h-8 w-8 text-amber-500" />,
      color: 'bg-amber-500/10 border-amber-500/20',
      textColor: 'text-amber-500',
    },
    {
      title: 'Total Messages',
      value: messages.length,
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      color: 'bg-purple-500/10 border-purple-500/20',
      textColor: 'text-purple-500',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl ${stat.color} border transition-all min-w-0 flex-1`}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-300">{stat.title}</span>
              {stat.icon}
            </div>
            <div className={`px-4 pb-3 md:pb-6`}>
              <div className={`text-2xl md:text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <span className="text-lg md:text-xl font-semibold text-white">Recent News</span>
          </div>
          <div className="p-4">
            {news.length > 0 ? (
              <div className="space-y-4">
                {news.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/40">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white line-clamp-1 break-words">{item.title}</h3>
                      <p className="text-xs md:text-sm text-slate-400">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <p>No news articles yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <span className="text-lg md:text-xl font-semibold text-white">Recent Messages</span>
          </div>
          <div className="p-4">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/40">
                    <div className={`w-2 h-2 rounded-full mt-2 ${item.read ? 'bg-slate-500' : 'bg-green-500'}`} />
                    <div className="min-w-0">
                      <h3 className="font-medium text-white break-words">{item.name}</h3>
                      <p className="text-xs md:text-sm text-slate-400">{item.email}</p>
                      <p className="text-xs md:text-sm text-slate-300 line-clamp-2 mt-1 break-words">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <p>No messages yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
