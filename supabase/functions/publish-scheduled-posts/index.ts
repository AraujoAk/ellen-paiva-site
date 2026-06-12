import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type ScheduledPost = {
  id: string;
  title: string;
  category: string | null;
  status: string;
  published_at: string | null;
};

Deno.serve(async (request) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const scheduledPublishSecret = Deno.env.get('SCHEDULED_PUBLISH_SECRET');
  const requestStartedAt = new Date().toISOString();

  if (!supabaseUrl || !serviceRoleKey || !scheduledPublishSecret) {
    console.error('[scheduled-publishing] missing_env', {
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasServiceRoleKey: Boolean(serviceRoleKey),
      hasScheduledPublishSecret: Boolean(scheduledPublishSecret),
    });

    return Response.json(
      {
        ok: false,
        requestAuthorized: false,
        checked_at: requestStartedAt,
        error:
          'SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e SCHEDULED_PUBLISH_SECRET precisam estar configuradas na Edge Function.',
      },
      { status: 500 },
    );
  }

  const requestSecret = request.headers.get('x-scheduled-publishing-secret');
  const requestAuthorized = requestSecret === scheduledPublishSecret;

  if (!requestAuthorized) {
    console.warn('[scheduled-publishing] unauthorized_request', {
      requestAuthorized,
      hasRequestSecret: Boolean(requestSecret),
      checkedAt: requestStartedAt,
    });

    return Response.json(
      {
        ok: false,
        requestAuthorized,
        checked_at: requestStartedAt,
        error: 'Chamada nao autorizada.',
      },
      { status: 401 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const now = new Date().toISOString();

  const { data: scheduledPosts, error: selectError } = await supabase
    .from('magazine_posts')
    .select('id, title, category, status, published_at')
    .eq('status', 'inactive')
    .not('published_at', 'is', null)
    .lte('published_at', now)
    .order('published_at', { ascending: true });

  if (selectError) {
    console.error('[scheduled-publishing] select_error', {
      requestAuthorized,
      checkedAt: now,
      error: selectError.message,
    });

    return Response.json(
      {
        ok: false,
        requestAuthorized,
        stage: 'select_scheduled_posts',
        checked_at: now,
        error: selectError.message,
      },
      { status: 500 },
    );
  }

  const posts = (scheduledPosts ?? []) as ScheduledPost[];
  const candidateIds = posts.map((post) => post.id);

  console.log('[scheduled-publishing] candidates_checked', {
    requestAuthorized,
    checkedAt: now,
    candidatesFound: posts.length,
    candidateIds,
  });

  if (!posts.length) {
    return Response.json({
      ok: true,
      requestAuthorized,
      published: 0,
      candidates: 0,
      candidateIds: [],
      updatedIds: [],
      checked_at: now,
      message: 'Nenhum post agendado para publicar agora.',
    });
  }

  const { data: updatedPosts, error: updateError } = await supabase
    .from('magazine_posts')
    .update({
      status: 'active',
      updated_at: now,
    })
    .in('id', candidateIds)
    .select('id, title, category, status, published_at');

  if (updateError) {
    console.error('[scheduled-publishing] update_error', {
      requestAuthorized,
      checkedAt: now,
      candidatesFound: posts.length,
      candidateIds,
      error: updateError.message,
    });

    return Response.json(
      {
        ok: false,
        requestAuthorized,
        stage: 'publish_scheduled_posts',
        checked_at: now,
        candidates: posts.length,
        candidateIds,
        updatedIds: [],
        error: updateError.message,
      },
      { status: 500 },
    );
  }

  const publishedPosts = (updatedPosts ?? []) as ScheduledPost[];
  const updatedIds = publishedPosts.map((post) => post.id);

  const { error: activityError } = await supabase.from('activity_logs').insert(
    publishedPosts.map((post) => ({
      actor_id: null,
      actor_name: 'Publicacao automatica',
      actor_email: null,
      action: 'post_auto_published',
      entity_type: 'magazine_post',
      entity_id: post.id,
      entity_title: post.title,
      metadata: {
        category: post.category,
        published_at: post.published_at,
        scheduled_runner: 'publish-scheduled-posts',
      },
    })),
  );

  if (activityError) {
    console.warn('[scheduled-publishing] activity_log_unavailable', {
      checkedAt: now,
      error: activityError.message,
    });
  }

  console.log('[scheduled-publishing] publish_result', {
    requestAuthorized,
    checkedAt: now,
    candidatesFound: posts.length,
    candidateIds,
    publishedCount: publishedPosts.length,
    updatedIds,
    activityLog: activityError ? 'indisponivel' : 'registrado',
  });

  return Response.json({
    ok: true,
    requestAuthorized,
    published: publishedPosts.length,
    candidates: posts.length,
    candidateIds,
    updatedIds,
    checked_at: now,
    message:
      publishedPosts.length > 0
        ? 'Posts agendados publicados com sucesso.'
        : 'Nenhum post foi atualizado.',
    published_posts: publishedPosts.map((post) => ({
      id: post.id,
      title: post.title,
      published_at: post.published_at,
    })),
    activity_log: activityError ? 'indisponivel' : 'registrado',
    activity_log_error: activityError?.message ?? null,
  });
});
