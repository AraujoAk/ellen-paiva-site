-- CMS 15.7 - Historico de Atividades Editorial.
-- Executar manualmente no Supabase SQL Editor somente apos revisar.
-- Este script cria um log simples para a area administrativa.

create extension if not exists pgcrypto;

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text,
  actor_email text,
  action text not null,
  entity_type text not null,
  entity_id text,
  entity_title text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint activity_logs_action_length check (char_length(action) between 3 and 80),
  constraint activity_logs_entity_type_length check (char_length(entity_type) between 3 and 80)
);

create index if not exists activity_logs_created_at_idx
  on public.activity_logs (created_at desc);

create index if not exists activity_logs_actor_id_idx
  on public.activity_logs (actor_id);

create index if not exists activity_logs_entity_idx
  on public.activity_logs (entity_type, entity_id);

alter table public.activity_logs enable row level security;

drop policy if exists "activity_logs_editors_can_insert" on public.activity_logs;
drop policy if exists "activity_logs_editors_can_read" on public.activity_logs;

create policy "activity_logs_editors_can_insert"
on public.activity_logs
for insert
to authenticated
with check (
  actor_id = auth.uid()
  and public.can_edit_magazine()
);

create policy "activity_logs_editors_can_read"
on public.activity_logs
for select
to authenticated
using (public.can_edit_magazine());

-- Validacao sugerida apos execucao:
-- select *
-- from public.activity_logs
-- order by created_at desc
-- limit 20;
