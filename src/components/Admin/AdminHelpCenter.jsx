import { useEffect, useState } from 'react';

const helpSections = [
  {
    title: 'Primeiros passos',
    items: [
      'Acompanhe o resumo no Dashboard Executivo.',
      'Use a lista de posts para revisar conteudos existentes.',
      'Clique em Novo post para comecar um editorial.',
    ],
  },
  {
    title: 'Como criar um post',
    items: [
      'Clique em Novo post.',
      'Preencha titulo, categoria e descricao curta.',
      'Escreva o conteudo completo do artigo.',
      'Escolha uma imagem ou envie uma nova pela biblioteca.',
    ],
  },
  {
    title: 'Como publicar',
    items: [
      'Revise titulo, slug, texto e imagem.',
      'Altere o status para Publicado.',
      'Clique em Publicar para exibir o conteudo na Revista.',
    ],
  },
  {
    title: 'Como usar a Biblioteca de Imagens',
    items: [
      'Clique em Escolher da biblioteca no formulario.',
      'Busque, filtre ou selecione uma imagem existente.',
      'Para imagem nova, envie pelo campo Enviar imagem.',
    ],
  },
  {
    title: 'Como acompanhar Newsletter',
    items: [
      'Veja total de inscritos no Dashboard Executivo.',
      'Acompanhe novos inscritos dos ultimos 30 dias.',
      'Use esses dados para planejar conteudos e campanhas.',
    ],
  },
  {
    title: 'Como aprovar editores',
    items: [
      'Acesse a area de solicitacoes editoriais.',
      'Confira nome e e-mail de quem pediu acesso.',
      'Clique em Aprovar apenas para pessoas autorizadas.',
    ],
  },
  {
    title: 'Seguranca e acesso',
    items: [
      'Nao compartilhe sua senha.',
      'Saia da conta ao terminar de usar o painel.',
      'Usuarios sem aprovacao nao conseguem editar a Revista.',
    ],
  },
];

function AdminHelpCenter() {
  const [isOpen, setIsOpen] = useState(false);

  function closeHelp() {
    setIsOpen(false);
  }

  function reopenTour() {
    window.dispatchEvent(new CustomEvent('open-editorial-tour'));
    closeHelp();
  }

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
      <button className="admin-help-trigger" type="button" onClick={() => setIsOpen(true)}>
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
                <p>Um guia rapido para criar, publicar e organizar conteudos da Revista Ellen Paiva.</p>
                <button className="admin-button admin-button-primary" type="button" onClick={reopenTour}>
                  Reabrir tour guiado
                </button>
              </div>

              <div className="admin-help-sections">
                {helpSections.map((section) => (
                  <article className="admin-help-section" key={section.title}>
                    <h3>{section.title}</h3>
                    <ol>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default AdminHelpCenter;
