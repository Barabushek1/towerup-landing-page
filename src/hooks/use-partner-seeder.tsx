
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Partner {
  name: string;
  logo_url: string;
  website_url: string;
}

export function usePartnerSeeder(initialRun = true) {
  useEffect(() => {
    if (!initialRun) return;

    const seedPartnersIfNeeded = async () => {
      try {
        console.log("Checking if partners need to be seeded...");
        
        // Check if we have any partners already
        const { count, error } = await supabase
          .from('partners')
          .select('*', { count: 'exact', head: true });
          
        if (error) {
          console.error("Error checking partners:", error);
          return;
        }
        
        if ((count || 0) > 0) {
          console.log(`Found ${count} existing partners, no need to seed.`);
          return;
        }
        
        console.log("No partners found. Seeding initial partners...");
        
        // Define our partners with the uploaded images
        const partners: Partner[] = [
          { 
            name: "Artel", 
            logo_url: "/lovable-uploads/1c246c6e-e1e3-4bda-ba7c-d5bf3d2ce672.png", 
            website_url: "https://artel.uz" 
          },
          { 
            name: "Grand Road Tashkent", 
            logo_url: "/lovable-uploads/2fa6915f-aa2a-42b2-8dea-fa62dd2dcced.png", 
            website_url: "https://grandroad.uz" 
          },
          { 
            name: "Imzo Akfa", 
            logo_url: "/lovable-uploads/d77d0484-1156-444d-9ae0-5e9ae4333f85.png", 
            website_url: "https://akfa.uz" 
          },
          { 
            name: "Ipoteka Bank", 
            logo_url: "/lovable-uploads/2e9eec02-a548-4df3-8403-4176c16680c9.png", 
            website_url: "https://ipotekabank.uz" 
          },
          { 
            name: "KFC", 
            logo_url: "/lovable-uploads/79c6d08b-3c0f-498e-a6dd-8e575692ec48.png", 
            website_url: "https://kfc.uz" 
          },
          { 
            name: "Navien", 
            logo_url: "/lovable-uploads/1ccda16a-19d1-4757-b978-ff6f74ff4266.png", 
            website_url: "https://navien.ru" 
          }
        ];
        
        // Insert all partners
        const { error: insertError } = await supabase
          .from('partners')
          .insert(partners);
          
        if (insertError) {
          console.error("Error seeding partners:", insertError);
        } else {
          console.log("Successfully seeded partners:", partners.length);
        }
      } catch (err) {
        console.error("Unexpected error during partner seeding:", err);
      }
    };
    
    seedPartnersIfNeeded();
  }, [initialRun]);
}
