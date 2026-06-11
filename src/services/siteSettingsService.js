import { getSupabaseClient } from '../lib/supabase.js';

export const emptySiteSettings = {
  brand_name: '',
  owner_name: '',
  instagram_url: '',
  whatsapp_url: '',
  tendencia_url: '',
  contact_email: '',
  signature_text: '',
};

const siteSettingsFields =
  'id, brand_name, owner_name, instagram_url, whatsapp_url, tendencia_url, contact_email, signature_text, created_at, updated_at';

function isMissingSettingsTable(error) {
  const message = error?.message || String(error || '');
  return /site_settings|schema cache|relation .* does not exist|could not find the table/i.test(message);
}

function normalizeSettings(settings) {
  return {
    ...emptySiteSettings,
    ...(settings || {}),
  };
}

function sanitizeSettings(settings) {
  return {
    id: 1,
    brand_name: settings.brand_name?.trim() || null,
    owner_name: settings.owner_name?.trim() || null,
    instagram_url: settings.instagram_url?.trim() || null,
    whatsapp_url: settings.whatsapp_url?.trim() || null,
    tendencia_url: settings.tendencia_url?.trim() || null,
    contact_email: settings.contact_email?.trim() || null,
    signature_text: settings.signature_text?.trim() || null,
  };
}

export async function getSiteSettings() {
  const client = await getSupabaseClient();

  if (!client) {
    return {
      data: emptySiteSettings,
      isMissingTable: true,
      error: 'Supabase nao configurado.',
    };
  }

  const { data, error } = await client
    .from('site_settings')
    .select(siteSettingsFields)
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    return {
      data: emptySiteSettings,
      isMissingTable: isMissingSettingsTable(error),
      error: error.message,
    };
  }

  return {
    data: normalizeSettings(data),
    isMissingTable: false,
    error: null,
  };
}

export async function saveSiteSettings(settings) {
  const client = await getSupabaseClient();

  if (!client) {
    throw new Error('Supabase nao configurado.');
  }

  const { data, error } = await client
    .from('site_settings')
    .upsert(sanitizeSettings(settings), { onConflict: 'id' })
    .select(siteSettingsFields)
    .single();

  if (error) {
    if (isMissingSettingsTable(error)) {
      throw new Error('Configuracoes ainda nao ativadas. Execute o SQL indicado no Supabase.');
    }

    throw new Error(error.message || 'Nao foi possivel salvar as configuracoes.');
  }

  return normalizeSettings(data);
}
