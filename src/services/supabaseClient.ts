import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const getSupabaseClient = (): SupabaseClient => {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your local .env file.'
    );
  }

  return createClient(supabaseUrl, supabasePublishableKey);
};

export const signInAdmin = async (email: string, password: string) => {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
};

export const signOutAdmin = async (): Promise<void> => {
  const { error } = await getSupabaseClient().auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export const isAuthenticatedAdmin = async (): Promise<boolean> => {
  const client = getSupabaseClient();
  const { data: userData, error: userError } = await client.auth.getUser();

  if (userError || !userData.user) {
    return false;
  }

  const { data, error } = await client
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return Boolean(data);
};