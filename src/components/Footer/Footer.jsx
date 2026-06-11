import { assets } from '../../assets/assetsMap.js';
import { publicSiteSettingsFallback } from '../../services/siteSettingsPublicService.js';
import './Footer.css';

const navigationLinks = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Estilo', href: '#estilo-inteligente' },
  { label: 'Revista', href: '#revista' },
  { label: 'Tendência', href: '#tendencia' },
  { label: 'Newsletter', href: '#newsletter' },
  { label: 'Área editorial', href: '/admin', ariaLabel: 'Área editorial da Revista Ellen Paiva' },
];

const contentLinks = [
  'Moda real',
  'Estilo inteligente',
  'Casual elegante',
  'Guarda-roupa funcional',
];

const getContactLinks = (settings) => [
  { label: 'Instagram', href: settings.instagram_url, isExternal: true },
  { label: 'WhatsApp', href: settings.whatsapp_url, isExternal: true },
  ...(settings.contact_email ? [{ label: 'E-mail', href: `mailto:${settings.contact_email}`, isExternal: false }] : []),
  { label: 'Mossoró/RN', href: '#newsletter', isExternal: false },
];

function Footer({ settings = publicSiteSettingsFallback }) {
  const contactLinks = getContactLinks(settings);

  return (
    <footer className="site-footer page-section">
      <div className="site-footer-container section-container">
        <div className="site-footer-grid">
          <div className="site-footer-brand reveal reveal-fade">
            <a className="site-footer-logo" href="#top" aria-label={`${settings.brand_name} - voltar ao topo`}>
              {assets.ellenSignature ? (
                <img src={assets.ellenSignature} alt={settings.brand_name} className="site-footer-logo-image" />
              ) : (
                settings.brand_name
              )}
            </a>
            <p>Estilo, elegância e moda inteligente para mulheres reais.</p>
          </div>

          <nav className="site-footer-column reveal reveal-fade reveal-delay-1" aria-label="Navegação do rodapé">
            <h2>Navegação</h2>
            <ul>
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} aria-label={link.ariaLabel}>
                    {link.label}
                  </a>
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
          <a className="site-footer-admin-link" href="/admin" aria-label="Área editorial da Revista Ellen Paiva">
            Área editorial
          </a>
          <p>© 2026 Ellen Paiva. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
