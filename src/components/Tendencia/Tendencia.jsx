import { assets } from '../../assets/assetsMap.js';
import { publicSiteSettingsFallback } from '../../services/siteSettingsPublicService.js';
import './Tendencia.css';

const highlights = [
  'Moda feminina com curadoria',
  'Peças para rotina real',
  'Atendimento próximo',
  'Escolhas que facilitam o vestir',
];

function Tendencia({ settings = publicSiteSettingsFallback }) {
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
              href={settings.tendencia_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Conhecer a curadoria da Tendência"
            >
              Conhecer a curadoria
            </a>
            <a
              className="tendencia-button"
              href={settings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver no Instagram"
            >
              Ver no Instagram
            </a>
            <a
              className="tendencia-button tendencia-button-whatsapp"
              href={settings.whatsapp_url}
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
