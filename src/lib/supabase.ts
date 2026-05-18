import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = () =>
  !!(supabaseUrl && !supabaseUrl.includes('REPLACE_ME') &&
     supabaseAnonKey && !supabaseAnonKey.includes('REPLACE_ME'));

// Anon client — works without JWT template, relies on RLS being disabled or permissive
export const getSupabaseClient = () => {
  if (!isConfigured()) throw new Error('Supabase env vars not set');
  return createClient(supabaseUrl!, supabaseAnonKey!);
};

// Authenticated client using Clerk JWT — requires JWT template named "supabase" in Clerk dashboard
export const createClerkSupabaseClient = (clerkToken: string) => {
  if (!isConfigured()) throw new Error('Supabase env vars not set');
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    global: {
      headers: { Authorization: `Bearer ${clerkToken}` }
    }
  });
};

// Anon client for use when JWT template isn't set up yet
export const getAnonSupabaseClient = () => {
  if (!isConfigured()) throw new Error('Supabase env vars not set');
  return createClient(supabaseUrl!, supabaseAnonKey!);
};

export const supabaseConfigured = isConfigured;
