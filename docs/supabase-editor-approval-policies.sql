-- CMS 13.0 - Politicas para aprovacao de editores no painel admin.
-- Executar manualmente no Supabase SQL Editor somente apos revisar.
-- Este script nao usa service_role e nao libera aprovacao para usuarios editor.

-- Pre-requisitos esperados em public.profiles:
-- id uuid primary key references auth.users(id)
-- email text
-- name text
-- role text com valores como 'admin' e 'editor'
-- can_edit_magazine boolean

alter table public.profiles enable row level security;

drop policy if exists "Profiles admins can read editorial requests" on public.profiles;
drop policy if exists "Profiles admins can approve editors" on public.profiles;

create policy "Profiles admins can read editorial requests"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
      and admin_profile.can_edit_magazine = true
  )
);

create policy "Profiles admins can approve editors"
on public.profiles
for update
to authenticated
using (
  role = 'editor'
  and exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
      and admin_profile.can_edit_magazine = true
  )
)
with check (
  role = 'editor'
  and exists (
    select 1
    from public.profiles admin_profile
    where admin_profile.id = auth.uid()
      and admin_profile.role = 'admin'
      and admin_profile.can_edit_magazine = true
  )
);

-- Validacao sugerida apos execucao:
-- 1. Entrar no /admin com usuario role='admin' e can_edit_magazine=true.
-- 2. Confirmar que solicitacoes editoriais pendentes aparecem.
-- 3. Aprovar um profile role='editor' com can_edit_magazine=false.
-- 4. Confirmar que editor aprovado consegue acessar /admin.
-- 5. Confirmar que usuario editor nao ve a area de aprovacao.
