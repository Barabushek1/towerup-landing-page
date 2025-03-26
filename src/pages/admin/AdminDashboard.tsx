
import React from 'react';
import { useAdminData } from '@/contexts/AdminDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Briefcase, MessageSquare, BarChart3 } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { news, vacancies, messages } = useAdminData();
  const unreadMessages = messages.filter(msg => !msg.isRead).length;

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
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className={`${stat.color} bg-opacity-10 border`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent News</CardTitle>
          </CardHeader>
          <CardContent>
            {news.length > 0 ? (
              <div className="space-y-4">
                {news.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/40">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <p>No news articles yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-xl text-white">Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/40">
                    <div className={`w-2 h-2 rounded-full mt-2 ${item.isRead ? 'bg-slate-500' : 'bg-green-500'}`} />
                    <div>
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-sm text-slate-400">{item.email}</p>
                      <p className="text-sm text-slate-300 line-clamp-2 mt-1">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <p>No messages yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
