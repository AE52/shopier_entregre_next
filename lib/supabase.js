import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export async function signUpWithEmail(email, password, fullName) {
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    }, {
      data: { full_name: fullName },
    });
  
    return { user, error };
  }
  