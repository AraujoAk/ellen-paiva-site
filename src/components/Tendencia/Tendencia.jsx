import { assets } from '../../assets/assetsMap.js';
import './Tendencia.css';

const instagramUrl = 'https://www.instagram.com/direct/t/107763033955970/';
const tendenciaUrl = 'https://linktr.ee/tendenciamu?utm_source=linktree_profile_share&ltsid=a98130d2-cc29-41d4-8f87-c76c3462c011';
const whatsappUrl = 'https://tr.ee/-R-sQ_hJqC';

const highlights = [
  'Moda feminina com curadoria',
  'Peças para rotina real',
  'Atendimento próximo',
  'Escolhas que facilitam o vestir',
];

function Tendencia() {
  return (
    <section className="tendencia page-section" id="tendencia" aria-labelledby="tendencia-title">
      <div className="tendencia-container section-container">
        <div className="tendencia-media reveal reveal-up" aria-label="Imagem editorial da Tendência Multimarcas">
          <div className="tendencia-image-placeholder">
            {assets.tendenciaStore ? (
              <img
                src={assets.tendenciaStore}
                alt="Ambiente sofisticado da Tendência Multimarcas"
                className="tendencia-image"
                loading="lazy"
                decoding="async"
              />
            ) : assets.tendenciaLogo ? (
              <img
                src={assets.tendenciaLogo}
                alt="Tendência Multimarcas"
                className="tendencia-placeholder-logo"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <span>Tendência Multimarcas</span>
            )}
          </div>
        </div>

        <div className="tendencia-content reveal reveal-up reveal-delay-1">
          {assets.tendenciaLogo && (
            <img
              src={assets.tendenciaLogo}
              alt="Tendência Multimarcas"
              className="tendencia-logo"
              loading="lazy"
              decoding="async"
            />
          )}
          <p className="tendencia-eyebrow">Tendência Multimarcas</p>
          <h2 id="tendencia-title" className="tendencia-title">
            As escolhas da Ellen ganham vida na Tendência.
          </h2>
          <p className="tendencia-text">
            A Tendência Multimarcas traduz a curadoria de estilo em peças prontas
            para a vida real: elegantes, funcionais e escolhidas para mulheres que
            valorizam presença, conforto e identidade no vestir.
          </p>

          <div className="tendencia-highlights" aria-label="Diferenciais da Tendência Multimarcas">
            {highlights.map((highlight) => (
              <article className="tendencia-highlight" key={highlight}>
                <span>{highlight}</span>
              </article>
            ))}
          </div>

          <div className="tendencia-actions" aria-label="Ações da Tendência Multimarcas">
            <a
              className="tendencia-button tendencia-button-primary"
              href={tendenciaUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conhecer a curadoria da Tendência"
            >
              Conhecer a curadoria
            </a>
            <a
              className="tendencia-button"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver no Instagram"
            >
              Ver no Instagram
            </a>
            <a
              className="tendencia-button tendencia-button-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Tendencia;
