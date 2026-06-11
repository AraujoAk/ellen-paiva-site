import { getSupabaseClient } from '../lib/supabase.js';

const activityLogFields =
  'id, actor_id, actor_name, actor_email, action, entity_type, entity_id, entity_title, metadata, created_at';

function isMissingActivityTable(error) {
  const message = error?.message || String(error || '');
  return /activity_logs|schema cache|relation .* does not exist|could not find the table/i.test(message);
}

function normalizeLimit(limit) {
  const parsedLimit = Number(limit);

  if (!Number.isFinite(parsedLimit)) {
    return 20;
  }

  return Math.min(Math.max(parsedLimit, 1), 50);
}

export async function logActivity(payload) {
  const client = await getSupabaseClient();

  if (!client) {
    return false;
  }

  const actor = payload.actor || {};
  const logPayload = {
    actor_id: actor.id || null,
    actor_name: actor.name || actor.email || null,
    actor_email: actor.email || null,
    action: payload.action,
    entity_type: payload.entityType,
    entity_id: payload.entityId ? String(payload.entityId) : null,
    entity_title: payload.entityTitle || null,
    metadata: payload.metadata || {},
  };

  const { error } = await client.from('activity_logs').insert(logPayload);

  if (error) {
    if (import.meta.env.DEV) {
      console.warn('[activity-log] falha ao registrar atividade', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        action: payload.action,
      });
    }

    return false;
  }

  return true;
}

export async function getRecentActivityLogs(limit = 20) {
  const client = await getSupabaseClient();

  if (!client) {
    return {
      data: [],
      isMissingTable: true,
      error: 'Supabase nao configurado.',
    };
  }

  const { data, error } = await client
    .from('activity_logs')
    .select(activityLogFields)
    .order('created_at', { ascending: false })
    .limit(normalizeLimit(limit));

  if (error) {
    return {
      data: [],
      isMissingTable: isMissingActivityTable(error),
      error: error.message,
    };
  }

  return {
    data: data || [],
    isMissingTable: false,
    error: null,
  };
}
