import { assets } from '../../assets/assetsMap.js';
import './SmartStyle.css';

const styleMoments = [
  {
    title: 'Momento casual',
    description: 'Combinações leves para uma rotina prática sem perder presença.',
    image: assets.smartCasual,
    imageAlt: 'Produção casual com estilo inteligente',
  },
  {
    title: 'Momento trabalho',
    description: 'Peças coordenadas para transmitir segurança, conforto e elegância.',
    image: assets.smartWork,
    imageAlt: 'Produção de trabalho com moda funcional',
  },
  {
    title: 'Momento lazer',
    description: 'Produções fluidas para circular bem entre descanso e compromisso.',
    image: assets.smartLeisure,
    imageAlt: 'Produção de lazer com elegância cotidiana',
  },
  {
    title: 'Momento especial',
    description: 'Detalhes sofisticados para transformar o essencial em memorável.',
    image: assets.smartSpecial,
    imageAlt: 'Produção especial com sofisticação',
  },
];

function SmartStyle() {
  return (
    <section
      className="smart-style page-section"
      id="estilo-inteligente"
      aria-labelledby="smart-style-title"
    >
      <div className="smart-style-container section-container">
        <div className="smart-style-heading reveal reveal-up">
          <p className="eyebrow">Estilo inteligente</p>
          <h2 id="smart-style-title" className="smart-style-title">
            Uma peça. Várias possibilidades.
          </h2>
          <p className="smart-style-subtitle">
            Peças inteligentes se adaptam à rotina e acompanham mulheres reais
            em diferentes momentos do dia.
          </p>
        </div>

        <div className="smart-style-grid">
          {styleMoments.map((moment) => (
            <article className="smart-style-card reveal reveal-up reveal-delay-1" key={moment.title}>
              <div
                className={`smart-style-card-media smart-style-card-media-${styleMoments.indexOf(moment) + 1}`}
                aria-hidden={!moment.image}
              >
                {moment.image ? (
                  <img
                    src={moment.image}
                    alt={moment.imageAlt}
                    className="smart-style-card-image"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span />
                )}
              </div>
              <div className="smart-style-card-content">
                <h3>{moment.title}</h3>
                <p>{moment.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SmartStyle;
