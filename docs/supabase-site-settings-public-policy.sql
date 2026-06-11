-- CMS 15.5 — Politica publica para leitura de configuracoes da marca
-- Execute somente se a landing publica nao conseguir ler public.site_settings.
-- A tabela deve conter apenas dados publicos e nao sensiveis.

drop policy if exists "site_settings_public_select" on public.site_settings;

create policy "site_settings_public_select"
on public.site_settings
for select
to anon, authenticated
using (id = 1);

-- Validacao publica esperada:
-- select brand_name, owner_name, instagram_url, whatsapp_url, tendencia_url, contact_email, signature_text
-- from public.site_settings
-- where id = 1;
