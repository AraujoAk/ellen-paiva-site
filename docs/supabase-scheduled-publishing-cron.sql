-- CMS 16.0.2 - Cron para invocar a Edge Function de publicacao agendada.
-- Executar manualmente no Supabase SQL Editor apos deploy da function.
-- Versao sem extensao de cofre/segredos.
--
-- Requer:
-- - pg_cron
-- - pg_net
--
-- Nao usa chave privilegiada neste SQL.
-- A chamada usa publishable key + x-scheduled-publishing-secret.
-- A publicacao em si e feita somente dentro da Edge Function.

create extension if not exists pg_cron;
create extension if not exists pg_net;

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
      url := 'https://ouyvjwnvlxqhdwnpycmt.supabase.co/functions/v1/publish-scheduled-posts',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer sb_publishable_MmvTocWqTyV1g6mwatUTKg_g4dCPnWm',
        'x-scheduled-publishing-secret', 'EllenPublish2026!Agenda#Auto'
      ),
      body := jsonb_build_object(
        'source', 'supabase-cron'
      )
    ) as request_id;
  $$
);

-- Validacao:
-- select jobid, jobname, schedule, active
-- from cron.job
-- where jobname = 'publish-scheduled-posts-every-5-minutes';
