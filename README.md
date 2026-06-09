# Ellen Paiva Site

Landing page editorial premium para posicionamento da marca pessoal de Ellen Paiva.

## Stack

- React
- Vite
- JavaScript
- CSS global organizado

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Fase Atual

Preparação de ambiente, arquitetura base, Header e Hero.

## Assets Recomendados

Coloque imagens editoriais em `src/assets/images/` e logos/assinaturas em `src/assets/logos/`.

- `src/assets/images/ellen-editorial-close.jpeg` → `ellenHero`, `smartSpecial`, `magazine01`
- `src/assets/images/ellen-about-nude.jpeg` → `ellenAbout`, `smartLeisure`, `magazine03`
- `src/assets/images/ellen-white-red.jpeg` → `smartCasual`, `magazine02`, `magazine05`
- `src/assets/images/ellen-burgundy.jpeg` → `smartWork`, `magazine04`, `newsletterFooter`
- `src/assets/logos/ellen-paiva-signature.png` → `ellenSignature`
- `src/assets/logos/tendencia-logo.jpeg` → `tendenciaLogo`

Depois de adicionar os arquivos reais, atualize `src/assets/assetsMap.js` para importar os arquivos e trocar os valores `null` pelas referências importadas.

Assets reais/editoriais aplicados nesta versão:

- `src/assets/logos/ellen-paiva-signature.png` → assinatura Ellen Paiva no Header e Footer
- `src/assets/images/ellen-editorial-close.jpeg` → Hero e conteúdo editorial
- `src/assets/images/ellen-about-nude.jpeg` → Sobre Ellen e conteúdo editorial
- `src/assets/images/ellen-white-red.jpeg` → SmartStyle e Magazine
- `src/assets/images/ellen-burgundy.jpeg` → SmartStyle, Magazine e Newsletter
- `src/assets/logos/tendencia-logo.jpeg` → Tendência Multimarcas

## Deploy

### Vercel

Configuração recomendada:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Fluxo sugerido:

1. Criar um repositório no GitHub.
2. Enviar este projeto para o repositório.
3. Entrar em `vercel.com`.
4. Importar o repositório.
5. Confirmar as configurações acima.
6. Fazer o deploy.

O arquivo `vercel.json` já deixa essas configurações explícitas para o ambiente da Vercel.

### Observação

O plano Hobby da Vercel é gratuito e indicado para projetos pessoais ou não comerciais. Para uso comercial da marca, valide as regras atuais do plano antes da publicação definitiva.

## Changelog

### Fase 01.1 — Ajuste Header + Hero

- Corrigido tamanho do título do Hero.
- Ajustado equilíbrio visual entre texto e imagem no Hero.
- Corrigidos acentos dos textos em Header e Hero.
- Mantida arquitetura base.
- Nenhuma nova dependência instalada.

### Fase 02 — AboutEllen

- Criada seção Sobre Ellen abaixo do Hero.
- Adicionado layout editorial com texto à esquerda e imagem temporária à direita no desktop.
- Adicionados quatro microcards de autoridade e posicionamento.
- Mantida arquitetura atual, sem novas dependências e sem novas pastas.

### Fase 03 — SmartStyle

- Criada seção Estilo Inteligente abaixo de AboutEllen.
- Adicionado conceito “Uma peça. Várias possibilidades.” com subtítulo editorial.
- Criado grid responsivo com quatro cards de momentos de uso.
- Mantida arquitetura atual, sem novas dependências, animações ou assets novos.

### Fase 04 — Magazine

- Criada seção Revista Editorial abaixo de SmartStyle.
- Adicionadas categorias visuais para organizar os temas de conteúdo.
- Criado grid responsivo com cinco cards editoriais e links “Leia mais”.
- Mantida arquitetura atual, sem novas dependências, animações ou assets novos.

### Fase 05 — Tendencia

- Criada seção Tendência Multimarcas abaixo de Magazine.
- Adicionada conexão editorial entre Ellen Paiva e a marca Tendência Multimarcas.
- Criados quatro diferenciais institucionais e três botões de ação.
- Mantida arquitetura atual, sem novas dependências, animações ou assets novos.

### Fase 06 — Newsletter

- Criada seção Newsletter Editorial abaixo de Tendencia.
- Adicionado layout leve e dividido com formulário visual de nome e e-mail.
- Incluída nota editorial abaixo do formulário.
- Mantida arquitetura atual, sem lógica funcional, novas dependências, animações ou assets novos.

### Fase 07 — Footer

- Criado rodapé final abaixo da Newsletter.
- Adicionadas colunas de marca, navegação, conteúdos e contato.
- Incluída linha inferior com direitos reservados.
- Mantida arquitetura atual, sem novas dependências, animações ou assets novos.

### Etapa 08 — Sistema global de efeitos e microinterações

- Criado utilitário de reveal ao scroll com IntersectionObserver.
- Adicionadas classes globais de reveal, delays e estado visível.
- Aplicadas microinterações sutis em botões, links, cards e placeholders visuais.
- Mantido suporte a prefers-reduced-motion e nenhuma dependência nova foi instalada.

### Etapa 09 — Refinamento premium do Header e menu mobile

- Adicionado comportamento visual do Header ao rolar a página.
- Criado menu mobile acessível com botão hamburger, aria-expanded e aria-controls.
- Refinados hover, foco visível, painel mobile e botão Newsletter.
- Mantido Header sticky, sem novas dependências e sem alterações nas seções abaixo.

### Etapa 10 — Refinamento dos reveals visuais

- Suavizada a duração, easing e distância inicial dos reveals globais.
- Corrigida sobrescrita de transição que fazia cards revelarem de forma abrupta.
- Sincronizada a entrada de placeholders visuais com cards e containers.
- Ajustado o IntersectionObserver para iniciar o reveal de forma mais elegante.

### Etapa 11 — Scroll restoration global

- Definido `history.scrollRestoration` como manual no carregamento da aplicação.
- Adicionado retorno automático ao topo ao recarregar a landing page.
- Mantida a navegação interna por âncoras após o carregamento inicial.

### Etapa 12 — Auditoria e refinamento responsivo global

- Ajustados títulos grandes, espaçamentos e botões para telas pequenas.
- Refinados menu mobile, grids e cards para evitar overflow horizontal.
- Ajustadas alturas visuais de placeholders em 320px e 480px.
- Mantida a arquitetura atual sem novas dependências ou seções.

### Etapa A — Preparação para assets reais

