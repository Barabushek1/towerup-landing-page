
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

interface RequestBody {
  email: string;
  password: string;
  action?: 'login' | 'signup';
  name?: string;
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
    const { 
      email, 
      password, 
      action = 'login',
      name 
    } = await req.json() as RequestBody;
    
    // Create a Supabase client with the project URL and service_role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    if (action === 'signup') {
      // Check if email already exists
      const { data: existingUser, error: existingUserError } = await supabaseClient
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .single();
      
      if (existingUserError && existingUserError.code !== 'PGRST116') {
        throw existingUserError;
      }
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Insert new admin user
      const { data: newUser, error: insertError } = await supabaseClient
        .from('admin_users')
        .insert({
          email,
          name: name || email.split('@')[0],
          password_hash: supabaseClient.auth.admin
            .hashPassword(password)
        })
        .select();
      
      if (insertError) throw insertError;
      
      return new Response(
        JSON.stringify(newUser),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 200 
        }
      );
    }
    
    // Login action
    try {
      const { data, error } = await supabaseClient
        .rpc('verify_admin_credentials', {
          p_email: email,
          p_password: password
        });
      
      if (error) {
        console.error('RPC Function error:', error);
        throw error;
      }
      
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
      console.error('Login failed:', rpcError);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Error in verify-admin-credentials function:', error);
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
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
