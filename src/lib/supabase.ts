import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Demo mode when Supabase is not configured or connection fails
export const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined';

// Create client only if credentials are present
export const supabase = isDemoMode 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = !isDemoMode && supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