- Criado `src/assets/assetsMap.js` com mapeamento seguro para imagens, assinatura e logos.
- Componentes visuais preparados para renderizar `<img>` quando houver assets reais.
- Mantidos fallbacks editoriais atuais enquanto os arquivos reais não forem inseridos.
- Documentados nomes recomendados e locais de armazenamento dos assets.

### Etapa B — Aplicação dos assets reais

- Mapeados os arquivos reais existentes em `src/assets/assetsMap.js`.
- Aplicadas imagens reais no Hero, Sobre Ellen, SmartStyle, Magazine, Tendência e Newsletter.
- Aplicada assinatura Ellen Paiva no Header e Footer.
- Mantidos fallbacks para imagens reais ainda não disponíveis, como foto da loja Tendência.

### Etapa C — Correção dos assets editoriais

- Removido do mapa o uso de screenshots/mockups das seções como imagens de conteúdo.
- Aplicadas apenas fotos reais/editoriais da Ellen nos blocos visuais.
- Tendência passou a usar logo real sobre composição refinada quando não houver foto da loja.
- Assinatura Ellen Paiva ampliada no Header com proporção preservada.

### Etapa C1 — Correção visual do Header e Hero

- Criada topbar editorial acima do Header principal.
- Assinatura Ellen Paiva ampliada no Header para melhor legibilidade.
- Hero ajustado para foto editorial preencher todo o painel visual.
- Removida moldura interna da imagem do Hero e refinada proporção em desktop/notebook.

### Etapa C2 — Correção visual de imagens internas

- Removidas molduras internas desnecessárias em painéis de imagem das seções internas.
- Alternadas fotos reais da Ellen com fallbacks editoriais em SmartStyle e Magazine.
- Ajustado corte das imagens com `object-position: center top`.
- Tendência passou a integrar melhor o logo ao painel visual refinado.

### Etapa D — Refino estrutural sem imagens reais

- Assets reais foram temporariamente removidos do layout e retornaram para `null` no mapa.
- Reforçados placeholders editoriais premium em Hero, AboutEllen, SmartStyle, Magazine, Tendência e Newsletter.
- Reduzidos paddings, títulos e alturas visuais para melhor leitura em notebooks.
- Header, topbar e Footer refinados para funcionar melhor com fallback textual de marca.

### Etapa E1 — Correção Hero full-width editorial

- Hero refinado para duas colunas reais com painel visual maior à direita.
- Painel editorial passou a preencher 100% da altura útil da seção.
- Caption do painel removida no desktop para melhorar alinhamento e compactação.
- Título, gap e padding vertical ajustados para telas de notebook.

### Etapa E2 — Refinamento estrutural editorial global

- Seções pós-Hero foram compactadas para melhorar leitura em notebook e desktop.
- Gaps, paddings, títulos, grids e painéis foram ajustados para maior densidade editorial.
- Cards e placeholders ficaram mais proporcionais e menos verticais.
- Footer teve hierarquia e espaçamento refinados sem alterar conteúdo.

### Etapa E4 — Direção criativa editorial avançada

- Refinado o ritmo visual global para uma experiência mais contínua e editorial.
- Adicionados acentos sutis de marca, sombras silenciosas e bordas mais sofisticadas.
- Melhorada a hierarquia visual de header, hero, cards, seções institucionais, newsletter e footer.
- Microinterações foram ajustadas para reforçar luxo silencioso sem alterar textos ou estrutura.

### Etapa E5 — Experiência humana e conversão silenciosa

- Aplicadas assimetrias editoriais sutis para reduzir a sensação de grid mecânico.
- Criado detalhe visual recorrente com linhas douradas discretas em seções, cards e painéis.
- SmartStyle e Magazine receberam variações de ritmo, proporção e hierarquia para parecerem mais curados.
- Tendência, Newsletter e Footer foram refinados para transmitir marca consolidada, exclusividade e fechamento institucional.
- Microinterações foram ajustadas com movimentos mais orgânicos, sem alterar textos, estrutura ou dependências.

### Ajuste SmartStyle — refinamento de hierarquia e organização

- Revertidas as variações estruturais mais ousadas da grade SmartStyle.
- Cards retornaram para alinhamento mais limpo, organizado e funcional em desktop.
- Mantidos acabamento premium, sombras suaves, detalhes editoriais e hovers refinados.
- Magazine e demais seções não foram alteradas neste ajuste.

### Experimento UX 01 — Refinamento mobile premium

- Header mobile ficou mais compacto, com logo legível, hamburger refinado e painel de menu mais premium.
- Hero mobile recebeu título mais controlado, CTAs confortáveis e painel editorial com altura mais elegante.
- Seções internas foram ajustadas em mobile para reduzir scroll excessivo e melhorar ritmo de leitura.
- Cards, formulários, botões e footer receberam espaçamentos mais confortáveis para telas pequenas.
- Versão desktop aprovada foi preservada.

### Experimento UX 02 — Desktop editorial fino

- Hero recebeu detalhes editoriais desktop para reforçar sensação de capa premium.
- AboutEllen, SmartStyle e Magazine foram refinadas com mais presença institucional, curadoria e hierarquia visual.
- Tendência, Newsletter e Footer ganharam profundidade, respiro e acabamento mais sofisticado em desktop.
- Microdetalhes de hover, sombras e linhas editoriais foram ajustados sem alterar textos, grids principais ou mobile.

### Ajuste de direção criativa — sofisticação limpa

- Removidas linhas decorativas e marcas gráficas abstratas que poderiam parecer interferência visual.
- SmartStyle teve detalhes conceituais reduzidos para reforçar organização, clareza e curadoria funcional.
- Tendência perdeu o monograma abstrato grande, mantendo composição institucional mais limpa.
- Mantidos espaçamentos, sombras suaves, hovers, estrutura aprovada e estética premium madura.

### Etapa F1 — Hero como capa editorial integrada

- Hero desktop passou de layout dividido para composição editorial integrada.
- Painel visual ocupa a maior parte da primeira dobra como fundo dominante e preparado para fotografia futura.
- Conteúdo textual ficou em área segura com gradiente suave, sem aparência de card rígido.
- Mobile foi preservado com texto primeiro e painel visual abaixo.

### Etapa F1.1 — Hero integrado ao background editorial

- Background editorial do Hero passou a ocupar 100% da composição desktop.
- Removida a sensação de faixa branca rígida na área textual.
- Legibilidade do texto agora é criada por gradientes suaves sobre o próprio fundo editorial.
- Mobile permanece com leitura segura e painel visual abaixo do conteúdo.

