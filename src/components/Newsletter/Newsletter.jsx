import { assets } from '../../assets/assetsMap.js';
import './Newsletter.css';

function Newsletter() {
  return (
    <section className="newsletter page-section" id="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter-container section-container">
        <div className="newsletter-content reveal reveal-up">
          <p className="eyebrow">Newsletter Editorial</p>
          <h2 id="newsletter-title" className="newsletter-title">
            Elegância também é constância.
          </h2>
          <p className="newsletter-text">
            Receba inspirações, tendências e conteúdos pensados para mulheres
            que desejam se vestir bem sem perder autenticidade.
          </p>
        </div>

        <form className="newsletter-form reveal reveal-up reveal-delay-1" aria-label="Formulário da newsletter">
          {assets.newsletterFooter && (
            <div className="newsletter-media">
              <img
                src={assets.newsletterFooter}
                alt="Editorial Ellen Paiva para newsletter"
                className="newsletter-image"
              />
            </div>
          )}

          <label className="newsletter-field">
            <span>Nome</span>
            <input type="text" name="name" placeholder="Seu nome" autoComplete="name" />
          </label>

          <label className="newsletter-field">
            <span>E-mail</span>
            <input type="email" name="email" placeholder="seuemail@exemplo.com" autoComplete="email" />
          </label>

          <button className="newsletter-button" type="button" aria-label="Quero receber a newsletter editorial">
            Quero receber
          </button>

          <p className="newsletter-note">Conteúdo leve, sofisticado e sem excessos.</p>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
