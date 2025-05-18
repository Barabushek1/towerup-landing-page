
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { needsSeedingCheck } from '@/utils/cache-utils';

export function useYangiUzbekistanPriceSeeder(initialRun = true) {
  useEffect(() => {
    // Skip if not initial run or already checked in this session
    if (!initialRun || !needsSeedingCheck('yangi_uzbekistan_prices')) return;

    const seedPricesIfNeeded = async () => {
      try {
        console.log("Checking if Yangi Uzbekistan prices need to be seeded...");
        
        // Check if the table exists
        const { count, error } = await supabase
          .from('yangi_uzbekistan_floor_prices')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          // Table may not exist yet, create it via SQL API
          console.log("Table might not exist yet. This is expected on first run.");
          return;
        }
        
        if ((count || 0) > 0) {
          console.log(`Found ${count} existing prices, no need to seed.`);
          return;
        }
        
        console.log("No Yangi Uzbekistan prices found. Seeding initial data...");
        
        // Define our sample prices
        const samplePrices = [
          {
            apartment_type: "1-комнатная",
            price_per_sqm: 12000000
          },
          {
            apartment_type: "2-комнатная",
            price_per_sqm: 11500000
          },
          {
            apartment_type: "3-комнатная",
            price_per_sqm: 11000000
          }
        ];
        
        // Insert prices
        const { error: insertError } = await supabase
          .from('yangi_uzbekistan_floor_prices')
          .insert(samplePrices);
          
        if (insertError) {
          console.error("Error seeding prices:", insertError);
        } else {
          console.log("Successfully seeded Yangi Uzbekistan prices");
        }
      } catch (err) {
        console.error("Unexpected error during price seeding:", err);
      }
    };
    
    seedPricesIfNeeded();
  }, [initialRun]);
}