### Etapa G1 — Curadoria visual editorial

- Imagens reais e stills editoriais foram aplicados estrategicamente no mapa de assets.
- Hero recebeu retrato editorial forte da Ellen, com corte preparado para composição de capa.
- AboutEllen usa retrato nude para autoridade suave e proximidade.
- SmartStyle e Magazine alternam Ellen, acessórios, tecidos, café e detalhes para evitar aparência de catálogo.
- Tendência recebeu ambiente sofisticado e Newsletter recebeu imagem intimista de café.

### Ajuste G2 — Correções visuais pós-curadoria real

- Hero teve borda indesejada removida e enquadramento ajustado para posicionar Ellen mais à direita.
- Microcards de AboutEllen foram realinhados para manter altura e grid mais consistentes.
- Primeiro card do Magazine recebeu alinhamento interno mais limpo e corte superior preservando melhor a imagem.
- Tendência passou a preencher o painel visual sem respiros internos desalinhados.
- Newsletter foi compactada para reduzir área vazia e equilibrar melhor texto, imagem e formulário.

### Ajuste G2.1 — Direção editorial final do Hero

- Imagem real do Hero foi invertida horizontalmente no desktop para posicionar Ellen à direita.
- Object-position e overlay foram ajustados para deixar o lado esquerdo mais limpo para leitura.
- Mobile permanece com a imagem em orientação normal e leitura segura.

### Ajuste G2.2 — Hero com presença editorial e header refinado

- Overlay do Hero foi reduzido no lado direito para recuperar presença, contraste e definição da Ellen.
- Inversão editorial da imagem foi preservada também durante hover no desktop.
- Topbar deixou de ser sticky e passa a aparecer apenas no topo inicial.
- Header principal continua sticky ao rolar a página.
- Logo Ellen Paiva agora rola suavemente ao topo sem recarregar a página.

### Ajuste G2.3 — Destaque visual da Ellen no Hero

- Overlay do Hero foi reduzido novamente na área direita para evitar aparência lavada.
- Proteção visual ficou concentrada no lado esquerdo, preservando a leitura do texto.
- Imagem da Ellen recebeu contraste, saturação e brilho sutis para maior presença editorial.

### Rodada Mobile 01 — Ajustes pós-imagens reais

- Header mobile foi compactado, com topbar menor, hamburger alinhado e menu vertical menos alto.
- Hero mobile recebeu altura menor, título mais controlado e imagem com presença preservada.
- AboutEllen, SmartStyle, Magazine, Tendência e Newsletter tiveram paddings, imagens e cards ajustados para reduzir scroll excessivo entre 390px e 430px.
- Footer mobile ficou mais compacto, mantendo a marca Ellen Paiva legível e links confortáveis.
- Scroll-padding mobile foi ajustado para considerar apenas o header sticky, já que a topbar não acompanha a rolagem.

### Ajuste links externos oficiais

- Links de Instagram foram atualizados para o direct oficial informado.
- Links de Conhecer a Tendência foram atualizados para o Linktree oficial informado.
- Links de Falar no WhatsApp foram atualizados para o endereço oficial informado.
- Links externos agora abrem em nova aba com `target="_blank"` e `rel="noopener noreferrer"`.

### Etapa H1 — Experiência de scroll e movimento silencioso

- Reveal ao scroll recebeu duração, easing e delays mais orgânicos para entradas suaves e editoriais.
- Hero ganhou cadência inicial mais refinada, com texto surgindo antes da área visual.
- Imagens, cards e botões receberam microinterações mais discretas, com zoom e feedback tátil suaves.
- Mobile recebeu animações mais curtas e delays reduzidos para priorizar fluidez e legibilidade.
- `prefers-reduced-motion` segue respeitado para remover transições quando solicitado pelo usuário.

### Auditoria H1 — Movimento e acessibilidade

- Corrigido comportamento em `prefers-reduced-motion` para preservar a inversão editorial da imagem do Hero no desktop.
- Hovers e estados ativos passam a remover deslocamentos em modo de movimento reduzido.
- Mantidos textos, estrutura e layout aprovados.

### Etapa H2 — Navegação e CTAs inteligentes

- Header ganhou estado ativo refinado para links internos e CTA de Newsletter.
- Seções receberam `scroll-margin-top` para evitar que o header sticky cubra o início do conteúdo.
- CTAs do Hero, Tendência e Newsletter foram refinados com presença visual, foco e active state discretos.
- Links externos receberam `aria-label` quando necessário, mantendo `target="_blank"` e `rel="noopener noreferrer"`.
- Logo do footer passou a apontar para o topo da página sem recarregar a landing.

### Correção H2.1 — navegação ativa sincronizada

- Cálculo de seção ativa passou a considerar a área visível dominante no viewport.
- Altura do header sticky agora entra no cálculo para evitar marcação da seção anterior.
- Cliques em links internos atualizam o estado ativo imediatamente enquanto o scroll suave acontece.
- Scroll e resize usam `requestAnimationFrame` para reduzir flicker e manter apenas um item ativo.

### Correção H2.2 — active state travado durante navegação programática

- Cliques em links internos agora travam temporariamente o item ativo até o destino do scroll suave ficar próximo.
- Seções intermediárias deixam de assumir o estado ativo durante navegação programática.
- O lock é liberado ao chegar perto do destino ou quando o usuário faz scroll manual por roda, toque ou teclado.
- O retorno ao topo pela logo usa a mesma lógica para evitar destaque intermediário.

### Rodada Mobile 02 — Refinamento avançado mobile

- Header, Hero e seções internas foram compactados para melhorar leitura em 390px e 430px.
- Hero mobile recebeu altura menor, título mais controlado e imagem com mais presença.
- Cards, thumbnails, microcards e CTAs foram ajustados para reduzir scroll excessivo sem perder toque premium.
- A faixa de 768px recebeu tratamento de tablet móvel para melhorar composição, respiro e proporção visual.
- Footer e Newsletter ficaram mais objetivos em mobile, mantendo links e botões confortáveis.

### PRD inicial página institucional Tendência

- Criada rota `/tendencia` com página institucional/editorial premium para Tendência Multimarcas.
- A nova página usa estrutura isolada em `src/pages/Tendencia/`, reutilizando paleta, tipografia, assets reais e sistema de reveal.
- Incluídas seções de Hero editorial, filosofia da marca, curadoria, experiência, revista/estilo e CTA final.
- SEO básico passa a ser ajustado dinamicamente para a página Tendência.
- Adicionado `vercel.json` com rewrite para suportar acesso direto e refresh em `/tendencia`.

