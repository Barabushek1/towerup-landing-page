import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type NewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  additionalImages?: string[];
  featured?: boolean;
};

export type VacancyItem = {
  id: string;
  title: string;
  location: string;
  salary: string;
  type: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  imageUrl?: string;
  additionalImages?: string[];
};

export type PartnerItem = {
  id: string;
  name: string;
  logo: string;
  url: string;
};

export type MessageItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
};

type AdminDataContextType = {
  news: NewsItem[];
  vacancies: VacancyItem[];
  messages: MessageItem[];
  partners: PartnerItem[];
  addNews: (newsItem: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, newsItem: Omit<NewsItem, 'id'>) => void;
  deleteNews: (id: string) => void;
  addVacancy: (vacancyItem: Omit<VacancyItem, 'id'>) => void;
  updateVacancy: (id: string, vacancyItem: Omit<VacancyItem, 'id'>) => void;
  deleteVacancy: (id: string) => void;
  addMessage: (messageItem: Omit<MessageItem, 'id' | 'date' | 'read'>) => void;
  updateMessage: (id: string, messageItem: Partial<MessageItem>) => void;
  deleteMessage: (id: string) => void;
  markMessageAsRead: (id: string) => void;
  addPartner: (partnerItem: Omit<PartnerItem, 'id'>) => void;
  updatePartner: (id: string, partnerItem: Omit<PartnerItem, 'id'>) => void;
  deletePartner: (id: string) => void;
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData должен использоваться внутри AdminDataProvider');
  }
  return context;
};

export const AdminDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [partners, setPartners] = useState<PartnerItem[]>([]);

  // Загрузка данных при инициализации
  useEffect(() => {
    const storedNews = localStorage.getItem('news');
    const storedVacancies = localStorage.getItem('vacancies');
    const storedMessages = localStorage.getItem('messages');
    
    if (storedNews) setNews(JSON.parse(storedNews));
    if (storedVacancies) setVacancies(JSON.parse(storedVacancies));
    if (storedMessages) setMessages(JSON.parse(storedMessages));
  }, []);

  // Методы для управления новостями
  const addNews = (newsItem: Omit<NewsItem, 'id'>) => {
    const newNewsItem = { ...newsItem, id: uuidv4() };
    const updatedNews = [...news, newNewsItem];
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
  };

  const updateNews = (id: string, newsItem: Omit<NewsItem, 'id'>) => {
    const updatedNews = news.map(item => 
      item.id === id ? { ...newsItem, id } : item
    );
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
  };

  const deleteNews = (id: string) => {
    const updatedNews = news.filter(item => item.id !== id);
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
  };

  // Методы для управления вакансиями
  const addVacancy = (vacancyItem: Omit<VacancyItem, 'id'>) => {
    const newVacancyItem = { ...vacancyItem, id: uuidv4() };
    const updatedVacancies = [...vacancies, newVacancyItem];
    setVacancies(updatedVacancies);
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));
  };

  const updateVacancy = (id: string, vacancyItem: Omit<VacancyItem, 'id'>) => {
    const updatedVacancies = vacancies.map(item => 
      item.id === id ? { ...vacancyItem, id } : item
    );
    setVacancies(updatedVacancies);
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));
  };

  const deleteVacancy = (id: string) => {
    const updatedVacancies = vacancies.filter(item => item.id !== id);
    setVacancies(updatedVacancies);
    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));
  };

  // Методы для управления сообщениями
  const addMessage = (messageItem: Omit<MessageItem, 'id' | 'date' | 'read'>) => {
    const newMessageItem = { 
      ...messageItem, 
      id: uuidv4(), 
      date: new Date().toISOString(), 
      read: false 
    };
    const updatedMessages = [...messages, newMessageItem];
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const updateMessage = (id: string, messageItem: Partial<MessageItem>) => {
    const updatedMessages = messages.map(item => 
      item.id === id ? { ...item, ...messageItem } : item
    );
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const deleteMessage = (id: string) => {
    const updatedMessages = messages.filter(item => item.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  const markMessageAsRead = (id: string) => {
    const updatedMessages = messages.map(item => 
      item.id === id ? { ...item, read: true } : item
    );
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  // Методы для управления партнерами
  const addPartner = (partnerItem: Omit<PartnerItem, 'id'>) => {
    console.log('addPartner called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminPartners component using Supabase
  };

  const updatePartner = (id: string, partnerItem: Omit<PartnerItem, 'id'>) => {
    console.log('updatePartner called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminPartners component using Supabase
  };

  const deletePartner = (id: string) => {
    console.log('deletePartner called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminPartners component using Supabase
  };

  return (
    <AdminDataContext.Provider value={{ 
      news, 
      vacancies, 
      messages, 
      partners,
      addNews, 
      updateNews, 
      deleteNews, 
      addVacancy, 
      updateVacancy, 
      deleteVacancy, 
      addMessage, 
      updateMessage, 
      deleteMessage,
      markMessageAsRead,
      addPartner,
      updatePartner,
      deletePartner
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};
