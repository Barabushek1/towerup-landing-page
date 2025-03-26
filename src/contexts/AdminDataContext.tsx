
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type NewsItem = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image_url: string;
  additional_images?: string[];
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
  image_url?: string;
  additional_images?: string[];
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
    console.log('addNews called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminNews component using Supabase
  };

  const updateNews = (id: string, newsItem: Omit<NewsItem, 'id'>) => {
    console.log('updateNews called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminNews component using Supabase
  };

  const deleteNews = (id: string) => {
    console.log('deleteNews called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminNews component using Supabase
  };

  // Методы для управления вакансиями
  const addVacancy = (vacancyItem: Omit<VacancyItem, 'id'>) => {
    console.log('addVacancy called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminVacancies component using Supabase
  };

  const updateVacancy = (id: string, vacancyItem: Omit<VacancyItem, 'id'>) => {
    console.log('updateVacancy called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminVacancies component using Supabase
  };

  const deleteVacancy = (id: string) => {
    console.log('deleteVacancy called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminVacancies component using Supabase
  };

  // Методы для управления сообщениями
  const addMessage = (messageItem: Omit<MessageItem, 'id' | 'date' | 'read'>) => {
    console.log('addMessage called through context, but this is now handled by Supabase');
    // Implementation is handled using Supabase
  };

  const updateMessage = (id: string, messageItem: Partial<MessageItem>) => {
    console.log('updateMessage called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminMessages component using Supabase
  };

  const deleteMessage = (id: string) => {
    console.log('deleteMessage called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminMessages component using Supabase
  };

  const markMessageAsRead = (id: string) => {
    console.log('markMessageAsRead called through context, but this is now handled by Supabase');
    // Implementation is handled in the AdminMessages component using Supabase
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