### Refinamento T01 — direção institucional Tendência

- Página `/tendencia` foi refinada para ter direção própria, mais institucional, fotográfica e atmosférica.
- Logo real da Tendência passou a ser mapeada em `assetsMap.js` e usada com mais presença no Hero, manifesto e CTA final.
- Estrutura visual da página foi reduzida em aparência de landing modular, com manifesto de marca, galeria editorial e lista de conteúdos mais fluida.
- A landing principal agora direciona para `/tendencia` pelo topbar, CTA da seção Tendência e navegação do footer.
- Mantida a base aprovada da landing Ellen, sem instalar novas dependências e sem transformar a experiência em ecommerce.

### Reversão segura — remoção da página /tendencia

- Removida a rota e os arquivos criados exclusivamente para a página institucional `/tendencia`.
- `App.jsx` voltou a renderizar somente a landing principal da Ellen.
- Links internos que apontavam para `/tendencia` foram removidos.
- CTAs “Conhecer a Tendência” voltaram para o Linktree oficial aprovado.
- Mantidos os refinamentos anteriores da landing principal, incluindo Header, Hero, mobile, motion, imagens reais e links oficiais.

### Etapa J1 — Editorialização de About, Tendência e Newsletter

- About Ellen teve os microblocos suavizados para parecerem elementos editoriais integrados, sem alterar os quatro conteúdos.
- Tendência recebeu mais atmosfera de marca, profundidade no painel visual e diferenciais menos parecidos com cards soltos.
- Newsletter foi refinada para funcionar mais como convite editorial, mantendo campos e botão funcionais.
- Hero, Header, navegação, textos principais, SmartStyle e estrutura geral foram preservados.
- Nenhuma imagem foi convertida nesta etapa; performance ficou preparada para uma rodada futura.

### Etapa K1 — Otimização de imagens e performance

- Imagens reais usadas pela landing foram convertidas para WebP e passaram a ser consumidas pelo `assetsMap.js`.
- A imagem principal do Hero recebeu preload no `index.html` e `fetchPriority="high"` no componente.
- Imagens abaixo da primeira dobra receberam `loading="lazy"` e `decoding="async"`.
- Arquivos originais foram preservados como fallback/arquivo-fonte, sem alterar layout, textos ou direção visual.
- A conversão foi feita sem manter nova dependência instalada no projeto.

#### Redução estimada dos assets usados

- `img_ellen1 (1).jpg` → `ellen-hero-editorial-seated.webp`: 977 KB para 209 KB.
- `img_ellen1 (2).png` → `tendencia-warm-interior.webp`: 2.46 MB para 202 KB.
- `img_ellen1 (3).PNG` → `fashion-accessories.webp`: 1.95 MB para 54 KB.
- `img_ellen1 (4).png` → `coffee-still.webp`: 2.22 MB para 133 KB.
- `img_ellen1 (5).png` → `burgundy-fabric.webp`: 2.07 MB para 119 KB.
- `img_ellen1 (6).png` → `jewelry-book.webp`: 2.58 MB para 199 KB.
- `img_ellen1 (8).png` → `editorial-texture.webp`: 2.32 MB para 123 KB.
- Fotos editoriais JPEG menores também foram convertidas, com redução média entre 63% e 66%.

### Etapa K2 — SEO base e Open Graph

- `index.html` recebeu description com acentos, canonical, Open Graph completo e Twitter Card.
- Criada imagem pública de compartilhamento em `public/og-ellen-paiva.webp`, baseada no Hero otimizado.
- Adicionado Schema.org básico do tipo `Person` para Ellen Paiva.
- Criados `public/robots.txt` e `public/sitemap.xml` apontando para a URL principal do projeto.
- Mantidos layout, textos visíveis, imagens do layout e dependências atuais.

### Etapa M1 — Correções finais pós-Lighthouse

- Contraste do logo textual Ellen Paiva foi reforçado sem alterar estrutura.
- CTA principal do Hero e botão primário da Tendência receberam cores com contraste mais seguro.
- `aria-labels` de CTAs foram ajustados para incluir exatamente o texto visível.
- Criado `public/favicon.ico` e linkado no `index.html` para remover o 404 de favicon.
- Mantidos layout, textos visíveis, imagens otimizadas e dependências atuais.

### Etapa M2 — Refinamento final de LCP

- Fontes do Google foram movidas do `@import` CSS para links no `index.html` com `preconnect`.
- Hero passou a renderizar sem atraso inicial do sistema de reveal, preservando a composição visual final.
- Imagem crítica do Hero manteve preload, `fetchPriority="high"` e recebeu `decoding="sync"`.
- Imagens abaixo da dobra seguem com `loading="lazy"` e `decoding="async"`.
- Mantidos layout, textos, identidade visual, imagens otimizadas e dependências atuais.

### Fase CMS 01 — Planejamento Supabase Revista

- Criada documentação técnica para transformar a seção Revista em CMS dinâmico com Supabase.
- Planejados fluxo público, fluxo admin, fallback estático, permissões, upload e limite de 10 posts ativos.
- Criado SQL planejado com tabelas, índices, triggers, RLS e políticas de storage.
- Criado `.env.example` com variáveis futuras do Supabase.
- Nenhuma dependência foi instalada e a landing pública permanece sem conexão com Supabase nesta fase.

### Fase CMS 02 — Auditoria SQL Supabase Revista

- SQL planejado foi auditado antes da execução no Supabase real.
- Corrigido risco de recursão em policy de `profiles` usando helper `public.is_admin()`.
- Autoria de posts da Revista passou a ser preenchida automaticamente e preservada em updates.
- Políticas de storage foram restringidas à pasta `magazine/` dentro do bucket `magazine-images`.
- Mantida leitura pública apenas para posts ativos e escrita restrita a usuários com `can_edit_magazine = true`.

### Fase CMS 05 — Conexão React + Supabase

- Instalado `@supabase/supabase-js` para preparar a conexão com o projeto `ellen-paiva-hub`.
- Criado `src/lib/supabase.js` usando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- Criado `src/services/magazineService.js` com `getPublishedPosts()`, `getFeaturedPost()` e `getPostsByCategory()`.
- Conteúdo estático da Revista foi preservado em fallback seguro.
- A seção Revista passa a usar posts publicados do Supabase apenas quando houver dados; caso contrário, mantém o conteúdo atual.
- Nenhum layout, texto visível, navegação ou painel admin foi alterado nesta fase.

