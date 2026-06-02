-- Planejamento SQL para CMS da seção Revista Ellen Paiva.
-- Este arquivo é uma proposta técnica. Revisar em ambiente Supabase antes de produção.

-- Extensões úteis.
create extension if not exists pgcrypto;

-- Perfis públicos vinculados ao Supabase Auth.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  role text not null default 'viewer',
  can_edit_magazine boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role in ('viewer', 'magazine_editor', 'admin'))
);

-- Posts editoriais da seção Revista.
create table if not exists public.magazine_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  description text not null,
  image_url text,
  image_path text,
  status text not null default 'inactive',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  archived_at timestamptz,
  constraint magazine_posts_status_check check (status in ('active', 'inactive', 'archived')),
  constraint magazine_posts_title_length check (char_length(title) between 3 and 120),
  constraint magazine_posts_category_length check (char_length(category) between 2 and 60),
  constraint magazine_posts_description_length check (char_length(description) between 10 and 240)
);

-- Índices para leitura pública e admin.
create index if not exists magazine_posts_public_idx
  on public.magazine_posts (status, published_at desc, created_at desc);

create index if not exists magazine_posts_created_by_idx
  on public.magazine_posts (created_by);

create index if not exists profiles_can_edit_magazine_idx
  on public.profiles (can_edit_magazine)
  where can_edit_magazine = true;

-- Função genérica para updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_magazine_posts_updated_at on public.magazine_posts;
create trigger set_magazine_posts_updated_at
before update on public.magazine_posts
for each row
execute function public.set_updated_at();

-- Helper para checar permissão de edição.
create or replace function public.can_edit_magazine()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and can_edit_magazine = true
  );
$$;

-- Helper para checar admin sem criar recursão em policies da tabela profiles.
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
  );
$$;

-- Garante que a autoria do post seja sempre o usuário autenticado.
create or replace function public.set_magazine_post_author()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.created_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists set_magazine_post_author on public.magazine_posts;
create trigger set_magazine_post_author
before insert on public.magazine_posts
for each row
execute function public.set_magazine_post_author();

-- Impede alteração manual da autoria após criação.
create or replace function public.preserve_magazine_post_author()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.created_by = old.created_by;
  return new;
end;
$$;

drop trigger if exists preserve_magazine_post_author on public.magazine_posts;
create trigger preserve_magazine_post_author
before update on public.magazine_posts
for each row
execute function public.preserve_magazine_post_author();

-- Ao ativar/publicar, preencher published_at e arquivar excedentes.
create or replace function public.enforce_magazine_active_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'active' and new.published_at is null then
    new.published_at = now();
  end if;

  if tg_op = 'UPDATE'
    and new.status <> 'active'
    and old.status = 'active'
    and new.archived_at is null
  then
    new.archived_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists before_magazine_posts_status_change on public.magazine_posts;
create trigger before_magazine_posts_status_change
before insert or update on public.magazine_posts
for each row
execute function public.enforce_magazine_active_limit();

-- Arquiva automaticamente posts ativos acima do limite de 10.
create or replace function public.archive_oldest_magazine_posts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'active' then
    update public.magazine_posts
    set
      status = 'archived',
      archived_at = now(),
      updated_at = now()
    where id in (
      select id
      from public.magazine_posts
      where status = 'active'
      order by published_at desc nulls last, created_at desc
      offset 10
    );
  end if;

  return null;
end;
$$;

drop trigger if exists after_magazine_posts_active_limit on public.magazine_posts;
create trigger after_magazine_posts_active_limit
after insert or update of status, published_at on public.magazine_posts
for each row
execute function public.archive_oldest_magazine_posts();

-- Row Level Security.
alter table public.profiles enable row level security;
alter table public.magazine_posts enable row level security;

-- Profiles: o usuário lê seu próprio perfil.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

-- Profiles: apenas admin planejado pode ler todos os perfis.
drop policy if exists "profiles_admin_select_all" on public.profiles;
create policy "profiles_admin_select_all"
on public.profiles
for select
to authenticated
using (
  public.is_admin()
);

-- Revista pública: qualquer pessoa lê posts ativos.
drop policy if exists "magazine_posts_public_select_active" on public.magazine_posts;
create policy "magazine_posts_public_select_active"
on public.magazine_posts
for select
to anon, authenticated
using (status = 'active');

-- Revista admin: editor autorizado lê todos os posts.
drop policy if exists "magazine_posts_editor_select_all" on public.magazine_posts;
create policy "magazine_posts_editor_select_all"
on public.magazine_posts
for select
to authenticated
using (public.can_edit_magazine());

-- Revista admin: editor autorizado cria posts.
drop policy if exists "magazine_posts_editor_insert" on public.magazine_posts;
create policy "magazine_posts_editor_insert"
on public.magazine_posts
for insert
to authenticated
with check (
  public.can_edit_magazine()
  and created_by = auth.uid()
);

-- Revista admin: editor autorizado atualiza posts.
drop policy if exists "magazine_posts_editor_update" on public.magazine_posts;
create policy "magazine_posts_editor_update"
on public.magazine_posts
for update
to authenticated
using (public.can_edit_magazine())
with check (public.can_edit_magazine());

-- Revista admin: delete físico deve ser evitado no app, mas restrito a editores se necessário.
drop policy if exists "magazine_posts_editor_delete" on public.magazine_posts;
create policy "magazine_posts_editor_delete"
on public.magazine_posts
for delete
to authenticated
using (public.can_edit_magazine());

-- Bucket planejado para imagens da Revista.
insert into storage.buckets (id, name, public)
values ('magazine-images', 'magazine-images', true)
on conflict (id) do nothing;

-- Storage: leitura pública das imagens do bucket.
drop policy if exists "magazine_images_public_read" on storage.objects;
create policy "magazine_images_public_read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'magazine-images');

-- Storage: upload apenas para editor autorizado.
drop policy if exists "magazine_images_editor_insert" on storage.objects;
create policy "magazine_images_editor_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'magazine-images'
  and (storage.foldername(name))[1] = 'magazine'
  and public.can_edit_magazine()
);

-- Storage: update apenas para editor autorizado.
drop policy if exists "magazine_images_editor_update" on storage.objects;
create policy "magazine_images_editor_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'magazine-images'
  and (storage.foldername(name))[1] = 'magazine'
  and public.can_edit_magazine()
)
with check (
  bucket_id = 'magazine-images'
  and (storage.foldername(name))[1] = 'magazine'
  and public.can_edit_magazine()
);

-- Storage: delete apenas para editor autorizado.
drop policy if exists "magazine_images_editor_delete" on storage.objects;
create policy "magazine_images_editor_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'magazine-images'
  and (storage.foldername(name))[1] = 'magazine'
  and public.can_edit_magazine()
);

-- Consulta pública planejada:
-- select id, title, category, description, image_url, published_at
-- from public.magazine_posts
-- where status = 'active'
-- order by published_at desc nulls last, created_at desc
-- limit 10;
