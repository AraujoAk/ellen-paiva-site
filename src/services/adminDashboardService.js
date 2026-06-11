import { getSupabaseClient } from '../lib/supabase.js';

const newsletterFields = 'id, name, email, source, status, created_at';
const magazineDateFields = 'id, title, status, published_at, created_at, updated_at';
const activityFields = 'id, actor_name, actor_email, action, entity_title, created_at';
const siteSettingsFields =
  'brand_name, owner_name, instagram_url, whatsapp_url, tendencia_url, contact_email, signature_text';

async function safeCount(client, table, filterCallback) {
  let query = client.from(table).select('id', { count: 'exact', head: true });

  if (filterCallback) {
    query = filterCallback(query);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getNewsletterExecutiveStats() {
  const client = await getSupabaseClient();

  if (!client) {
    return {
      total: null,
      last30Days: null,
      latestSubscribers: [],
      error: 'Supabase nao configurado.',
    };
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [total, last30Days, latestResult] = await Promise.all([
      safeCount(client, 'newsletter_subscribers'),
      safeCount(client, 'newsletter_subscribers', (query) => query.gte('created_at', thirtyDaysAgo.toISOString())),
      client
        .from('newsletter_subscribers')
        .select(newsletterFields)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    if (latestResult.error) {
      throw latestResult.error;
    }

    return {
      total,
      last30Days,
      latestSubscribers: latestResult.data ?? [],
      error: null,
    };
  } catch (error) {
    return {
      total: null,
      last30Days: null,
      latestSubscribers: [],
      error: error?.message || 'Nao foi possivel carregar os dados da Newsletter.',
    };
  }
}

export async function getEditorialExecutiveDates() {
  const client = await getSupabaseClient();

  if (!client) {
    return {
      latestPublication: null,
      latestCreated: null,
      latestUpdated: null,
      nextPlanned: null,
      latestActivity: null,
      latestActivityError: null,
      siteSettings: null,
      siteSettingsError: null,
      error: 'Supabase nao configurado.',
    };
  }

  try {
    const [latestPublication, latestCreated, latestUpdated, nextPlanned, latestActivity, siteSettings] = await Promise.all([
      client
        .from('magazine_posts')
        .select(magazineDateFields)
        .eq('status', 'active')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from('magazine_posts')
        .select(magazineDateFields)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from('magazine_posts')
        .select(magazineDateFields)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from('magazine_posts')
        .select(magazineDateFields)
        .eq('status', 'inactive')
        .not('published_at', 'is', null)
        .gt('published_at', new Date().toISOString())
        .order('published_at', { ascending: true })
        .limit(1)
        .maybeSingle(),
      client
        .from('activity_logs')
        .select(activityFields)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from('site_settings')
        .select(siteSettingsFields)
        .eq('id', 1)
        .maybeSingle(),
    ]);

    const firstError = [latestPublication.error, latestCreated.error, latestUpdated.error, nextPlanned.error].find(Boolean);

    if (firstError) {
      throw firstError;
    }

    return {
      latestPublication: latestPublication.data ?? null,
      latestCreated: latestCreated.data ?? null,
      latestUpdated: latestUpdated.data ?? null,
      nextPlanned: nextPlanned.data ?? null,
      latestActivity: latestActivity.error ? null : latestActivity.data ?? null,
      latestActivityError: latestActivity.error?.message || null,
      siteSettings: siteSettings.error ? null : siteSettings.data ?? null,
      siteSettingsError: siteSettings.error?.message || null,
      error: null,
    };
  } catch (error) {
    return {
      latestPublication: null,
      latestCreated: null,
      latestUpdated: null,
      nextPlanned: null,
      latestActivity: null,
      latestActivityError: null,
      siteSettings: null,
      siteSettingsError: null,
      error: error?.message || 'Nao foi possivel carregar as datas editoriais.',
    };
  }
}
