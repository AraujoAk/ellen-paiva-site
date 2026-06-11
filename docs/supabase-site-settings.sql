-- CMS 15.4 — Configuracoes basicas da marca no Admin
-- Executar manualmente no Supabase SQL Editor.
-- Este script cria uma tabela de registro unico para dados basicos da marca/site.

create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  id smallint primary key default 1,
  brand_name text,
  owner_name text,
  instagram_url text,
  whatsapp_url text,
  tendencia_url text,
  contact_email text,
  signature_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1),
  constraint site_settings_contact_email_format_check
    check (
      contact_email is null
      or contact_email = ''
      or contact_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    )
);

create or replace function public.set_site_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_site_settings_updated_at on public.site_settings;

create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_site_settings_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_admin_select" on public.site_settings;
drop policy if exists "site_settings_admin_insert" on public.site_settings;
drop policy if exists "site_settings_admin_update" on public.site_settings;

create policy "site_settings_admin_select"
on public.site_settings
for select
to authenticated
using (public.is_admin());

create policy "site_settings_admin_insert"
on public.site_settings
for insert
to authenticated
with check (
  id = 1
  and public.is_admin()
);

create policy "site_settings_admin_update"
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (
  id = 1
  and public.is_admin()
);

insert into public.site_settings (
  id,
  brand_name,
  owner_name,
  instagram_url,
  whatsapp_url,
  tendencia_url,
  contact_email,
  signature_text
)
values (
  1,
  'Ellen Paiva',
  'Ellen Paiva',
  '',
  '',
  '',
  '',
  ''
)
on conflict (id) do nothing;

-- Validacao apos execucao:
-- select *
-- from public.site_settings
-- where id = 1;