### Fase CMS 06 — Seed de teste Revista Supabase

- Criado seed controlado em `docs/supabase-magazine-seed.sql` com 3 posts ativos de teste.
- O seed usa o campo real `description`, equivalente à descrição curta/excerpt planejada.
- URLs de imagem temporárias apontam para assets públicos já publicados na Vercel.
- O seed não foi executado automaticamente; deve ser revisado e rodado manualmente no Supabase.
- A conexão React segue preservando fallback estático quando o Supabase estiver vazio, indisponível ou sem variáveis de ambiente.

### Fase CMS 06.2 — Seed com imagens públicas estáveis

- Criada pasta `public/magazine/` com 3 imagens WebP estáveis para seed/teste.
- `docs/supabase-magazine-seed.sql` passou a usar URLs sem hash de build do Vite.
- Documentado que `public/magazine/` é apenas para validação inicial.
- Operação real dos posts da Revista deve usar o bucket `magazine-images` do Supabase Storage.

### Fase CMS 06.3 — Revista dinâmica conectada ao Supabase

- Criado `.env.local` local com placeholders para `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- Auditados `src/lib/supabase.js`, `src/services/magazineService.js`, `Magazine.jsx` e `docs/supabase-magazine-seed.sql`.
- Confirmado que o service consulta `magazine_posts` com campos reais: `title`, `category`, `description`, `image_url`, `status` e `published_at`.
- Confirmado que o fallback estático permanece ativo quando o Supabase não estiver configurado ou não retornar posts.
- Seed ainda não foi executado no Supabase real; execução depende de confirmação manual e das variáveis do projeto.

### Fase CMS 06.5 — Revista conectada ao Supabase real

- `.env.local` recebeu a URL corrigida do projeto Supabase `ellen-paiva-hub`.
- `.env.local` recebeu a publishable/anon key real localmente; a chave permanece fora do Git por estar em arquivo ignorado.
- A consulta direta ao endpoint REST do Supabase foi validada com sucesso.
- Confirmados 3 posts ativos em `public.magazine_posts`: "Detalhes que elevam uma produção simples", "Peças versáteis para dias reais" e "Como usar alfaiataria leve na rotina".
- Como há posts ativos retornando da API, a seção Revista passa a consumir Supabase; o fallback estático permanece preservado para ausência de env, erro de conexão ou tabela vazia.
- Build, lint e localhost foram validados após reiniciar o ambiente de desenvolvimento.

### Fase CMS 06.6 — Validação em produção

- Produção em `https://ellen-paiva-site.vercel.app/` respondeu HTTP 200.
- Bundle publicado contém a URL correta do Supabase, a referência à tabela `magazine_posts` e a lógica dinâmica da Revista.
- API pública do Supabase retornou 3 posts ativos em `public.magazine_posts`.
- Como o deploy possui variáveis válidas e a API retorna posts, a seção Revista em produção usa Supabase; fallback permanece apenas como contingência.
- Build e lint locais seguem aprovados após a validação.

### Fase CMS 07 — Login e painel administrativo da Revista

- Criada rota `/admin` para acesso restrito ao painel editorial da Revista Ellen Paiva.
- Adicionado login/logout com Supabase Auth usando apenas a publishable/anon key.
- Criada proteção de acesso baseada em `profiles.can_edit_magazine`.
- Criados serviços `authService.js` e `magazineAdminService.js` para sessão, perfil, listagem, criação, edição, arquivamento e upload de imagens.
- Criados componentes administrativos para login, guard, lista de posts e formulário editorial.
- O painel permite editar `title`, `category`, `description`, `image_url`, imagem via upload, `status` e `published_at`.
- A opção visual "Rascunho" usa o status real `inactive`, conforme schema atual do Supabase.
- Posts publicados usam `active`; posts arquivados usam `archived`; o limite de 10 ativos segue controlado pelo banco.
- Uploads usam o bucket `magazine-images` dentro da pasta obrigatória `magazine/`.
- Adicionado rewrite em `vercel.json` para permitir acesso direto a `/admin` em produção.
- A landing pública, Hero, Header, Footer, SEO, animações e fallback estático da Revista foram preservados.

### CMS 07.1 — Correção visual da Revista dinâmica e acesso editorial

- Corrigido bug visual em que cards dinâmicos da Revista ficavam quase invisíveis após carregar dados do Supabase.
- Causa identificada: os posts dinâmicos entravam depois da inicialização do reveal ao scroll e não recebiam o estado `.is-visible`.
- Posts vindos do Supabase seguem normalizados para o mesmo formato do fallback: `title`, `category`, `description`, `image` e `imageAlt`.
- Categorias da Revista passaram a funcionar como filtros acessíveis, mantendo a mesma linguagem visual aprovada.
- Mantido fallback estático quando Supabase falhar, estiver vazio ou sem variáveis de ambiente.
- Adicionado link discreto "Área editorial" no Footer apontando para `/admin`.
- Build, lint, localhost `/` e localhost `/admin` foram validados.

### CMS 07.2 — Refinamento Sobre Ellen e acesso editorial

- Hover dos microblocos da seção Sobre Ellen foi refinado para remover aparência de caixa/card de interface.
- Efeito global de card foi neutralizado localmente nos microblocos, mantendo apenas marcador e leitura editorial discreta.
- Acesso "Área editorial" foi reforçado no rodapé inferior do Footer, mantendo o link também na navegação.
- Link do admin segue discreto, abre na mesma aba e aponta para `/admin`.
- Revista dinâmica segue conectada ao Supabase, com 3 posts ativos retornando da API.
- Build, lint, localhost `/` e localhost `/admin` foram validados.

### CMS 07.3 — Acesso editorial no Header e limpeza visual Sobre Ellen

- Microblocos da seção Sobre Ellen tiveram qualquer aparência de box/card removida com sobrescrita local explícita.
- Background, sombra, borda externa e deslocamento herdados do efeito global de cards foram neutralizados.
- Hover dos microblocos agora mantém apenas texto, marcador discreto e linha divisória fina.
- Adicionado link "Área editorial" no Header principal, visível no desktop e no menu mobile.
- O acesso editorial aponta para `/admin`, abre na mesma aba e usa `aria-label="Acessar área editorial"`.
- Hero, Revista dinâmica, Supabase, SEO, banco/RLS e fallback foram preservados.
- Build, lint, localhost `/`, localhost `/admin` e leitura de 3 posts ativos no Supabase foram validados.

### Fase CMS 08 — Profissionalização do painel editorial

