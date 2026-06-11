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

  if (!supabaseUrl || !serviceRoleKey || !scheduledPublishSecret) {
    return Response.json(
      {
        ok: false,
        error:
          'SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e SCHEDULED_PUBLISH_SECRET precisam estar configuradas na Edge Function.',
      },
      { status: 500 },
    );
  }

  const requestSecret = request.headers.get('x-scheduled-publishing-secret');

  if (requestSecret !== scheduledPublishSecret) {
    return Response.json(
      {
        ok: false,
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
    return Response.json(
      {
        ok: false,
        stage: 'select_scheduled_posts',
        error: selectError.message,
      },
      { status: 500 },
    );
  }

  const posts = (scheduledPosts ?? []) as ScheduledPost[];

  if (!posts.length) {
    return Response.json({
      ok: true,
      published: 0,
      checked_at: now,
      message: 'Nenhum post agendado para publicar agora.',
    });
  }

  const postIds = posts.map((post) => post.id);
  const { data: updatedPosts, error: updateError } = await supabase
    .from('magazine_posts')
    .update({
      status: 'active',
      updated_at: now,
    })
    .in('id', postIds)
    .select('id, title, category, status, published_at');

  if (updateError) {
    return Response.json(
      {
        ok: false,
        stage: 'publish_scheduled_posts',
        error: updateError.message,
      },
      { status: 500 },
    );
  }

  const publishedPosts = (updatedPosts ?? []) as ScheduledPost[];

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

  return Response.json({
    ok: true,
    published: publishedPosts.length,
    checked_at: now,
    published_posts: publishedPosts.map((post) => ({
      id: post.id,
      title: post.title,
      published_at: post.published_at,
    })),
    activity_log: activityError ? 'indisponivel' : 'registrado',
    activity_log_error: activityError?.message ?? null,
  });
});
