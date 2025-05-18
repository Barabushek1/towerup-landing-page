
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { needsSeedingCheck } from '@/utils/cache-utils';

export function useYangiUzbekistanApartmentsSeeder(initialRun = true) {
  useEffect(() => {
    // Skip if not initial run or already checked in this session
    if (!initialRun || !needsSeedingCheck('yangi_uzbekistan_apartments')) return;

    const seedApartmentsIfNeeded = async () => {
      try {
        console.log("Checking if Yangi Uzbekistan apartments need to be seeded...");
        
        // Check if the table has data
        const { count, error } = await supabase
          .from('yangi_uzbekistan_apartment_units')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log("Table might not exist yet. This is expected on first run.");
          return;
        }
        
        if ((count || 0) > 0) {
          console.log(`Found ${count} existing apartment units, no need to seed.`);
          return;
        }
        
        console.log("No Yangi Uzbekistan apartments found. Seeding initial data...");
        
        // Sample apartments for the 16 floors with different room types
        const sampleApartments = [];
        
        // Generate sample apartments for each floor (1-16)
        for (let floor = 1; floor <= 16; floor++) {
          // Price increases with floor height
          const basePrice = 10000000 + (floor * 100000);
          
          // 1-room apartments
          sampleApartments.push({
            floor_number: floor,
            area: 35,
            room_count: 1,
            price_per_sqm: basePrice,
            total_price: 35 * basePrice,
            initial_payment_30p: Math.round(35 * basePrice * 0.3),
            monthly_payment_8mo_30p: Math.round((35 * basePrice * 0.3) / 8),
            cadastre_payment_40p: Math.round(35 * basePrice * 0.4)
          });
          
          // 2-room apartments
          sampleApartments.push({
            floor_number: floor,
            area: 55,
            room_count: 2,
            price_per_sqm: basePrice - 200000, // Slightly lower price per sqm for larger apartments
            total_price: 55 * (basePrice - 200000),
            initial_payment_30p: Math.round(55 * (basePrice - 200000) * 0.3),
            monthly_payment_8mo_30p: Math.round((55 * (basePrice - 200000) * 0.3) / 8),
            cadastre_payment_40p: Math.round(55 * (basePrice - 200000) * 0.4)
          });
          
          // 3-room apartments
          sampleApartments.push({
            floor_number: floor,
            area: 75,
            room_count: 3,
            price_per_sqm: basePrice - 300000, // Even lower price per sqm for even larger apartments
            total_price: 75 * (basePrice - 300000),
            initial_payment_30p: Math.round(75 * (basePrice - 300000) * 0.3),
            monthly_payment_8mo_30p: Math.round((75 * (basePrice - 300000) * 0.3) / 8),
            cadastre_payment_40p: Math.round(75 * (basePrice - 300000) * 0.4)
          });
        }
        
        // Insert sample apartments in batches of 20 to avoid potential size limits
        for (let i = 0; i < sampleApartments.length; i += 20) {
          const batch = sampleApartments.slice(i, i + 20);
          const { error: insertError } = await supabase
            .from('yangi_uzbekistan_apartment_units')
            .insert(batch);
            
          if (insertError) {
            console.error("Error seeding apartments batch:", insertError);
            return;
          }
        }
          
        console.log("Successfully seeded Yangi Uzbekistan apartments");
      } catch (err) {
        console.error("Unexpected error during apartment seeding:", err);
      }
    };
    
    seedApartmentsIfNeeded();
  }, [initialRun]);
}
