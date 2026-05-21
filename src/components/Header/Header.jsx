import { useEffect, useState } from 'react';
import { assets } from '../../assets/assetsMap.js';
import './Header.css';

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

  return (
    <header
      className={`site-header${isScrolled ? ' is-scrolled' : ''}${isMenuOpen ? ' is-menu-open' : ''}`}
      aria-label="Cabeçalho principal"
    >
      <div className="site-topbar" aria-label="Barra editorial">
        <div className="site-topbar-container">
          <p className="site-topbar-social">Instagram · WhatsApp · Facebook</p>
          <p className="site-topbar-message">MODA INTELIGENTE PARA MULHERES REAIS</p>
          <a className="site-topbar-link" href="#tendencia" onClick={closeMenu}>
            CONHEÇA A TENDÊNCIA MULTIMARCAS →
          </a>
        </div>
      </div>

      <div className="site-header-container">
        <a className="site-logo" href="/" aria-label="Ellen Paiva - página inicial" onClick={closeMenu}>
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
  );
}

export default Header;
