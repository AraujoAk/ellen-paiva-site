import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase.js';

export const publicSiteSettingsFallback = {
  brand_name: 'Ellen Paiva',
  owner_name: 'Ellen Paiva',
  instagram_url: 'https://www.instagram.com/direct/t/107763033955970/',
  whatsapp_url: 'https://tr.ee/-R-sQ_hJqC',
  tendencia_url:
    'https://linktr.ee/tendenciamu?utm_source=linktree_profile_share&ltsid=a98130d2-cc29-41d4-8f87-c76c3462c011',
  contact_email: '',
  signature_text: 'Vestir bem a vida real começa por entender quem se é.',
};

const publicSiteSettingsFields =
  'brand_name, owner_name, instagram_url, whatsapp_url, tendencia_url, contact_email, signature_text';

function mergeWithFallback(settings) {
  return Object.fromEntries(
    Object.entries(publicSiteSettingsFallback).map(([key, fallbackValue]) => [
      key,
      settings?.[key] || fallbackValue,
    ]),
  );
}

export async function getSiteSettings() {
  if (!isSupabaseConfigured) {
    return publicSiteSettingsFallback;
  }

  try {
    const client = await getSupabaseClient();

    if (!client) {
      return publicSiteSettingsFallback;
    }

    const { data, error } = await client
      .from('site_settings')
      .select(publicSiteSettingsFields)
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) {
      return publicSiteSettingsFallback;
    }

    return mergeWithFallback(data);
  } catch {
    return publicSiteSettingsFallback;
  }
}
