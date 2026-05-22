import { assets } from '../../assets/assetsMap.js';
import './TendenciaPage.css';

const instagramUrl = 'https://www.instagram.com/direct/t/107763033955970/';
const whatsappUrl = 'https://tr.ee/-R-sQ_hJqC';

const atmosphereImages = [
  {
    title: 'Texturas, luz e presença',
    caption: 'Curadoria',
    image: assets.smartCasual,
    alt: 'Composição editorial com acessórios e textura sofisticada',
  },
  {
    title: 'Conforto que acompanha rotina',
    caption: 'Essenciais',
    image: assets.magazine02,
    alt: 'Detalhe editorial de tecido em tons maduros',
  },
  {
    title: 'Pausas, conversa e escolha',
    caption: 'Lifestyle',
    image: assets.newsletterFooter,
    alt: 'Cena intimista de café e lifestyle editorial',
  },
];

const experienceItems = [
  'Atendimento próximo',
  'Escolhas com intenção',
  'Peças para a vida real',
  'Consultoria feminina',
];

const editorialCards = [
  {
    category: 'Estilo',
    title: 'Alfaiataria leve para o calor do Nordeste',
    text: 'Linhas limpas, tecidos confortáveis e presença sem esforço.',
  },
  {
    category: 'Maturidade',
    title: 'Elegância depois dos 40',
    text: 'Menos excesso, mais identidade e escolhas que respeitam a rotina.',
  },
  {
    category: 'Funcionalidade',
    title: 'Peças versáteis para viver melhor',
    text: 'Uma curadoria pensada para acompanhar encontros, trabalho e pausa.',
  },
];

function TendenciaLogo({ className }) {
  if (assets.tendenciaLogo) {
    return <img src={assets.tendenciaLogo} alt="Tendência Multimarcas" className={className} />;
  }

  return <span className={className}>Tendência Multimarcas</span>;
}

