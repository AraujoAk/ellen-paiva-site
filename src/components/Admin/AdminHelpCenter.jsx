import { useEffect, useMemo, useState } from 'react';

const helpSections = [
  {
    title: 'Primeiros passos',
    summary: 'Fluxo essencial para publicar e manter a Revista organizada.',
    articles: [
      {
        title: 'Como criar um post',
        steps: [
          'Clique em Novo post.',
          'Preencha titulo, categoria e descricao curta.',
          'Escreva o conteudo completo do artigo.',
          'Escolha uma imagem e salve como rascunho ou publique.',
        ],
      },
      {
        title: 'Como editar um post',
        steps: [
          'Selecione o post na lista de conteudos.',
          'Ajuste texto, imagem, categoria, data ou status.',
          'Clique em Salvar para registrar as alteracoes.',
        ],
      },
      {
        title: 'Como publicar um post',
        steps: [
          'Revise titulo, slug, descricao, conteudo e imagem.',
          'Altere o status para Publicado.',
          'Clique em Publicar para exibir o conteudo na Revista.',
        ],
      },
    ],
  },
  {
    title: 'Agenda Editorial',
    summary: 'Organizacao por data e publicacoes planejadas.',
    articles: [
      {
        title: 'Como agendar publicacoes',
        steps: [
          'Crie ou edite um post.',
          'Mantenha o status como Rascunho.',
          'Informe uma data futura no campo de publicacao.',
          'Acompanhe o item na Agenda Editorial como Planejado.',
        ],
      },
      {
        title: 'Como funciona a publicacao automatica',
        steps: [
          'O cron verifica posts planejados a cada 5 minutos.',
          'Posts em rascunho com data vencida viram publicados automaticamente.',
          'Posts arquivados ou sem data nao sao alterados.',
        ],
      },
    ],
  },
  {
    title: 'Biblioteca de Imagens',
    summary: 'Uploads, reutilizacao e organizacao visual dos artigos.',
    articles: [
      {
        title: 'Como enviar imagens',
        steps: [
          'Use o campo Enviar imagem no formulario do post.',
          'Aguarde a confirmacao de upload.',
          'A imagem sera aplicada automaticamente ao preview do artigo.',
        ],
      },
      {
        title: 'Como reutilizar imagens existentes',
        steps: [
          'Clique em Escolher da biblioteca.',
          'Use busca ou filtros para encontrar a imagem.',
          'Clique em Usar esta imagem para aplicar ao post.',
        ],
      },
      {
        title: 'Como evitar duplicidade',
        steps: [
          'O painel reaproveita imagens iguais quando detecta o mesmo arquivo.',
          'Prefira selecionar da biblioteca quando a imagem ja existir.',
          'Duplicadas antigas podem continuar no storage, mas a interface tenta reduzir repeticao visual.',
        ],
      },
    ],
  },
  {
    title: 'Newsletter',
    summary: 'Audiencia propria e leitura dos inscritos.',
    articles: [
      {
        title: 'O que e a Newsletter',
        steps: [
          'E a base de contatos cadastrados pela landing publica.',
          'Ela ajuda a criar relacionamento fora das redes sociais.',
        ],
      },
      {
        title: 'Como visualizar inscritos',
        steps: [
          'Confira os numeros no Dashboard Executivo.',
          'Veja total, novos dos ultimos 30 dias e ultimo inscrito quando sua permissao permitir.',
        ],
      },
      {
        title: 'Como interpretar a audiencia',
        steps: [
          'Crescimento recente indica interesse nos conteudos.',
          'Use os dados para planejar editoriais, novidades e campanhas.',
        ],
      },
    ],
  },
  {
    title: 'Editores',
    summary: 'Controle de acesso ao painel editorial.',
    articles: [
      {
        title: 'Como aprovar um editor',
        steps: [
          'Acesse a area Editores.',
          'Confira nome e e-mail da solicitacao.',
          'Aprove apenas pessoas autorizadas pela equipe.',
        ],
      },
      {
        title: 'Diferenca entre Admin e Editor',
        steps: [
          'Admin ve aprovacoes, configuracoes e controles institucionais.',
          'Editor aprovado pode gerenciar conteudos da Revista.',
        ],
      },
    ],
  },
  {
    title: 'Configuracoes da Marca',
    summary: 'Dados institucionais usados em links e informacoes variaveis.',
    articles: [
      {
        title: 'O que cada campo controla',
        steps: [
          'Nome da marca e responsavel identificam a comunicacao.',
          'Instagram, WhatsApp e Tendencia controlam links publicos.',
          'E-mail e assinatura ajudam a manter consistencia institucional.',
        ],
      },
      {
        title: 'Onde aparecem no site',
        steps: [
          'Links podem aparecer em Header, Footer e secao Tendencia.',
          'Se uma configuracao falhar, o site usa fallback seguro.',
        ],
      },
    ],
  },
  {
    title: 'Historico de Atividades',
    summary: 'Registro das principais acoes feitas no painel.',
    articles: [
      {
        title: 'O que e registrado',
        steps: [
          'Criacao, edicao, publicacao, arquivamento, duplicacao e exclusao de posts.',
          'Aprovacoes de editores e alteracoes de configuracoes da marca.',
        ],
      },
      {
        title: 'Como acompanhar acoes do painel',
        steps: [
          'Abra Atividades no Admin.',
          'Use Atualizar para recarregar os registros mais recentes.',
        ],
      },
    ],
  },
  {
    title: 'Duvidas frequentes',
    summary: 'Respostas rapidas para problemas comuns.',
    articles: [
      {
        title: 'Meu post nao apareceu.',
        steps: [
          'Confirme se o status esta Publicado.',
          'Verifique se a data de publicacao nao esta no futuro.',
          'Recarregue a landing publica para confirmar a leitura dinamica.',
        ],
      },
      {
        title: 'Minha imagem nao carregou.',
        steps: [
          'Confira se o upload terminou com sucesso.',
          'Tente selecionar a imagem pela Biblioteca.',
          'Use formatos WebP, JPG, JPEG ou PNG.',
        ],
      },
      {
        title: 'Nao consigo acessar o Admin.',
        steps: [
          'Confirme e-mail e senha.',
          'Se o cadastro for novo, aguarde aprovacao.',
          'Use recuperar senha se necessario.',
        ],
      },
      {
        title: 'O post agendado nao publicou.',
        steps: [
          'Confirme se ele esta como Rascunho.',
          'Confira se a data ja passou.',
          'Aguarde ate 5 minutos, pois o cron roda em intervalos.',
        ],
      },
      {
        title: 'Como trocar links de Instagram/WhatsApp?',
        steps: [
          'Acesse Configuracoes da Marca.',
          'Atualize os campos de Instagram ou WhatsApp.',
          'Salve e valide os links na landing publica.',
        ],
      },
      {
        title: 'Como recuperar senha?',
        steps: [
          'Na tela de login, clique em Esqueci minha senha.',
          'Informe o e-mail cadastrado.',
          'Siga o link recebido para criar uma nova senha.',
        ],
      },
    ],
  },
];

