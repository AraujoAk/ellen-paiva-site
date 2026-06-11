-- CMS 16.0 - Publicacao automatica agendada.
-- Executar manualmente no Supabase SQL Editor somente se quiser otimizar a consulta da Edge Function.
-- O schema atual ja suporta a publicacao agendada usando:
-- status = 'inactive'
-- published_at <= now()
-- update para status = 'active'

-- Status esperados no schema atual:
-- active   = publicado
-- inactive = rascunho/planejado
-- archived = arquivado

create index if not exists magazine_posts_scheduled_publish_idx
  on public.magazine_posts (status, published_at)
  where status = 'inactive'
    and published_at is not null;

-- Validar posts que seriam publicados agora:
select id, title, status, published_at
from public.magazine_posts
where status = 'inactive'
  and published_at is not null
  and published_at <= now()
order by published_at asc;

-- Simular manualmente a publicacao de posts vencidos, se necessario:
-- update public.magazine_posts
-- set status = 'active',
--     updated_at = now()
-- where status = 'inactive'
--   and published_at is not null
--   and published_at <= now()
-- returning id, title, status, published_at;
