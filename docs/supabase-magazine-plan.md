# Planejamento CMS Revista Ellen

## Objetivo

Transformar a seção Revista da landing Ellen Paiva em uma área editorial dinâmica, editável por usuários autorizados, sem permitir alterações de layout, cores, posição dos elementos ou estrutura visual aprovada.

A landing pública deve continuar funcionando mesmo se o CMS estiver indisponível.

## Stack Escolhida

Stack recomendada: Supabase.

Motivos da escolha:

- Reúne autenticação, banco Postgres, storage de imagens e políticas de permissão no mesmo serviço.
- Permite usar Row Level Security para separar leitura pública de edição autorizada.
- Evita criar um backend Node próprio nesta fase.
- Encaixa bem em um projeto Vite/React hospedado na Vercel.
- Permite evoluir o CMS aos poucos, começando pela leitura pública e depois pelo painel administrativo.

## Fluxo Público

1. A landing carrega normalmente.
2. A seção Revista consulta posts ativos no Supabase.
3. Apenas posts com `status = 'active'` aparecem publicamente.
4. A listagem pública mostra no máximo 10 posts.
5. A ordenação pública usa `published_at desc`.
6. Se a consulta falhar ou não retornar dados, a seção usa o fallback estático atual.

O layout público continua sendo controlado pelo código React/CSS do projeto. O editor não altera grid, cores, fontes, espaçamentos ou componentes.

## Fluxo Admin

Fluxo planejado para fase futura:

1. Usuário autorizado acessa `/admin`.
2. Faz login por Supabase Auth.
3. O sistema verifica o perfil em `profiles`.
4. Apenas usuários com `can_edit_magazine = true` acessam o painel da Revista.
5. O editor pode criar, editar, ativar, inativar ou arquivar posts.
6. O editor pode enviar imagem editorial para o bucket `magazine-images`.
7. Ao publicar um post, o banco garante o limite máximo de 10 posts ativos.

Cadastro de usuários deve ser controlado. Não deve existir cadastro público livre para edição da Revista.

Os registros em `profiles` devem ser criados ou atualizados por service role, Supabase Dashboard ou função administrativa controlada. O editor da Revista não deve ter permissão para alterar seu próprio papel ou permissões.

## Estratégia De Fallback Estático

O array estático atual da seção Revista deve ser preservado em um arquivo separado em fase futura, por exemplo:

```txt
src/components/Magazine/magazineFallback.js
```

Comportamento esperado:

- Supabase disponível com posts ativos: renderiza posts dinâmicos.
- Supabase indisponível: renderiza fallback estático.
- Supabase sem posts ativos: renderiza fallback estático ou mensagem editorial controlada pelo código, conforme decisão futura.

Essa estratégia protege a landing pública contra falhas externas.

## Limite De 10 Posts Ativos

Regra de negócio:

- A seção pública exibe no máximo 10 posts ativos.
- Quando um novo post for publicado e o total ativo passar de 10, o post ativo mais antigo deve ser arquivado automaticamente.
- Essa regra deve viver no banco, não apenas no frontend.

Motivo:

- Evita burla por chamada direta de API.
- Mantém consistência mesmo se houver mais de um editor.
- Reduz risco de quebrar a composição visual da seção pública.

## Upload De Imagens

Para seed e teste controlado, imagens estáveis podem ficar em:

```txt
public/magazine/
```

Essas imagens são apenas para validação inicial da integração pública. Elas não devem ser usadas como estratégia definitiva do CMS.

Bucket planejado:

```txt
magazine-images
```

Estrutura sugerida:

```txt
magazine/{post_id}/{timestamp}-{slug}.webp
```

Regras planejadas:

- Apenas usuários autorizados podem fazer upload.
- Upload, update e delete devem ficar restritos à pasta `magazine/` dentro do bucket.
- Imagens públicas podem ser lidas pela landing.
- O admin deve validar tipo e tamanho antes do upload.
- Futuramente, comprimir/converter imagens para WebP antes de salvar.
- Posts reais da Revista não devem apontar para URLs `/assets/*.webp` geradas pelo Vite com hash de build.
- Operação real deve usar URLs do bucket `magazine-images` no Supabase Storage.

Recomendação de produto:

- Definir dimensão mínima recomendada: 1200px de largura.
- Definir peso máximo antes do upload: 1 MB.
- Avisar o editor quando a imagem for pesada demais.

## Estratégia De Permissões

Perfis planejados:

- `viewer`: usuário autenticado sem permissão de edição.
- `magazine_editor`: pode gerenciar posts da Revista.
- `admin`: pode gerenciar usuários/permissões em fase futura.

Campo principal:

```txt
profiles.can_edit_magazine
```

RLS planejado:

- Leitura pública: apenas posts ativos.
- Leitura administrativa: apenas usuário autenticado com permissão.
- Insert/update/delete: apenas usuário autenticado com permissão.
- Storage upload/update/delete: apenas usuário autenticado com permissão.
- `created_by` deve ser preenchido automaticamente pelo banco e preservado em updates.
- Policies de `profiles` devem usar função `security definer` para evitar recursão de RLS.

## Riscos Técnicos

Riscos altos:

- RLS mal configurado permitindo edição pública.
- Upload sem validação gerando perda de performance.
- Remover fallback e deixar a Revista dependente 100% do Supabase.

Riscos médios:

- Títulos longos quebrando a composição visual.
- Imagens com corte ruim por falta de orientação editorial.
- Usuários criados sem governança.
- Regras de arquivamento feitas só no frontend.

Riscos baixos:

- Pequena variação no tempo de carregamento da Revista por consulta externa.
- Necessidade futura de paginação no admin.

## Estrutura Planejada

```txt
src/
├── services/
│   ├── supabaseClient.js
│   ├── magazineService.js
│   └── authService.js
│
├── hooks/
│   ├── useMagazinePosts.js
│   └── useAuthUser.js
│
├── pages/
│   └── Admin/
│       ├── LoginPage.jsx
│       ├── RevistaAdminPage.jsx
│       └── Admin.css
│
└── components/
    └── Magazine/
        ├── Magazine.jsx
        ├── Magazine.css
        └── magazineFallback.js
```

Nada disso deve ser criado até a fase de implementação correspondente.

## Pendências Antes Da Implementação Real

- Criar projeto Supabase.
- Definir URL e anon key.
- Executar SQL planejado em ambiente Supabase.
- Criar primeiro usuário autorizado.
- Validar RLS com usuário autorizado e usuário não autorizado.
- Definir padrão editorial de imagens.
- Definir limites de caracteres no admin.
- Decidir se o admin terá rota simples no React ou proteção adicional via backend/serverless.
