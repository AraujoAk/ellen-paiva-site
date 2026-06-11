-- CMS 15.1 — Biblioteca de Imagens Editorial
-- Execute somente se a listagem da biblioteca em /admin retornar erro de permissao.
-- Este SQL nao altera tabelas da Revista; apenas reforca policies de leitura/listagem
-- do bucket publico magazine-images para usuarios editoriais autorizados.

drop policy if exists "magazine_images_editor_select" on storage.objects;

create policy "magazine_images_editor_select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'magazine-images'
  and public.can_edit_magazine()
);

-- A leitura publica de arquivos pode permanecer habilitada se as imagens da Revista
-- precisam aparecer na landing e nos compartilhamentos.
drop policy if exists "magazine_images_public_read" on storage.objects;

create policy "magazine_images_public_read"
on storage.objects
for select
to public
using (bucket_id = 'magazine-images');
