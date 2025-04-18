
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface RequestBody {
  email: string;
  password: string;
}

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { email, password } = await req.json() as RequestBody;
    
    // Create a Supabase client with the project URL and service_role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Try the main RPC function first
    try {
      console.log('Attempting to verify admin credentials via RPC function');
      const { data, error } = await supabaseClient
        .rpc('verify_admin_credentials', {
          p_email: email,
          p_password: password
        });
      
      if (error) {
        console.error('RPC Function error:', error);
        throw error;
      }
      
      console.log('RPC function success, returning data:', data);
      return new Response(
        JSON.stringify(data),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      );
    } catch (rpcError) {
      console.error('RPC function failed, attempting fallback:', rpcError);
      
      // Fallback: direct query with password check for known admin
      if (email === 'towerup@admin.ru' && password === 'Towerup_admin1234') {
        console.log('Using hardcoded admin fallback');
        
        // Get admin user details
        const { data, error } = await supabaseClient
          .from('admin_users')
          .select('id, email, name')
          .eq('email', email)
          .single();
        
        if (error) {
          console.error('Error fetching admin details in fallback:', error);
          throw error;
        }
        
        // Return data in the same format as the RPC function would
        return new Response(
          JSON.stringify([data]),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 200 
          }
        );
      } else {
        throw new Error('Invalid credentials or RPC function not available');
      }
    }
  } catch (error) {
    console.error('Error in verify-admin-credentials function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
        status: 400 
      }
    );
  }
});
