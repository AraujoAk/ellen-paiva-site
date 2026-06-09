-- CMS 12.2 - Cadastro controlado de editores.
-- Executar manualmente no Supabase SQL Editor se o cadastro pendente falhar por RLS/role.
-- Objetivo: permitir que um usuario autenticado crie apenas o proprio profile pendente.

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('viewer', 'editor', 'magazine_editor', 'admin'));

drop policy if exists "profiles_insert_own_pending_editor" on public.profiles;

create policy "profiles_insert_own_pending_editor"
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and email = (auth.jwt() ->> 'email')
  and role = 'editor'
  and can_edit_magazine = false
);

-- Validacao sugerida apos executar:
-- select policyname, cmd
-- from pg_policies
-- where schemaname = 'public'
--   and tablename = 'profiles'
-- order by policyname;