- Topo do painel administrativo recebeu dashboard editorial com total de conteúdos, publicados, rascunhos, arquivados e última publicação.
- Lista de posts passou a exibir contador editorial completo: total, publicados, rascunhos, arquivados e limite de 10 ativos.
- Títulos da lista deixam de ser truncados em uma linha e passam a quebrar com elegância em até duas linhas.
- Status dos posts foram transformados em badges visuais compatíveis com a identidade Ellen Paiva.
- Upload de imagem recebeu validações de tipo e tamanho, mensagens de progresso e erros amigáveis.
- Serviço administrativo passou a tratar erros de bucket, permissão/RLS, sessão expirada, conexão e Supabase com mensagens mais claras.
- Landing pública, Header, Hero, Footer, SEO, Auth, Profiles, RLS, Supabase e fallback público da Revista foram preservados.
- Build, lint, localhost `/`, localhost `/admin` e leitura pública de posts ativos foram validados.

### Fase CMS 08.1 — Ajustes de UX e fluxo editorial

- Formulário do admin passou a validar campos individualmente com mensagens específicas por campo.
- Publicação sem imagem agora exibe "Envie uma imagem para publicar este conteudo." próximo ao upload.
- Título ausente, categoria ausente, descrição curta insuficiente e data inválida recebem mensagens próprias.
- Campos inválidos recebem destaque visual discreto com `aria-invalid` e `aria-describedby`.
- Após salvar rascunho ou publicar com sucesso, o formulário volta para "Novo conteudo".
- Reset completo limpa título, categoria, descrição, status, data, URL, preview, mensagens internas e arquivo selecionado.
- Input file passou a ser limpo via ref para remover também o nome do arquivo exibido pelo navegador.
- Categorias do admin passaram a reutilizar a mesma fonte da Revista pública para evitar divergência de filtros.
- Landing pública, Supabase, SEO, banco/RLS e integração validada foram preservados.
- Build, lint, localhost `/` e localhost `/admin` foram validados.

### Fase CMS 09 — Produtividade editorial

- Painel administrativo recebeu busca instantânea por título, categoria e descrição.
- Adicionados filtros rápidos por status: Todos, Publicados, Rascunhos e Arquivados, com contagem dinâmica.
- Lista de posts passou a permitir ordenação por Mais recentes, Mais antigos, A-Z e Z-A.
- Cards do dashboard editorial agora são clicáveis e aplicam filtros por status.
- Adicionada ação "Duplicar", criando uma cópia do conteúdo como rascunho.
- Adicionada ação "Excluir" com confirmação antes da remoção definitiva do banco.
- Formulário recebeu pré-visualização do card da Revista com imagem, categoria, título e descrição.
- Mensagens de sucesso foram refinadas para salvar, publicar, arquivar, duplicar e excluir.
- Landing pública, Supabase, SEO, banco/RLS, identidade visual pública e fallback foram preservados.
- Build, lint, localhost `/`, localhost `/admin` e leitura pública de posts ativos foram validados.

### Fase CMS 10 - Artigos individuais e SEO editorial

- Criada rota `/revista/:slug` para artigos individuais da Revista Ellen Paiva.
- Cards da Revista passaram a apontar para a pagina propria do artigo, preservando o layout visual aprovado.
- Adicionado utilitario de slug para gerar URLs editoriais a partir dos titulos.
- Servico publico da Revista passou a normalizar `slug` e `content`, mantendo fallback compativel com o schema anterior.
- Pagina de artigo recebeu breadcrumb, tempo estimado de leitura, compartilhamento em WhatsApp/Facebook/LinkedIn e posts relacionados da mesma categoria.
- SEO dinamico por artigo preparado com title, description, canonical, Open Graph e Twitter Card.
- Painel administrativo passou a permitir edicao manual de `slug` e `content` sem alterar a landing publica.
- Criada migracao planejada em `docs/supabase-magazine-article-migration.sql` para adicionar `slug`, `content`, indices e constraints no Supabase.
- A migracao do banco nao foi executada automaticamente; deve ser aplicada manualmente no Supabase SQL Editor antes do uso editorial completo em producao.

### CMS 10.1 - Migracao de artigos executada no Supabase

- Migração `docs/supabase-magazine-article-migration.sql` ajustada para não depender da coluna `created_at` no Supabase real.
- Supabase real recebeu as colunas `slug` e `content` em `public.magazine_posts`.
- Posts existentes receberam slug editorial baseado no titulo, com sufixo automatico para duplicados.
- Campo `content` foi preenchido com fallback de `description` para preservar os posts antigos.
- Validação em leitura confirmou 10 registros retornando com `id`, `title`, `slug`, `content` e `status`.
- Rota local `/revista/detalhes-que-elevam-uma-producao-simples` respondeu HTTP 200 com slug real.
- Landing publica, Auth, RLS, SEO visual, layout e CMS existente foram preservados.

### Fase CMS 11 - Newsletter conectada ao Supabase

- Criado SQL planejado em `docs/supabase-newsletter.sql` para a tabela `newsletter_subscribers`.
- A tabela planejada possui `id`, `email`, `name`, `source`, `status`, `created_at` e `updated_at`.
- SQL ativa RLS, permite insert publico controlado e bloqueia leitura publica dos inscritos.
- Leitura/atualizacao futura de leads fica restrita a usuarios autenticados com `profiles.can_edit_magazine = true`.
- Criado `src/services/newsletterService.js` com validacao de e-mail, tratamento de duplicidade e mensagens amigaveis.
- Formulario publico da Newsletter foi conectado ao servico, com estados de carregamento, sucesso e erro.
- Mensagens previstas: inscricao realizada, e-mail duplicado, e-mail invalido e erro geral amigavel.
- Se Supabase nao estiver configurado ou a tabela ainda nao existir, a landing continua funcionando e exibe erro amigavel.
- SQL real ainda nao foi executado no Supabase; executar `docs/supabase-newsletter.sql` antes de validar captura real.
- Dashboard de leads fica pendente para uma fase futura.

### Fase CMS 11.1 - Newsletter real validada

- Tabela `newsletter_subscribers` criada no Supabase real e validada pela API.
- Envio real de lead pela rota publica do Supabase retornou `201 Created`.
- Persistencia foi confirmada pelo bloqueio posterior do mesmo e-mail na constraint unica.
- E-mail duplicado retornou erro `23505`, tratado pelo service como "Este e-mail ja esta cadastrado.".
- E-mail invalido foi bloqueado pela constraint do banco e tambem e bloqueado no frontend pelo service.
- Leitura publica de leads retornou lista vazia, confirmando que a RLS nao expoe inscritos.
- Formulario publico mantem mensagens de sucesso, erro amigavel, carregamento e validacao sem alterar identidade visual.
- Dashboard de leads segue pendente para fase futura.

