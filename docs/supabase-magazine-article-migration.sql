-- Fase CMS 10 — Artigos individuais e SEO editorial.
-- Executar no Supabase SQL Editor antes de publicar rotas /revista/:slug em producao.

create extension if not exists unaccent;

alter table public.magazine_posts
  add column if not exists slug text,
  add column if not exists content text;

-- Gera slugs baseados no titulo para posts antigos.
with base_slugs as (
  select
    id,
    regexp_replace(
      regexp_replace(
        lower(unaccent(title)),
        '[^a-z0-9]+',
        '-',
        'g'
      ),
      '(^-|-$)',
      '',
      'g'
    ) as base_slug
  from public.magazine_posts
),
numbered as (
  select
    id,
    base_slug,
    row_number() over (partition by base_slug order by id) as position
  from base_slugs
)
update public.magazine_posts posts
set slug = case
    when numbered.position = 1 then numbered.base_slug
    else numbered.base_slug || '-' || numbered.position
  end
from numbered
where posts.id = numbered.id
  and (posts.slug is null or posts.slug = '');

update public.magazine_posts
set content = description
where content is null or trim(content) = '';

alter table public.magazine_posts
  alter column slug set not null,
  alter column content set not null;

create unique index if not exists magazine_posts_slug_unique_idx
  on public.magazine_posts (slug);

create index if not exists magazine_posts_slug_status_idx
  on public.magazine_posts (slug, status);

alter table public.magazine_posts
  drop constraint if exists magazine_posts_slug_format_check;

alter table public.magazine_posts
  add constraint magazine_posts_slug_format_check
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

alter table public.magazine_posts
  drop constraint if exists magazine_posts_content_length_check;

alter table public.magazine_posts
  add constraint magazine_posts_content_length_check
  check (char_length(content) between 10 and 12000);

-- Validacao sugerida:
-- select id, title, slug, status
-- from public.magazine_posts
-- order by title asc;
