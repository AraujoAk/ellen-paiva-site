import { assets } from '../../assets/assetsMap.js';
import './Tendencia.css';

const instagramUrl = 'https://www.instagram.com/direct/t/107763033955970/';
const tendenciaUrl = '/tendencia';
const whatsappUrl = 'https://tr.ee/-R-sQ_hJqC';

const highlights = [
  'Curadoria selecionada',
  'Atendimento personalizado',
  'Moda funcional e versátil',
  'Experiência feminina',
];

function Tendencia() {
  return (
    <section className="tendencia page-section" id="tendencia" aria-labelledby="tendencia-title">
      <div className="tendencia-container section-container">
        <div className="tendencia-media reveal reveal-up" aria-label="Imagem editorial temporária da Tendência Multimarcas">
          <div className="tendencia-image-placeholder">
            {assets.tendenciaStore ? (
              <img src={assets.tendenciaStore} alt="Loja Tendência Multimarcas" className="tendencia-image" />
            ) : assets.tendenciaLogo ? (
              <img src={assets.tendenciaLogo} alt="Tendência Multimarcas" className="tendencia-placeholder-logo" />
            ) : (
              <span>Tendência Multimarcas</span>
            )}
          </div>
        </div>

        <div className="tendencia-content reveal reveal-up reveal-delay-1">
          {assets.tendenciaLogo && (
            <img src={assets.tendenciaLogo} alt="Tendência Multimarcas" className="tendencia-logo" />
          )}
          <p className="tendencia-eyebrow">Tendência Multimarcas</p>
          <h2 id="tendencia-title" className="tendencia-title">
            Curadoria que transforma estilo em experiência.
          </h2>
          <p className="tendencia-text">
            Há anos selecionando peças que acompanham a vida real de mulheres
            maduras, sofisticadas e práticas, a Tendência Multimarcas nasceu do
            desejo de unir elegância, conforto e identidade em um único espaço.
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
              aria-label="Conhecer a página institucional da Tendência Multimarcas"
            >
              Conhecer a Tendência
            </a>
            <a
              className="tendencia-button"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver Instagram da Tendência em nova aba"
            >
              Ver no Instagram
            </a>
            <a
              className="tendencia-button tendencia-button-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp em nova aba"
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
