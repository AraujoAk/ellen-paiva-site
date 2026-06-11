# CMS 16.0 - Publicacao automatica agendada

## Objetivo

Publicar automaticamente posts da Revista quando chegarem na data/hora definida em `published_at`.

Regra:

- `status = 'inactive'`
- `published_at <= now()`
- vira `status = 'active'`

Isso faz o post aparecer automaticamente na Revista publica, pois a leitura publica ja consome apenas posts `active`.

## Auditoria do schema atual

O schema documentado em `docs/supabase-magazine.sql` ja possui:

- `status text not null default 'inactive'`
- constraint `status in ('active', 'inactive', 'archived')`
- `published_at timestamptz`
- `updated_at timestamptz`

Mapeamento usado:

- `active` = publicado
- `inactive` = rascunho ou planejado
- `archived` = arquivado

Nao foi criado status novo.

## Arquivos criados

- `supabase/functions/publish-scheduled-posts/index.ts`
- `docs/supabase-scheduled-publishing.sql`
- `docs/supabase-scheduled-publishing-cron.sql`
- `docs/supabase-scheduled-publishing.md`

## Seguranca

A Edge Function usa Service Role apenas no ambiente seguro da Supabase Function.

Nunca usar no frontend:

- `SUPABASE_SERVICE_ROLE_KEY`
- qualquer variavel `VITE_` com service role

Secrets necessarios na Supabase Function:

```txt
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SCHEDULED_PUBLISH_SECRET
```

`SCHEDULED_PUBLISH_SECRET` e um segredo proprio para impedir que a Function seja acionada apenas com a chave publica do frontend.

## Como configurar secrets

No terminal com Supabase CLI autenticado:

```bash
supabase secrets set SUPABASE_URL="https://SEU-PROJETO.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="SUA_SERVICE_ROLE_KEY"
supabase secrets set SCHEDULED_PUBLISH_SECRET="UM_SEGREDO_FORTE_CRIADO_PARA_O_CRON"
```

Ou configure no painel do Supabase em:

Project Settings > Edge Functions > Secrets

## Deploy da Edge Function

```bash
supabase functions deploy publish-scheduled-posts
```

## Teste manual

1. Criar post rascunho no Admin.
2. Definir `published_at` alguns minutos no futuro.
3. Rodar a function manualmente.
4. Confirmar que ainda nao publica.
5. Alterar `published_at` para uma data/hora passada.
6. Rodar a function manualmente.
7. Confirmar que `status` virou `active`.
8. Confirmar que o post apareceu na Revista.
9. Confirmar registro em `activity_logs`, se a tabela estiver ativa.

Exemplo de chamada manual:

```bash
curl -i --request POST \
  "https://SEU-PROJETO.functions.supabase.co/publish-scheduled-posts" \
  --header "Authorization: Bearer SUA_ANON_OU_PUBLISHABLE_KEY" \
  --header "x-scheduled-publishing-secret: SEU_SCHEDULED_PUBLISH_SECRET"
```

Resposta esperada quando houver post vencido:

```json
{
  "ok": true,
  "published": 1,
  "checked_at": "2026-06-15T11:00:00.000Z",
  "activity_log": "registrado"
}
```

Resposta esperada quando nao houver post vencido:

```json
{
  "ok": true,
  "published": 0,
  "message": "Nenhum post agendado para publicar agora."
}
```

## Cron / agendamento

Preferencia: rodar a cada 5 minutos.

O arquivo `docs/supabase-scheduled-publishing-cron.sql` prepara o agendamento via `pg_cron` + `pg_net` + Supabase Vault.

Fluxo:

1. Fazer deploy da Edge Function.
2. Configurar os secrets da Edge Function.
3. Abrir `docs/supabase-scheduled-publishing-cron.sql`.
4. Substituir os placeholders:
   - `https://SEU-PROJECT-REF.supabase.co`
   - `SUA_PUBLISHABLE_OU_ANON_KEY`
   - `CRIE_UM_SEGREDO_FORTE_AQUI`
5. Executar no Supabase SQL Editor.
6. Validar o job:

```sql
select jobid, jobname, schedule, active
from cron.job
where jobname = 'publish-scheduled-posts-every-5-minutes';
```

## Activity logs

Se `activity_logs` existir, a function tenta registrar:

```txt
action = post_auto_published
actor_name = Publicacao automatica
entity_type = magazine_post
```

Se a tabela nao existir ou RLS/policy impedir, a publicacao nao falha. A resposta retorna `activity_log: "indisponivel"`.

## SQL opcional

`docs/supabase-scheduled-publishing.sql` cria um indice para acelerar a busca de posts planejados vencidos.

Nao e obrigatorio para funcionar, mas e recomendado antes de producao.

Se esse SQL ja foi executado no Supabase, nao precisa repetir.

## Riscos e observacoes

- O cron nao executa exatamente no segundo da data; com agenda de 5 minutos, pode haver atraso natural de ate 5 minutos.
- A function nao publica posts sem `published_at`.
- A function nao mexe em posts `archived`.
- A function nao altera conteudo, imagem, slug ou SEO.
- A function nao cria automacao no frontend.
