import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { createHash } from 'https://deno.land/std@0.177.0/node/crypto.ts';

interface RequestBody {
  email: string;
  password: string;
  action?: 'login' | 'signup';
  name?: string;
}

// Simple password hashing function that doesn't rely on bcrypt
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const newSalt = salt || crypto.randomUUID().replace(/-/g, '');
  const hash = createHash('sha256')
    .update(password + newSalt)
    .digest('hex');
  return { hash, salt: newSalt };
}

// Verify a password against a stored hash
function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  return hash === storedHash;
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
      
      try {
        // Hash the password with our custom function
        const { hash: hashedPassword, salt } = hashPassword(password);
        
        // Insert new admin user with the hash and salt
        const { data: newUser, error: insertError } = await supabaseClient
          .from('admin_users')
          .insert({
            email,
            name: name || email.split('@')[0],
            password_hash: `${salt}:${hashedPassword}` // Store both salt and hash
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
      } catch (error) {
        console.error('Password hashing error:', error);
        return new Response(
          JSON.stringify({ error: 'Password hashing failed' }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 500 
          }
        );
      }
    }
    
    // Login action
    try {
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
      
      try {
        // Parse stored password hash and salt
        const [salt, storedHash] = userData.password_hash.split(':');
        
        // Compare the provided password with the stored hash
        const passwordMatches = storedHash ? 
          verifyPassword(password, storedHash, salt) : 
          false;
        
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
      } catch (verifyError) {
        console.error('Password verification error:', verifyError);
        return new Response(
          JSON.stringify({ error: 'Password verification failed' }),
          { 
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            },
            status: 500 
          }
        );
      }
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
