-- Fase CMS 11 - Newsletter e captura de leads.
-- Executar manualmente no Supabase SQL Editor.
-- Este script nao altera a Revista, Auth, RLS da Revista ou estrutura de posts.

create extension if not exists pgcrypto;

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  source text not null default 'landing-newsletter',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_unique unique (email),
  constraint newsletter_subscribers_email_format_check
    check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  constraint newsletter_subscribers_status_check
    check (status in ('active', 'inactive', 'unsubscribed'))
);

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

create index if not exists newsletter_subscribers_created_at_idx
  on public.newsletter_subscribers (created_at desc);

create or replace function public.set_newsletter_subscribers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_newsletter_subscribers_updated_at on public.newsletter_subscribers;

create trigger set_newsletter_subscribers_updated_at
before update on public.newsletter_subscribers
for each row
execute function public.set_newsletter_subscribers_updated_at();

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Newsletter public insert" on public.newsletter_subscribers;
drop policy if exists "Newsletter editors can read" on public.newsletter_subscribers;
drop policy if exists "Newsletter editors can update" on public.newsletter_subscribers;

create policy "Newsletter public insert"
on public.newsletter_subscribers
for insert
to anon, authenticated
with check (
  email is not null
  and source = 'landing-newsletter'
  and status = 'active'
);

create policy "Newsletter editors can read"
on public.newsletter_subscribers
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.can_edit_magazine = true
  )
);

create policy "Newsletter editors can update"
on public.newsletter_subscribers
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.can_edit_magazine = true
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.can_edit_magazine = true
  )
);

-- Validacao apos execucao:
-- select column_name, data_type
-- from information_schema.columns
-- where table_schema = 'public'
--   and table_name = 'newsletter_subscribers'
-- order by ordinal_position;