function TendenciaPage() {
  return (
    <main className="tendencia-page" id="top">
      <section className="tendencia-page-hero" aria-labelledby="tendencia-page-title">
        <div className="tendencia-page-hero-media reveal reveal-fade" aria-hidden="true">
          {assets.tendenciaStore ? (
            <img
              src={assets.tendenciaStore}
              alt=""
              className="tendencia-page-hero-image"
              fetchPriority="high"
            />
          ) : (
            <div className="tendencia-page-image-fallback" />
          )}
        </div>

        <div className="tendencia-page-hero-overlay" />

        <div className="tendencia-page-hero-content section-container reveal reveal-up">
          <a className="tendencia-page-back-link" href="/" aria-label="Voltar para Ellen Paiva">
            Ellen Paiva
          </a>
          <div className="tendencia-page-hero-brand">
            <TendenciaLogo className="tendencia-page-logo tendencia-page-logo-hero" />
          </div>
          <p className="eyebrow">Curadoria feminina</p>
          <h1 id="tendencia-page-title">Moda para mulheres que não precisam provar nada.</h1>
          <p>
            A Tendência acredita em peças que acompanham rotina, presença e
            identidade. Elegância prática para mulheres reais.
          </p>
          <div className="tendencia-page-actions" aria-label="Ações principais da Tendência">
            <a
              className="tendencia-page-button tendencia-page-button-primary"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conhecer o Instagram da Tendência em nova aba"
            >
              Conhecer o Instagram
            </a>
            <a
              className="tendencia-page-button"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar com a equipe da Tendência em nova aba"
            >
              Falar com a equipe
            </a>
          </div>
        </div>
      </section>

      <section className="tendencia-page-manifest page-section" aria-labelledby="tendencia-manifest-title">
        <div className="tendencia-page-manifest-container section-container">
          <div className="tendencia-page-manifest-brand reveal reveal-fade">
            <TendenciaLogo className="tendencia-page-logo tendencia-page-logo-manifest" />
          </div>
          <div className="tendencia-page-manifest-copy reveal reveal-up reveal-delay-1">
            <p className="eyebrow">Filosofia da marca</p>
            <h2 id="tendencia-manifest-title">Vestir bem também pode ser uma forma de tranquilidade.</h2>
            <p>
              A Tendência nasce de uma curadoria que respeita o tempo, o corpo e
              os compromissos de mulheres maduras. Cada escolha procura unir
              conforto sofisticado, feminilidade e presença.
            </p>
            <p>
              Não se trata de excesso. Trata-se de encontrar peças que entram na
              rotina com naturalidade, atravessam ocasiões e comunicam identidade
              sem precisar explicar demais.
            </p>
          </div>
        </div>
      </section>

      <section className="tendencia-page-atmosphere page-section" aria-labelledby="tendencia-atmosphere-title">
        <div className="section-container">
          <div className="tendencia-page-atmosphere-heading reveal reveal-up">
            <p className="eyebrow">Curadoria editorial</p>
            <h2 id="tendencia-atmosphere-title">Uma estética pensada para acompanhar a vida real.</h2>
          </div>

          <div className="tendencia-page-atmosphere-grid">
            {atmosphereImages.map((item, index) => (
              <article
                className={`tendencia-page-atmosphere-card tendencia-page-atmosphere-card-${index + 1} reveal reveal-up`}
                key={item.title}
              >
                <div className="tendencia-page-atmosphere-media">
                  {item.image ? (
                    <img src={item.image} alt={item.alt} loading="lazy" />
                  ) : (
                    <div className="tendencia-page-image-fallback" />
                  )}
                </div>
                <div className="tendencia-page-atmosphere-copy">
                  <span>{item.caption}</span>
                  <h3>{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tendencia-page-experience page-section" aria-labelledby="tendencia-experience-title">
        <div className="tendencia-page-experience-container section-container">
          <div className="tendencia-page-experience-copy reveal reveal-up">
            <p className="eyebrow">Experiência Tendência</p>
            <h2 id="tendencia-experience-title">Atendimento que escuta antes de sugerir.</h2>
            <p>
              A experiência da Tendência começa na conversa: entender rotina,
              preferências, proporções e momentos de vida. A loja é pensada como
              um espaço de acolhimento, não de pressa.
            </p>
            <div className="tendencia-page-experience-list">
              {experienceItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <div className="tendencia-page-experience-media reveal reveal-fade reveal-delay-1">
            {assets.ellenAbout ? (
              <img
                src={assets.ellenAbout}
                alt="Editorial de atendimento feminino e curadoria Tendência"
                loading="lazy"
              />
            ) : (
              <div className="tendencia-page-image-fallback" />
            )}
          </div>
        </div>
      </section>

      <section className="tendencia-page-editorial page-section" aria-labelledby="tendencia-editorial-title">
        <div className="tendencia-page-editorial-container section-container">
          <div className="tendencia-page-editorial-heading reveal reveal-up">
            <p className="eyebrow">Revista / Estilo</p>
            <h2 id="tendencia-editorial-title">Conteúdo para vestir-se com mais intenção.</h2>
          </div>

          <div className="tendencia-page-editorial-list">
            {editorialCards.map((card) => (
              <article className="tendencia-page-editorial-card reveal reveal-up" key={card.title}>
                <p>{card.category}</p>
                <h3>{card.title}</h3>
                <span>{card.text}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tendencia-page-final page-section" aria-labelledby="tendencia-final-title">
        <div className="tendencia-page-final-media" aria-hidden="true">
          {assets.magazine04 ? (
            <img src={assets.magazine04} alt="" loading="lazy" />
          ) : (
            <div className="tendencia-page-image-fallback" />
          )}
        </div>
        <div className="tendencia-page-final-content section-container reveal reveal-up">
          <TendenciaLogo className="tendencia-page-logo tendencia-page-logo-final" />
          <p className="eyebrow">Tendência Multimarcas</p>
          <h2 id="tendencia-final-title">A Tendência começa na forma como você se sente.</h2>
          <div className="tendencia-page-actions tendencia-page-final-actions">
            <a
              className="tendencia-page-button tendencia-page-button-primary"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Instagram da Tendência em nova aba"
            >
              Instagram
            </a>
            <a
              className="tendencia-page-button"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir WhatsApp da Tendência em nova aba"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TendenciaPage;
