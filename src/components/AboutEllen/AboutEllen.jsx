import { assets } from '../../assets/assetsMap.js';
import './AboutEllen.css';

const credentials = [
  '30 anos no segmento',
  'Curadoria feminina',
  'Elegância cotidiana',
  'Moda funcional',
];

function AboutEllen() {
  return (
    <section className="about-ellen page-section" id="sobre" aria-labelledby="about-ellen-title">
      <div className="about-ellen-container section-container">
        <div className="about-ellen-content reveal reveal-up">
          <p className="eyebrow">Sobre Ellen</p>
          <h2 id="about-ellen-title" className="about-ellen-title">
            Uma curadoria de moda feita para mulheres com presença.
          </h2>
          <p className="about-ellen-text">
            Ellen Paiva construiu sua trajetória traduzindo tendências em escolhas
            possíveis, sofisticadas e coerentes com a vida real. Sua visão une
            experiência de mercado, escuta feminina e um olhar prático para vestir
            mulheres maduras com elegância natural.
          </p>
          <p className="about-ellen-text">
            Mais do que indicar peças, Ellen orienta combinações, proporções e
            detalhes que tornam o vestir mais inteligente, funcional e seguro para
            diferentes rotinas.
          </p>

          <div className="about-ellen-cards" aria-label="Diferenciais de Ellen Paiva">
            {credentials.map((credential) => (
              <article className="about-ellen-card" key={credential}>
                <span>{credential}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="about-ellen-media reveal reveal-up reveal-delay-1" aria-label="Retrato editorial temporário de Ellen Paiva">
          <div className="about-ellen-image-placeholder">
            {assets.ellenAbout ? (
              <img src={assets.ellenAbout} alt="Ellen Paiva em retrato editorial" className="about-ellen-image" />
            ) : (
              <span>Ellen Paiva</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutEllen;
