import { useEffect, useState } from 'react';
import { assets } from '../../assets/assetsMap.js';
import './Header.css';

const tendenciaUrl = 'https://linktr.ee/tendenciamu?utm_source=linktree_profile_share&ltsid=a98130d2-cc29-41d4-8f87-c76c3462c011';

const navItems = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Estilo', href: '#estilo-inteligente' },
  { label: 'Revista', href: '#revista' },
  { label: 'Tendência', href: '#tendencia' },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogoClick = (event) => {
    event.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="site-topbar" aria-label="Barra editorial">
        <div className="site-topbar-container">
          <p className="site-topbar-social">Instagram · WhatsApp · Facebook</p>
          <p className="site-topbar-message">MODA INTELIGENTE PARA MULHERES REAIS</p>
          <a className="site-topbar-link" href={tendenciaUrl} target="_blank" rel="noopener noreferrer">
            CONHEÇA A TENDÊNCIA MULTIMARCAS →
          </a>
        </div>
      </div>

      <header
        className={`site-header${isScrolled ? ' is-scrolled' : ''}${isMenuOpen ? ' is-menu-open' : ''}`}
        aria-label="Cabeçalho principal"
      >
      <div className="site-header-container">
        <a className="site-logo" href="#top" aria-label="Ellen Paiva - página inicial" onClick={handleLogoClick}>
          {assets.ellenSignature ? (
            <img src={assets.ellenSignature} alt="Ellen Paiva" className="site-logo-image" />
          ) : (
            'Ellen Paiva'
          )}
        </a>

        <button
          className="site-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className="site-nav"
          id="site-navigation"
          aria-label="Navegação principal"
        >
          {navItems.map((item) => (
            <a key={item.href} className="site-nav-link" href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}

          <a className="site-header-action site-header-action-mobile" href="#newsletter" onClick={closeMenu}>
            Newsletter
          </a>
        </nav>

        <a className="site-header-action site-header-action-desktop" href="#newsletter" onClick={closeMenu}>
          Newsletter
        </a>
      </div>
      </header>
    </>
  );
}

export default Header;
