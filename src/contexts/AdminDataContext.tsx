
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { safelyFormatDate, validateImageUrl } from '@/utils/supabase-helpers';
import { Tender } from '@/types/tenders';

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
  tenders: Tender[];
  addNews: (newsItem: Omit<NewsItem, 'id'>) => Promise<void>;
  updateNews: (id: string, newsItem: Omit<NewsItem, 'id'>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  addVacancy: (vacancyItem: Omit<VacancyItem, 'id'>) => Promise<void>;
  updateVacancy: (id: string, vacancyItem: Omit<VacancyItem, 'id'>) => Promise<void>;
  deleteVacancy: (id: string) => Promise<void>;
  addMessage: (messageItem: Omit<MessageItem, 'id' | 'date' | 'read'>) => Promise<void>;
  updateMessage: (id: string, messageItem: Partial<MessageItem>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  markMessageAsRead: (id: string) => Promise<void>;
  addPartner: (partnerItem: Omit<PartnerItem, 'id'>) => Promise<void>;
  updatePartner: (id: string, partnerItem: Omit<PartnerItem, 'id'>) => Promise<void>;
  deletePartner: (id: string) => Promise<void>;
  addTender: (tender: Omit<Tender, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTender: (id: string, tender: Partial<Omit<Tender, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteTender: (id: string) => Promise<void>;
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
  const [tenders, setTenders] = useState<Tender[]>([]);

  const ensureStorageBucketExists = async (bucketName: string) => {
    console.log(`Checking if bucket ${bucketName} exists...`);
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error listing buckets:', error);
        throw error;
      }
      
      const bucketExists = data?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Bucket ${bucketName} not found, attempting to create it`);
        try {
          const { error: createError } = await supabase.storage.createBucket(bucketName, {
            public: true
          });
          
          if (createError) {
            console.error(`Error creating bucket ${bucketName}:`, createError);
            throw createError;
          }
          
          console.log(`Bucket ${bucketName} created successfully`);
        } catch (err) {
          console.error(`Failed to create bucket ${bucketName}:`, err);
          // Continue execution even if bucket creation fails
          // as it might already exist but with limited permissions
        }
      } else {
        console.log(`Bucket ${bucketName} already exists`);
      }
    } catch (error) {
      console.error(`Error checking bucket ${bucketName}:`, error);
      // Continue execution despite errors
    }
  };

  useEffect(() => {
    async function fetchInitialData() {
      try {
        console.log('Fetching initial data for AdminDataContext...');
        
        // Ensure storage bucket exists
        await ensureStorageBucketExists('images');
        
        // Fetch news data
        console.log('Fetching news data...');
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });
        
        if (newsError) {
          console.error('Error fetching news:', newsError);
          throw newsError;
        }
        
        if (newsData) {
          console.log(`Fetched ${newsData.length} news items`);
          setNews(newsData.map(item => ({
            id: item.id,
            title: item.title,
            date: item.published_at,
            excerpt: item.summary,
            content: item.content,
            image_url: item.image_url || '',
            additional_images: item.additional_images || [],
            featured: item.featured || false
          })));
        }

        // Fetch messages data
        console.log('Fetching messages data...');
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (messagesError) {
          console.error('Error fetching messages:', messagesError);
          throw messagesError;
        }
        
        if (messagesData) {
          console.log(`Fetched ${messagesData.length} messages`);
          setMessages(messagesData.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            message: item.message,
            date: item.date || item.created_at,
            read: item.read || false
          })));
        }

        // Fetch partners data
        console.log('Fetching partners data...');
        const { data: partnersData, error: partnersError } = await supabase
          .from('partners')
          .select('*');
        
        if (partnersError) {
          console.error('Error fetching partners:', partnersError);
          throw partnersError;
        }
        
        if (partnersData) {
          console.log(`Fetched ${partnersData.length} partners`);
          setPartners(partnersData.map(item => ({
            id: item.id,
            name: item.name,
            logo: item.logo_url || '',
            url: item.website_url
          })));
        }

        // Fetch tenders data
        console.log('Fetching tenders data...');
        const { data: tendersData, error: tendersError } = await supabase
          .from('tenders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (tendersError) {
          console.error('Error fetching tenders:', tendersError);
          throw tendersError;
        }
        
        if (tendersData) {
          console.log(`Fetched ${tendersData.length} tenders`);
          setTenders(tendersData);
        }

      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: "Ошибка загрузки данных",
          description: "Проверьте подключение к интернету или попробуйте позже",
          variant: "destructive"
        });
      }
    }

    fetchInitialData();
  }, []);

  const addNews = async (newsItem: Omit<NewsItem, 'id'>) => {
    try {
      if (!newsItem.title || !newsItem.excerpt || !newsItem.content) {
        toast({
          title: "Ошибка валидации",
          description: "Пожалуйста, заполните все обязательные поля",
          variant: "destructive"
        });
        return Promise.reject(new Error("Не все обязательные поля заполнены"));
      }
      
      const formattedDate = safelyFormatDate(newsItem.date || new Date().toISOString());
      
      if (newsItem.image_url) {
        const mainImageValid = await validateImageUrl(newsItem.image_url);
        if (!mainImageValid) {
          toast({
            title: "Предупреждение",
            description: "Главное изображение может быть недоступно",
          });
        }
      }
      
      const filteredAdditionalImages = (newsItem.additional_images || []).filter(url => url);
      
      console.log('Adding news item with formatted date:', formattedDate);
      const { data, error } = await supabase
        .from('news')
        .insert({
          title: newsItem.title,
          summary: newsItem.excerpt,
          content: newsItem.content,
          image_url: newsItem.image_url || null,
          additional_images: filteredAdditionalImages.length > 0 ? filteredAdditionalImages : null,
          featured: newsItem.featured || false,
          published_at: formattedDate
        })
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        const newItem: NewsItem = {
          id: data[0].id,
          title: data[0].title,
          date: data[0].published_at,
          excerpt: data[0].summary,
          content: data[0].content,
          image_url: data[0].image_url || '',
          additional_images: data[0].additional_images || [],
          featured: data[0].featured || false
        };
        setNews(prev => [newItem, ...prev]);
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error adding news:', error);
      toast({
        title: "Ошибка сохранения",
        description: `Не удалось сохранить новость: ${error.message || "Неизвестная ошибка"}`,
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  const updateNews = async (id: string, newsItem: Omit<NewsItem, 'id'>) => {
    try {
      if (!newsItem.title || !newsItem.excerpt || !newsItem.content) {
        toast({
          title: "Ошибка валидации",
          description: "Пожалуйста, заполните все обязательные поля",
          variant: "destructive"
        });
        return Promise.reject(new Error("Не все обязательные поля заполнены"));
      }
      
      const formattedDate = safelyFormatDate(newsItem.date || new Date().toISOString());
      
      const filteredAdditionalImages = (newsItem.additional_images || []).filter(url => url);
      
      console.log('Updating news item:', id, 'with formatted date:', formattedDate);
      const { error } = await supabase
        .from('news')
        .update({
          title: newsItem.title,
          summary: newsItem.excerpt,
          content: newsItem.content,
          image_url: newsItem.image_url || null,
          additional_images: filteredAdditionalImages.length > 0 ? filteredAdditionalImages : null,
          featured: newsItem.featured || false,
          published_at: formattedDate
        })
        .eq('id', id);

      if (error) throw error;
      
      setNews(prev => 
        prev.map(item => 
          item.id === id 
            ? { 
                ...item,
                title: newsItem.title,
                date: formattedDate,
                excerpt: newsItem.excerpt,
                content: newsItem.content,
                image_url: newsItem.image_url,
                additional_images: filteredAdditionalImages,
                featured: newsItem.featured || false
              } 
            : item
        )
      );
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error updating news:', error);
      toast({
        title: "Ошибка обновления",
        description: `Не удалось обновить новость: ${error.message || "Неизвестная ошибка"}`,
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  const deleteNews = async (id: string) => {
    try {
      console.log('Deleting news item:', id);
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setNews(prev => prev.filter(item => item.id !== id));
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error deleting news:', error);
      toast({
        title: "Ошибка удаления",
        description: `Не удалось удалить новость: ${error.message || "Неизвестная ошибка"}`,
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  const addVacancy = async (vacancyItem: Omit<VacancyItem, 'id'>) => {
    try {
      console.log('Adding vacancy:', vacancyItem);
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding vacancy:', error);
      return Promise.reject(error);
    }
  };

  const updateVacancy = async (id: string, vacancyItem: Omit<VacancyItem, 'id'>) => {
    try {
      console.log('Updating vacancy:', id, vacancyItem);
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating vacancy:', error);
      return Promise.reject(error);
    }
  };

  const deleteVacancy = async (id: string) => {
    try {
      console.log('Deleting vacancy:', id);
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      return Promise.reject(error);
    }
  };

  const addMessage = async (messageItem: Omit<MessageItem, 'id' | 'date' | 'read'>) => {
    try {
      console.log('Adding message:', messageItem);
      const { data, error } = await supabase
        .from('messages')
        .insert({
          name: messageItem.name,
          email: messageItem.email,
          message: messageItem.message,
          read: false
        })
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        const newItem: MessageItem = {
          id: data[0].id,
          name: data[0].name,
          email: data[0].email,
          message: data[0].message,
          date: data[0].created_at,
          read: false
        };
        setMessages(prev => [newItem, ...prev]);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding message:', error);
      return Promise.reject(error);
    }
  };

  const updateMessage = async (id: string, messageItem: Partial<MessageItem>) => {
    try {
      console.log('Updating message:', id, messageItem);
      const updates: any = {};
      if (messageItem.name) updates.name = messageItem.name;
      if (messageItem.email) updates.email = messageItem.email;
      if (messageItem.message) updates.message = messageItem.message;
      if (messageItem.read !== undefined) updates.read = messageItem.read;

      const { error } = await supabase
        .from('messages')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setMessages(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...messageItem } 
            : item
        )
      );
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating message:', error);
      return Promise.reject(error);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      console.log('Deleting message:', id);
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMessages(prev => prev.filter(item => item.id !== id));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting message:', error);
      return Promise.reject(error);
    }
  };

  const markMessageAsRead = async (id: string) => {
    try {
      return updateMessage(id, { read: true });
    } catch (error) {
      console.error('Error marking message as read:', error);
      return Promise.reject(error);
    }
  };

  const addPartner = async (partnerItem: Omit<PartnerItem, 'id'>) => {
    try {
      console.log('Adding partner:', partnerItem);
      const { data, error } = await supabase
        .from('partners')
        .insert({
          name: partnerItem.name,
          logo_url: partnerItem.logo,
          website_url: partnerItem.url
        })
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        const newItem: PartnerItem = {
          id: data[0].id,
          name: data[0].name,
          logo: data[0].logo_url || '',
          url: data[0].website_url
        };
        setPartners(prev => [...prev, newItem]);
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding partner:', error);
      return Promise.reject(error);
    }
  };

  const updatePartner = async (id: string, partnerItem: Omit<PartnerItem, 'id'>) => {
    try {
      console.log('Updating partner:', id, partnerItem);
      const { error } = await supabase
        .from('partners')
        .update({
          name: partnerItem.name,
          logo_url: partnerItem.logo,
          website_url: partnerItem.url
        })
        .eq('id', id);

      if (error) throw error;
      
      setPartners(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...partnerItem, id } 
            : item
        )
      );
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating partner:', error);
      return Promise.reject(error);
    }
  };

  const deletePartner = async (id: string) => {
    try {
      console.log('Deleting partner:', id);
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPartners(prev => prev.filter(item => item.id !== id));
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting partner:', error);
      return Promise.reject(error);
    }
  };

  const addTender = async (tender: Omit<Tender, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding tender:', tender);
      const { data, error } = await supabase
        .from('tenders')
        .insert({
          ...tender,
          deadline: tender.deadline ? new Date(tender.deadline).toISOString() : null
        })
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setTenders(prev => [data[0], ...prev]);
      }
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error adding tender:', error);
      toast({
        title: "Ошибка сохранения",
        description: `Не удалось сохранить тендер: ${error.message || "Неизвестная ошибка"}`,
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  const updateTender = async (id: string, tender: Partial<Omit<Tender, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      console.log('Updating tender:', id, tender);
      
      const updates: any = { ...tender };
      if (tender.deadline) {
        updates.deadline = new Date(tender.deadline).toISOString();
      }
      
      const { error } = await supabase
        .from('tenders')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setTenders(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, ...tender } 
            : item
        )
      );
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error updating tender:', error);
      toast({
        title: "Ошибка обновления",
        description: `Не удалось обновить тендер: ${error.message || "Неизвестная ошибка"}`,
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  const deleteTender = async (id: string) => {
    try {
      console.log('Deleting tender:', id);
      const { error } = await supabase
        .from('tenders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTenders(prev => prev.filter(item => item.id !== id));
      
      return Promise.resolve();
    } catch (error: any) {
      console.error('Error deleting tender:', error);
      toast({
        title: "Ошибка удаления",
        description: `Не удалось удалить тендер: ${error.message || "Неизвестная ошибка"}`,
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  return (
    <AdminDataContext.Provider value={{ 
      news, 
      vacancies, 
      messages, 
      partners,
      tenders,
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
      deletePartner,
      addTender,
      updateTender,
      deleteTender
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};
