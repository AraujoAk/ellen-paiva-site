-- CMS 16.0 - Cron para invocar a Edge Function de publicacao agendada.
-- Executar manualmente no Supabase SQL Editor apos deploy da function.
-- Substitua os placeholders antes de executar.
--
-- Requer:
-- - pg_cron
-- - pg_net
-- - Supabase Vault
--
-- A chamada usa a publishable/anon key para autenticar a invocacao da Edge Function
-- e um segredo proprio em x-scheduled-publishing-secret para impedir acionamento publico.
-- A publicacao em si usa service role somente dentro da Edge Function.

create extension if not exists pg_cron;
create extension if not exists pg_net;
create extension if not exists vault with schema vault;

-- Rode apenas uma vez ou atualize os secrets existentes no Vault.
select vault.create_secret(
  'https://SEU-PROJECT-REF.supabase.co',
  'scheduled_publishing_project_url'
);

select vault.create_secret(
  'SUA_PUBLISHABLE_OU_ANON_KEY',
  'scheduled_publishing_publishable_key'
);

select vault.create_secret(
  'CRIE_UM_SEGREDO_FORTE_AQUI',
  'scheduled_publishing_invocation_secret'
);

-- Evita duplicar o job se ele ja existir.
select cron.unschedule('publish-scheduled-posts-every-5-minutes')
where exists (
  select 1
  from cron.job
  where jobname = 'publish-scheduled-posts-every-5-minutes'
);

select cron.schedule(
  'publish-scheduled-posts-every-5-minutes',
  '*/5 * * * *',
  $$
  select
    net.http_post(
      url := (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'scheduled_publishing_project_url'
      ) || '/functions/v1/publish-scheduled-posts',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'scheduled_publishing_publishable_key'
        ),
        'x-scheduled-publishing-secret', (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'scheduled_publishing_invocation_secret'
        )
      ),
      body := jsonb_build_object(
        'source', 'pg_cron',
        'scheduled_at', now()
      )
    ) as request_id;
  $$
);

-- Validacao:
-- select jobid, jobname, schedule, active
-- from cron.job
-- where jobname = 'publish-scheduled-posts-every-5-minutes';
