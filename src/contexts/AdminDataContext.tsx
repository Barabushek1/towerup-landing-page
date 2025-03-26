
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types for our data
export type NewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
};

export type VacancyItem = {
  id: string;
  title: string;
  location: string;
  salary: string;
  type: string;
  description: string;
};

export type MessageItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  isRead: boolean;
};

type AdminDataContextType = {
  news: NewsItem[];
  vacancies: VacancyItem[];
  messages: MessageItem[];
  addNews: (news: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, news: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  addVacancy: (vacancy: Omit<VacancyItem, 'id'>) => void;
  updateVacancy: (id: string, vacancy: Partial<VacancyItem>) => void;
  deleteVacancy: (id: string) => void;
  addMessage: (message: Omit<MessageItem, 'id' | 'date' | 'isRead'>) => void;
  markMessageAsRead: (id: string) => void;
  deleteMessage: (id: string) => void;
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  // Load initial data from localStorage
  useEffect(() => {
    const storedNews = localStorage.getItem('news');
    const storedVacancies = localStorage.getItem('vacancies');
    const storedMessages = localStorage.getItem('contactMessages');

    if (storedNews) setNews(JSON.parse(storedNews));
    if (storedVacancies) setVacancies(JSON.parse(storedVacancies));
    if (storedMessages) setMessages(JSON.parse(storedMessages));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('vacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('contactMessages', JSON.stringify(messages));
  }, [messages]);

  // News functions
  const addNews = (newsItem: Omit<NewsItem, 'id'>) => {
    const newNewsItem = {
      ...newsItem,
      id: `news_${Date.now()}`,
    };
    setNews([newNewsItem, ...news]);
  };

  const updateNews = (id: string, newsItem: Partial<NewsItem>) => {
    setNews(news.map(item => item.id === id ? { ...item, ...newsItem } : item));
  };

  const deleteNews = (id: string) => {
    setNews(news.filter(item => item.id !== id));
  };

  // Vacancy functions
  const addVacancy = (vacancy: Omit<VacancyItem, 'id'>) => {
    const newVacancy = {
      ...vacancy,
      id: `vacancy_${Date.now()}`,
    };
    setVacancies([newVacancy, ...vacancies]);
  };

  const updateVacancy = (id: string, vacancy: Partial<VacancyItem>) => {
    setVacancies(vacancies.map(item => item.id === id ? { ...item, ...vacancy } : item));
  };

  const deleteVacancy = (id: string) => {
    setVacancies(vacancies.filter(item => item.id !== id));
  };

  // Message functions
  const addMessage = (message: Omit<MessageItem, 'id' | 'date' | 'isRead'>) => {
    const newMessage = {
      ...message,
      id: `message_${Date.now()}`,
      date: new Date().toISOString(),
      isRead: false,
    };
    setMessages([newMessage, ...messages]);
  };

  const markMessageAsRead = (id: string) => {
    setMessages(messages.map(item => item.id === id ? { ...item, isRead: true } : item));
  };

  const deleteMessage = (id: string) => {
    setMessages(messages.filter(item => item.id !== id));
  };

  return (
    <AdminDataContext.Provider
      value={{
        news,
        vacancies,
        messages,
        addNews,
        updateNews,
        deleteNews,
        addVacancy,
        updateVacancy,
        deleteVacancy,
        addMessage,
        markMessageAsRead,
        deleteMessage,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
