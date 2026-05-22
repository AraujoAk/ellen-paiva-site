import { assets } from '../../assets/assetsMap.js';
import './Footer.css';

const instagramUrl = 'https://www.instagram.com/direct/t/107763033955970/';
const whatsappUrl = 'https://tr.ee/-R-sQ_hJqC';

const navigationLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Estilo', href: '#estilo-inteligente' },
  { label: 'Revista', href: '#revista' },
  { label: 'Tendência', href: '#tendencia' },
  { label: 'Newsletter', href: '#newsletter' },
];

const contentLinks = [
  'Moda real',
  'Estilo inteligente',
  'Casual elegante',
  'Guarda-roupa funcional',
];

const contactLinks = [
  { label: 'Instagram', href: instagramUrl, isExternal: true },
  { label: 'WhatsApp', href: whatsappUrl, isExternal: true },
  { label: 'Mossoró/RN', href: '#newsletter', isExternal: false },
];

function Footer() {
  return (
    <footer className="site-footer page-section">
      <div className="site-footer-container section-container">
        <div className="site-footer-grid">
          <div className="site-footer-brand reveal reveal-fade">
            <a className="site-footer-logo" href="#top" aria-label="Ellen Paiva - voltar ao topo">
              {assets.ellenSignature ? (
                <img src={assets.ellenSignature} alt="Ellen Paiva" className="site-footer-logo-image" />
              ) : (
                'Ellen Paiva'
              )}
            </a>
            <p>Estilo, elegância e moda inteligente para mulheres reais.</p>
          </div>

          <nav className="site-footer-column reveal reveal-fade reveal-delay-1" aria-label="Navegação do rodapé">
            <h2>Navegação</h2>
            <ul>
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer-column reveal reveal-fade reveal-delay-2">
            <h2>Conteúdos</h2>
            <ul>
              {contentLinks.map((item) => (
                <li key={item}>
                  <a href="#revista">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <address className="site-footer-column site-footer-contact reveal reveal-fade reveal-delay-3">
            <h2>Contato</h2>
            <ul>
              {contactLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.isExternal ? '_blank' : undefined}
                    rel={item.isExternal ? 'noopener noreferrer' : undefined}
                    aria-label={item.isExternal ? `${item.label} em nova aba` : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </address>
        </div>

        <div className="site-footer-bottom">
          <p>© 2026 Ellen Paiva. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
