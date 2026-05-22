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
