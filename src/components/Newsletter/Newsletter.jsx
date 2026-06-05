import { useState } from 'react';
import { assets } from '../../assets/assetsMap.js';
import { subscribeToNewsletter } from '../../services/newsletterService.js';
import './Newsletter.css';

function Newsletter() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [formStatus, setFormStatus] = useState({
    type: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
    setFormStatus({
      type: '',
      message: '',
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const result = await subscribeToNewsletter({
      ...formData,
      source: 'landing-newsletter',
    });

    setFormStatus({
      type: result.ok ? 'success' : 'error',
      message: result.message,
    });

    if (result.ok) {
      setFormData({
        name: '',
        email: '',
      });
    }

    setIsSubmitting(false);
  }

  return (
    <section className="newsletter page-section" id="newsletter" aria-labelledby="newsletter-title">
      <div className="newsletter-container section-container">
        <div className="newsletter-content reveal reveal-up">
          <p className="eyebrow">Newsletter Editorial</p>
          <h2 id="newsletter-title" className="newsletter-title">
            Elegância também é constância.
          </h2>
          <p className="newsletter-text">
            Receba inspirações, tendências e conteúdos pensados para mulheres que desejam se vestir bem sem perder
            autenticidade.
          </p>
        </div>

        <form
          className="newsletter-form reveal reveal-up reveal-delay-1"
          aria-label="Formulário da newsletter"
          onSubmit={handleSubmit}
        >
          {assets.newsletterFooter && (
            <div className="newsletter-media">
              <img
                src={assets.newsletterFooter}
                alt="Editorial Ellen Paiva para newsletter"
                className="newsletter-image"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}

          <label className="newsletter-field">
            <span>Nome</span>
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              autoComplete="name"
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
            />
          </label>

          <label className="newsletter-field">
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              value={formData.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
            />
          </label>

          <button
            className="newsletter-button"
            type="submit"
            aria-label="Quero receber a newsletter editorial"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Quero receber'}
          </button>

          {formStatus.message && (
            <p className={`newsletter-message newsletter-message-${formStatus.type}`} role="status">
              {formStatus.message}
            </p>
          )}

          <p className="newsletter-note">Conteúdo leve, sofisticado e sem excessos.</p>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;
