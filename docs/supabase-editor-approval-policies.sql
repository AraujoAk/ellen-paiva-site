-- CMS 13.0 - Politicas para aprovacao de editores no painel admin.
-- Executar manualmente no Supabase SQL Editor somente apos revisar.
-- Este script nao usa service_role e nao libera aprovacao para usuarios editor.
--
-- Importante:
-- Policies da tabela public.profiles nao devem fazer subquery direta em public.profiles.
-- Isso causa "infinite recursion detected in policy for relation profiles".
-- A funcao public.is_admin() usa security definer para checar o admin sem recursao de RLS.

-- Pre-requisitos esperados em public.profiles:
-- id uuid primary key references auth.users(id)
-- email text
-- name text
-- role text com valores como 'admin' e 'editor'
-- can_edit_magazine boolean

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and can_edit_magazine = true
  );
$$;

grant execute on function public.is_admin() to authenticated;

drop policy if exists "Profiles admins can read editorial requests" on public.profiles;
drop policy if exists "Profiles admins can approve editors" on public.profiles;

create policy "Profiles admins can read editorial requests"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or public.is_admin()
);

create policy "Profiles admins can approve editors"
on public.profiles
for update
to authenticated
using (
  role = 'editor'
  and public.is_admin()
)
with check (
  role = 'editor'
  and public.is_admin()
);

-- Validacao sugerida apos execucao:
-- 1. Confirmar que a query abaixo nao retorna erro de recursao:
--    select id, email, name, role, can_edit_magazine from public.profiles;
-- 2. Entrar no /admin com usuario role='admin' e can_edit_magazine=true.
-- 3. Confirmar que solicitacoes editoriais pendentes aparecem.
-- 4. Aprovar um profile role='editor' com can_edit_magazine=false.
-- 5. Confirmar que editor aprovado consegue acessar /admin.
-- 6. Confirmar que usuario editor nao ve a area de aprovacao/configuracoes.
