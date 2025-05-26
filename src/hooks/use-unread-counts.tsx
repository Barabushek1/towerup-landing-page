
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

interface UnreadCounts {
  messages: number;
  vacancyApplications: number;
  tenderSubmissions: number;
  commercialOffers: number;
}

export function useUnreadCounts() {
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({
    messages: 0,
    vacancyApplications: 0,
    tenderSubmissions: 0,
    commercialOffers: 0,
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchUnreadCounts = async () => {
    try {
      console.log('Fetching unread counts...');
      
      // Fetch unread messages
      const { count: messagesCount, error: messagesError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (messagesError) {
        console.error('Error fetching unread messages:', messagesError);
      }

      // Fetch unread vacancy applications
      const { count: vacancyCount, error: vacancyError } = await supabase
        .from('vacancy_applications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (vacancyError) {
        console.error('Error fetching unread vacancy applications:', vacancyError);
      }

      // Fetch unread tender applications (using tender_applications table)
      const { count: tenderCount, error: tenderError } = await supabase
        .from('tender_applications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (tenderError) {
        console.error('Error fetching unread tender applications:', tenderError);
      }

      // Fetch unread commercial offers
      const { count: commercialCount, error: commercialError } = await supabase
        .from('commercial_offers')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (commercialError) {
        console.error('Error fetching unread commercial offers:', commercialError);
      }

      setUnreadCounts({
        messages: messagesCount || 0,
        vacancyApplications: vacancyCount || 0,
        tenderSubmissions: tenderCount || 0,
        commercialOffers: commercialCount || 0,
      });

      console.log('Unread counts updated:', {
        messages: messagesCount || 0,
        vacancyApplications: vacancyCount || 0,
        tenderSubmissions: tenderCount || 0,
        commercialOffers: commercialCount || 0,
      });
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark section as read when visiting the page
  const markSectionAsRead = async (section: keyof UnreadCounts) => {
    try {
      let tableName = '';
      switch (section) {
        case 'messages':
          tableName = 'messages';
          break;
        case 'vacancyApplications':
          tableName = 'vacancy_applications';
          break;
        case 'tenderSubmissions':
          tableName = 'tender_applications';
          break;
        case 'commercialOffers':
          tableName = 'commercial_offers';
          break;
      }

      if (tableName) {
        const { error } = await supabase
          .from(tableName as any)
          .update({ read: true })
          .eq('read', false);

        if (error) {
          console.error(`Error marking ${section} as read:`, error);
        } else {
          console.log(`Marked all ${section} as read`);
          setUnreadCounts(prev => ({ ...prev, [section]: 0 }));
        }
      }
    } catch (error) {
      console.error(`Error marking ${section} as read:`, error);
    }
  };

  useEffect(() => {
    fetchUnreadCounts();

    // Set up real-time subscriptions for each table
    const messagesSubscription = supabase
      .channel('messages_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages' },
        () => fetchUnreadCounts()
      )
      .subscribe();

    const vacancySubscription = supabase
      .channel('vacancy_applications_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vacancy_applications' },
        () => fetchUnreadCounts()
      )
      .subscribe();

    const tenderSubscription = supabase
      .channel('tender_applications_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tender_applications' },
        () => fetchUnreadCounts()
      )
      .subscribe();

    const commercialSubscription = supabase
      .channel('commercial_offers_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'commercial_offers' },
        () => fetchUnreadCounts()
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      vacancySubscription.unsubscribe();
      tenderSubscription.unsubscribe();
      commercialSubscription.unsubscribe();
    };
  }, []);

  // Mark section as read when user visits the corresponding page
  useEffect(() => {
    if (location.pathname === '/admin/messages' && unreadCounts.messages > 0) {
      markSectionAsRead('messages');
    } else if (location.pathname === '/admin/vacancy-applications' && unreadCounts.vacancyApplications > 0) {
      markSectionAsRead('vacancyApplications');
    } else if (location.pathname === '/admin/tender-submissions' && unreadCounts.tenderSubmissions > 0) {
      markSectionAsRead('tenderSubmissions');
    } else if (location.pathname === '/admin/commercial-offers' && unreadCounts.commercialOffers > 0) {
      markSectionAsRead('commercialOffers');
    }
  }, [location.pathname, unreadCounts]);

  return { unreadCounts, loading, fetchUnreadCounts };
}
