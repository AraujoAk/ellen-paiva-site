import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';

export async function signIn(email, password) {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const client = await getSupabaseClient();

  if (!client) {
    return;
  }

  const { error } = await client.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getSession() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const client = await getSupabaseClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export async function getCurrentUser() {
  const client = await getSupabaseClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const client = await getSupabaseClient();

  const { data, error } = await client
    .from('profiles')
    .select('id, email, name, role, can_edit_magazine')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function canEditMagazine() {
  const profile = await getCurrentProfile();
  return Boolean(profile?.can_edit_magazine);
}

