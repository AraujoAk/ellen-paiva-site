import { assets } from '../../assets/assetsMap.js';
import './HeroSection.css';

function HeroSection() {
  return (
    <section className="hero-section page-section" aria-labelledby="hero-title">
      <div className="hero-container section-container">
        <div className="hero-content reveal reveal-up">
          <p className="eyebrow">Moda feminina madura</p>
          <h1 id="hero-title" className="hero-title">
            Estilo inteligente para mulheres reais.
          </h1>
          <p className="hero-description">
            Ellen Paiva traduz elegância prática, peças funcionais e escolhas
            sofisticadas para mulheres com rotina ativa e presença própria.
          </p>
          <div className="hero-actions">
            <a className="button-link" href="#revista">
              Ler editorial
            </a>
            <a className="hero-secondary-link" href="#sobre">
              Conhecer Ellen
            </a>
          </div>
        </div>

        <div className="hero-media reveal reveal-up reveal-delay-1" aria-label="Composição editorial de moda feminina">
          <div className="hero-image-panel">
            <div className="hero-image-placeholder">
              {assets.ellenHero ? (
                <img src={assets.ellenHero} alt="Retrato editorial de Ellen Paiva" className="hero-image" />
              ) : (
                <span>Editorial Ellen Paiva</span>
              )}
            </div>
          </div>
          <p className="hero-caption">
            Elegância, maturidade e versatilidade como assinatura visual.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