### CMS 12.1 - Revista com leitura editorial premium

- Secao Revista refinada para leitura mais proxima de blog/editorial de moda premium.
- Primeiro post ativo passou a funcionar como materia principal em destaque, com imagem maior, categoria, tempo estimado de leitura, titulo, descricao e CTA "Ler editorial".
- Demais posts passaram para uma lista editorial secundaria mais leve, preservando imagem, categoria, titulo, descricao e link para `/revista/:slug`.
- Filtros de categoria foram refinados para parecerem editorias de revista, com menos aparencia de botao.
- Aparencia de cards comuns foi reduzida com menos borda, menos caixa e mais respiro tipografico.
- Supabase, fallback estatico, filtros, slugs, links dos artigos, Smart Style escuro, SEO e area admin foram preservados.

### CMS 12.2 - Cadastro controlado de editores

- Tela `/admin` passou a ter dois modos: "Entrar" e "Solicitar acesso editorial".
- Cadastro solicita nome, e-mail, senha e confirmação de senha com validações amigáveis.
- Serviço de autenticação recebeu `signUpEditor` e `createPendingProfile`.
- Novo cadastro cria usuário no Supabase Auth e tenta criar profile com `role = 'editor'` e `can_edit_magazine = false`.
- Após cadastro, o usuário recebe a mensagem "Cadastro recebido. Aguarde aprovação para acessar a área editorial.".
- Cadastro não chama `onAuthenticated`, não libera painel automaticamente e faz logout após criar o profile pendente.
- Guard do admin segue exigindo `profiles.can_edit_magazine = true`; usuário pendente continua sem acesso.
- Criado SQL separado em `docs/supabase-editor-signup-policy.sql` para permitir insert controlado do próprio profile pendente.
- Aprovação continua manual nesta fase: Supabase > Table Editor > `profiles` > alterar `can_edit_magazine` para `true`.
- Tela de aprovação de usuários fica pendente para fase futura.

### CMS 12.2.1 - Correção do cadastro pendente de editor

- Fluxo de cadastro editorial passou a criar o profile pendente usando exatamente `data.user.email` retornado pelo Supabase Auth.
- Insert em `public.profiles` envia apenas `id`, `email`, `name`, `role = 'editor'` e `can_edit_magazine = false`.
- Nenhum campo `created_at`, `updated_at` ou permissão editorial é enviado pelo frontend.
- Cadastro agora verifica se o `signUp` retornou sessão válida antes de tentar inserir o profile.
- Se o projeto exigir confirmação de e-mail antes de sessão autenticada, o app não tenta inserir profile e informa o motivo.
- Logs técnicos em desenvolvimento foram adicionados para mostrar `message`, `code`, `details` e `hint` do Supabase sem expor esses dados em produção.
- Login antigo, admin atual e bloqueio por `can_edit_magazine` foram preservados.

### CMS 12.2.2 - Correção da validação de e-mail no cadastro editorial

- Validação local de e-mail do cadastro editorial foi revisada em `AdminLogin.jsx`.
- E-mail agora é normalizado com remoção de caracteres invisíveis, `trim()` e lowercase antes da validação.
- Regex foi ajustada para aceitar formatos comuns como `nome@gmail.com`, `nome.sobrenome@gmail.com`, `nome+teste@gmail.com` e `nome@empresa.com.br`.
- O envio para `signUpEditor` usa o e-mail já normalizado.
- Login, Auth, policies, profiles, Revista e landing pública foram preservados.
- Teste local da regex confirmou: e-mail vazio e inválido bloqueados; e-mails válidos aceitos.

### CMS 12.2.3 - Debug e centralizacao da validacao de e-mail

- Criado `src/utils/emailValidation.js` para centralizar normalizacao, regex e diagnostico da validacao editorial.
- `AdminLogin.jsx` deixou de ter regex local duplicada e passou a usar o utilitario compartilhado.
- `authService.js` passou a usar o mesmo normalizador antes do `signUp` no Supabase.
- Em desenvolvimento, o cadastro editorial registra no console `emailRaw`, `emailNormalized`, `regexResult` e `reason` antes de bloquear ou aceitar o envio.
- O formato `nosfied@gmail.com` foi validado explicitamente como e-mail aceito pela regex centralizada.
- Landing publica, Supabase, Revista, Auth e layout visual foram preservados.

### CMS 12.2.4 - Rastreamento da mensagem de e-mail do cadastro editorial

- Projeto auditado para localizar todas as ocorrencias de "Informe um e-mail valido".
- Ocorrencias confirmadas em `AdminLogin.jsx`, `authService.js` e `newsletterService.js`.
- Formulario do admin recebeu `noValidate` para impedir que validacao HTML5 nativa masque o fluxo React.
- `AdminLogin.jsx` passou a registrar em desenvolvimento o handler chamado, e-mail bruto, e-mail normalizado, resultado da regex e origem exata de cada `setError`.
- Erro do Supabase deixou de mapear qualquer mensagem contendo "email" para e-mail invalido; agora apenas mensagens realmente relacionadas a formato invalido usam essa copy.
- Erros comuns do Supabase Auth passaram a ter mensagens especificas para cadastro desativado, falha de SMTP/confirmacao, rate limit e erro ao salvar usuario.
- Em desenvolvimento, erros desconhecidos do Auth mostram o detalhe bruto em `[DEV: ...]` para diagnostico direto no painel.
- Troca de modo e digitacao continuam limpando mensagens antigas do formulario.
- Landing publica, Supabase, Revista, SEO e visual foram preservados.

### CMS 12.2.4 - Logout em acesso negado e expiracao de sessao admin

- Tela de acesso negado do `/admin` recebeu os botoes "Sair e voltar ao login" e "Voltar para o site".
- Usuario autenticado sem `can_edit_magazine = true` pode encerrar a sessao e voltar ao login sem ficar preso.
- Area administrativa passou a registrar atividade local do editor em `localStorage`.
- Sessao autorizada expira apos 30 minutos sem atividade no painel, executando `signOut` e exibindo "Sua sessao expirou. Faca login novamente.".
- Atividade no painel atualiza o tempo local por clique, teclado, scroll e movimento do mouse.
- Landing publica, Revista, Supabase schema, posts, RLS e SEO foram preservados.

