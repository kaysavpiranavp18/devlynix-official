import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = () =>
  !!(supabaseUrl && !supabaseUrl.includes('REPLACE_ME') &&
     supabaseAnonKey && !supabaseAnonKey.includes('REPLACE_ME'));

// Anon client — works without JWT template, relies on RLS being disabled or permissive
export const getSupabaseClient = () => {
  if (!isConfigured()) throw new Error('Supabase env vars not set');
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storageKey: 'supabase-anon-default',
    }
  });
};

// Authenticated client using Clerk JWT — requires JWT template named "supabase" in Clerk dashboard
export const createClerkSupabaseClient = (clerkToken: string) => {
  if (!isConfigured()) throw new Error('Supabase env vars not set');
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storageKey: `supabase-clerk-${Math.random().toString(36).substring(2, 11)}`,
    },
    global: {
      headers: { Authorization: `Bearer ${clerkToken}` }
    }
  });
};

// Anon client for use when JWT template isn't set up yet
export const getAnonSupabaseClient = () => {
  if (!isConfigured()) throw new Error('Supabase env vars not set');
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      storageKey: 'supabase-anon-secondary',
    }
  });
};

export const supabaseConfigured = isConfigured;