function filterHelpSections(sections, searchTerm) {
  const query = searchTerm.trim().toLowerCase();

  if (!query) {
    return sections;
  }

  return sections
    .map((section) => ({
      ...section,
      articles: section.articles.filter((article) =>
        [section.title, section.summary, article.title, ...article.steps].some((text) =>
          text.toLowerCase().includes(query),
        ),
      ),
    }))
    .filter((section) => section.articles.length > 0);
}

function AdminHelpCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(helpSections[0].title);
  const [openArticle, setOpenArticle] = useState(helpSections[0].articles[0].title);
  const [searchTerm, setSearchTerm] = useState('');

  const visibleSections = useMemo(() => filterHelpSections(helpSections, searchTerm), [searchTerm]);
  const selectedSection = visibleSections.find((section) => section.title === activeCategory) || visibleSections[0];

  function closeHelp() {
    setIsOpen(false);
  }

  function reopenTour() {
    window.dispatchEvent(new CustomEvent('open-editorial-tour'));
    closeHelp();
  }

  function handleCategoryChange(title) {
    const section = helpSections.find((item) => item.title === title);

    setActiveCategory(title);
    setOpenArticle(section?.articles[0]?.title || '');
  }

  useEffect(() => {
    if (visibleSections.length > 0 && !visibleSections.some((section) => section.title === activeCategory)) {
      handleCategoryChange(visibleSections[0].title);
    }
  }, [activeCategory, visibleSections]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        closeHelp();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button className="admin-help-trigger" type="button" onClick={() => setIsOpen(true)} data-tour="help-center">
        Central de ajuda
      </button>

      {isOpen && (
        <div className="admin-help-backdrop" role="presentation">
          <section className="admin-help-modal" role="dialog" aria-modal="true" aria-labelledby="admin-help-title">
            <header className="admin-help-header">
              <div>
                <p className="admin-kicker">Ajuda editorial</p>
                <h2 id="admin-help-title">Central de ajuda</h2>
              </div>
              <button className="admin-button admin-button-secondary" type="button" onClick={closeHelp}>
                Fechar
              </button>
            </header>

            <div className="admin-help-body">
              <div className="admin-help-intro">
                <div>
                  <p>Um guia pratico para criar, publicar e organizar a operacao editorial da Ellen Paiva.</p>
                  <label className="admin-help-search">
                    <span>Buscar na ajuda</span>
                    <input
                      type="search"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Ex: agendar, imagem, senha..."
                    />
                  </label>
                </div>
                <button className="admin-button admin-button-primary" type="button" onClick={reopenTour}>
                  Reabrir tour guiado
                </button>
              </div>

              {visibleSections.length > 0 ? (
                <div className="admin-help-layout">
                  <nav className="admin-help-categories" aria-label="Categorias da Central de Ajuda">
                    {visibleSections.map((section) => (
                      <button
                        key={section.title}
                        type="button"
                        className={selectedSection?.title === section.title ? 'is-active' : ''}
                        onClick={() => handleCategoryChange(section.title)}
                      >
                        <strong>{section.title}</strong>
                        <span>{section.articles.length} topicos</span>
                      </button>
                    ))}
                  </nav>

                  <div className="admin-help-content">
                    <div className="admin-help-section-heading">
                      <p className="admin-kicker">Guia</p>
                      <h3>{selectedSection.title}</h3>
                      <p>{selectedSection.summary}</p>
                    </div>

                    <div className="admin-help-accordion">
                      {selectedSection.articles.map((article) => {
                        const isArticleOpen = openArticle === article.title;

                        return (
                          <article className="admin-help-section" key={article.title}>
                            <button type="button" onClick={() => setOpenArticle(isArticleOpen ? '' : article.title)}>
                              <span>{article.title}</span>
                              <small>{isArticleOpen ? 'Fechar' : 'Abrir'}</small>
                            </button>

                            {isArticleOpen && (
                              <ol>
                                {article.steps.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ol>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="admin-empty">Nenhum topico encontrado para esta busca.</p>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default AdminHelpCenter;