### CMS 12.3 - Tendencia como ponte comercial

- Secao Tendencia refinada para funcionar como ponte comercial elegante entre a autoridade da Ellen e a loja Tendencia Multimarcas.
- Narrativa passou a conectar a curadoria da Ellen a escolhas prontas para a vida real.
- CTA principal foi ajustado para "Conhecer a curadoria", mantendo o Linktree oficial aprovado.
- Diferenciais foram reposicionados como valor editorial: curadoria, rotina real, atendimento proximo e escolhas que facilitam o vestir.
- Hierarquia visual, contraste escuro, imagem, espacamento e responsividade da secao foram refinados sem alterar Revista, Admin, Supabase ou SEO.

### CMS 12.4 - Newsletter como convite de curadoria

- Newsletter refinada para comunicar convite de curadoria, nao apenas formulario de e-mail.
- Copy passou a destacar curadoria da Ellen, tendencias praticas, combinacoes inteligentes, novidades da Tendencia e conteudos da Revista.
- CTA foi ajustado para "Entrar para a curadoria".
- Microcopy passou para "Sem excesso. Apenas escolhas bem pensadas.".
- Estados de carregamento, sucesso, erro, duplicidade e e-mail invalido foram preservados pelo mesmo servico Supabase.
- Revista publica passou a diferenciar Supabase vazio de fallback: se o banco estiver configurado e sem posts ativos, exibe estado vazio com link para `/admin` em vez de mostrar posts estaticos antigos.
- Fallback estatico da Revista permanece apenas para ausencia de env, erro de conexao ou indisponibilidade do Supabase.

### CMS 12.5 - Refinamento da secao Sobre Ellen

- Secao Sobre Ellen recebeu pausa autoral com a frase "Vestir bem a vida real comeca por entender quem se e.".
- Hierarquia editorial foi refinada com melhor ritmo entre titulo, textos, frase de assinatura e notas finais.
- Microblocos finais foram preservados como notas editoriais sem aparencia de card/box.
- Fundo claro, dourado envelhecido, verde profundo, imagem editorial e responsividade foram mantidos.
- Hero, Smart Style, Revista, Tendencia, Newsletter, Admin, Supabase e SEO foram preservados.

### CMS 12.6 - Polimento visual global da landing

- Ajustes globais de foco visivel foram ampliados para filtros da Revista, campos da Newsletter, links editoriais e acesso administrativo discreto.
- CTAs principais receberam microconsistencia de tracking, altura minima mobile e leitura mais uniforme.
- Smart Style e Tendencia foram levemente diferenciadas nas atmosferas escuras para manter unidade sem repeticao visual.
- Newsletter teve CTA refinado em escala e leitura mobile.
- Estado vazio da Revista recebeu ajuste de largura no link para melhorar responsividade.
- Admin, Supabase, SEO, estrutura, textos principais e funcionalidades foram preservados.

### Ajuste Admin - card de ultima publicacao

- Card "Ultima publicacao" recebeu classe propria para conter datas e o estado "Sem publicacao" sem estourar a area do dashboard.
- Texto longo agora quebra dentro do card com escala menor que os contadores numericos.
- Ajuste limitado ao painel administrativo; landing publica, Revista, Supabase e SEO foram preservados.

### Responsive UX 01 - Reestruturacao mobile e respiro global

- Criada escala global de espacamento para padding de container, secoes e gaps responsivos.
- Landing recebeu mais respiro mobile entre Hero, Sobre Ellen, Smart Style, Revista, Tendencia, Newsletter e Footer.
- Header mobile teve menu e CTA ajustados para melhor toque e leitura.
- Pagina de artigo `/revista/:slug` recebeu escala mobile propria para breadcrumb, titulo, imagem, conteudo, compartilhamento e relacionados.
- Admin `/admin` recebeu melhorias responsivas no login, dashboard, lista, formulario, filtros e botoes.
- Supabase, Auth, Revista dinamica, Newsletter, SEO, rotas, banco, RLS e textos principais foram preservados.

### CMS 13.0 - Seguranca editorial, recuperacao de senha e aprovacao de editores

- Link "Area editorial" foi removido do Header publico; o admin continua acessivel por URL direta em `/admin` e por acessos discretos ja previstos fora do Header.
- Newsletter auditada: o formulario envia para `newsletter_subscribers` os campos `name`, `email`, `source = landing-newsletter` e `status = active`; `created_at` fica a cargo do default do banco.
- Newsletter preserva tratamento de e-mail invalido, duplicidade, sucesso e erro amigavel. Teste manual sugerido: Nome `Teste Newsletter`, Email `teste-newsletter@teste.com`, validar em `newsletter_subscribers`.
- Login e cadastro editorial receberam controle acessivel de mostrar/ocultar senha.
- Criado fluxo "Esqueceu sua senha?" usando Supabase Auth `resetPasswordForEmail` com retorno para `/admin/reset-password`.
- Criado formulario de nova senha em `/admin/reset-password`, usando Supabase Auth `updateUser`, sem service role ou secret key.
- Painel admin passou a exibir "Solicitacoes editoriais" apenas para `role = admin`, com acoes de aprovar e reprovar mantendo `can_edit_magazine` como regra central.
- Criado SQL pendente `docs/supabase-editor-approval-policies.sql` para permitir que admins leiam e atualizem profiles editoriais via RLS.
- Landing publica, Hero, Sobre, Smart Style, Revista publica, Tendencia, visual da Newsletter, SEO, posts, banco da Revista e RLS existente foram preservados.

### CMS 14.0 - Assistente Editorial Interativo

- Criado Assistente Editorial opcional para orientar novos usuarios do `/admin` sem alterar a landing publica.
- Primeiro acesso exibe modal "Bem-vinda a area editorial" com opcoes "Iniciar tour", "Agora nao" e "Nao mostrar novamente".
- Preferencia "Nao mostrar novamente" e persistida em `localStorage` pela chave `editorial-tour-dismissed`.
- Botao permanente "Primeiros passos" permite reabrir o tour a qualquer momento.
- Tour guiado destaca Novo conteudo, Titulo, Categoria, Imagem, Conteudo, Publicar, Dashboard e Newsletter.
- Assistente pode ser fechado com `Esc` e funciona em desktop/mobile sem alterar Supabase, banco, SEO, login, Revista publica ou Newsletter publica.
- Campos principais do formulario receberam tooltips discretos para Slug, Categoria, Imagem e Publicacao.
