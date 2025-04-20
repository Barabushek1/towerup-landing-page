
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts';

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
        return new Response(
          JSON.stringify({ error: 'Email already in use' }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 400 
          }
        );
      }
      
      // Check if we've reached the max admin count (now 2)
      const { count, error: countError } = await supabaseClient
        .from('admin_users')
        .select('*', { count: 'exact', head: true });
        
      if (countError) throw countError;
      
      if (count !== null && count >= 2) {
        return new Response(
          JSON.stringify({ error: 'Maximum number of admin users reached (2)' }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 400 
          }
        );
      }
      
      // Hash the password with bcrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Insert new admin user
      const { data: newUser, error: insertError } = await supabaseClient
        .from('admin_users')
        .insert({
          email,
          name: name || email.split('@')[0],
          password_hash: hashedPassword
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
      // For login, we'll use a modified approach since the SQL function expects a crypt-compatible hash
      // First, get the user details including the password hash
      const { data: userData, error: userError } = await supabaseClient
        .from('admin_users')
        .select('id, email, name, password_hash')
        .eq('email', email)
        .single();
        
      if (userError) {
        console.error('User lookup error:', userError);
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 401 
          }
        );
      }
      
      // Compare the provided password with the stored hash
      const passwordMatches = await bcrypt.compare(password, userData.password_hash);
      
      if (!passwordMatches) {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 401 
          }
        );
      }
      
      // If password matches, return the user data (excluding the password hash)
      const { password_hash, ...userDataWithoutPassword } = userData;
      
      return new Response(
        JSON.stringify([userDataWithoutPassword]),
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
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          },
          status: 401 
        }
      );
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
