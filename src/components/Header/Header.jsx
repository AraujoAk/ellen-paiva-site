import { useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assetsMap.js';
import { publicSiteSettingsFallback } from '../../services/siteSettingsPublicService.js';
import './Header.css';

const navItems = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Estilo', href: '#estilo-inteligente' },
  { label: 'Revista', href: '#revista' },
  { label: 'Tendência', href: '#tendencia' },
];

const sectionIds = [...navItems.map((item) => item.href.replace('#', '')), 'newsletter'];

function Header({ settings = publicSiteSettingsFallback }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const lockedTarget = useRef('');

  useEffect(() => {
    let animationFrame = 0;

    const updateHeaderState = () => {
      setIsScrolled(window.scrollY > 12);

      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;

      if (lockedTarget.current) {
        const targetSectionId = lockedTarget.current;

        if (lockedTarget.current === 'top') {
          if (window.scrollY > 24) {
            animationFrame = 0;
            return;
          }

          lockedTarget.current = '';
          setActiveSection('');
          animationFrame = 0;
          return;
        }

        const targetSection = document.getElementById(targetSectionId);

        if (targetSection) {
          const targetDistance = Math.abs(targetSection.getBoundingClientRect().top - headerHeight);

          if (targetDistance > 110) {
            animationFrame = 0;
            return;
          }
        }

        lockedTarget.current = '';
        setActiveSection(targetSectionId);
        animationFrame = 0;
        return;
      }

      const viewportTop = headerHeight;
      const viewportBottom = window.innerHeight;
      const viewportHeight = Math.max(viewportBottom - viewportTop, 1);
      const viewportCenter = viewportTop + viewportHeight * 0.45;
      let dominantSection = '';
      let dominantScore = Number.NEGATIVE_INFINITY;

      sectionIds.forEach((sectionId) => {
        const section = document.getElementById(sectionId);

        if (!section) {
          return;
        }

        const rect = section.getBoundingClientRect();
        const visibleTop = Math.max(rect.top, viewportTop);
        const visibleBottom = Math.min(rect.bottom, viewportBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (!visibleHeight) {
          return;
        }

        const sectionCenter = rect.top + rect.height / 2;
        const visibleRatio = visibleHeight / Math.min(rect.height, viewportHeight);
        const centerDistance = Math.abs(sectionCenter - viewportCenter) / viewportHeight;
        const score = visibleRatio - centerDistance * 0.25;

        if (score > dominantScore) {
          dominantScore = score;
          dominantSection = sectionId;
        }
      });

      setActiveSection(dominantSection);
      animationFrame = 0;
    };

    const handleScroll = () => {
      if (animationFrame) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updateHeaderState);
    };

    const releaseProgrammaticLock = () => {
      lockedTarget.current = '';
      handleScroll();
    };

    const handleKeydown = (event) => {
      const manualScrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];

      if (manualScrollKeys.includes(event.key)) {
        releaseProgrammaticLock();
      }
    };

    updateHeaderState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    window.addEventListener('wheel', releaseProgrammaticLock, { passive: true });
    window.addEventListener('touchstart', releaseProgrammaticLock, { passive: true });
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('wheel', releaseProgrammaticLock);
      window.removeEventListener('touchstart', releaseProgrammaticLock);
      window.removeEventListener('keydown', handleKeydown);

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = (href) => {
    const targetSection = href.replace('#', '');

    lockedTarget.current = targetSection;
    setActiveSection(targetSection);
    closeMenu();
  };

  const handleLogoClick = (event) => {
    event.preventDefault();
    lockedTarget.current = 'top';
    setActiveSection('');
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="site-topbar" aria-label="Barra editorial">
        <div className="site-topbar-container">
          <p className="site-topbar-social">Instagram · WhatsApp · Facebook</p>
          <p className="site-topbar-message">MODA INTELIGENTE PARA MULHERES REAIS</p>
          <a
            className="site-topbar-link"
            href={settings.tendencia_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Conheça a Tendência Multimarcas em nova aba"
          >
            CONHEÇA A TENDÊNCIA MULTIMARCAS →
          </a>
        </div>
      </div>

      <header
        className={`site-header${isScrolled ? ' is-scrolled' : ''}${isMenuOpen ? ' is-menu-open' : ''}`}
        aria-label="Cabeçalho principal"
      >
      <div className="site-header-container">
        <a className="site-logo" href="#top" aria-label={`${settings.brand_name} - página inicial`} onClick={handleLogoClick}>
          {assets.ellenSignature ? (
            <img src={assets.ellenSignature} alt={settings.brand_name} className="site-logo-image" />
          ) : (
            settings.brand_name
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
            <a
              key={item.href}
              className="site-nav-link"
              href={item.href}
              aria-current={activeSection === item.href.replace('#', '') ? 'page' : undefined}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </a>
          ))}

          <a
            className="site-header-action site-header-action-mobile"
            href="#newsletter"
            aria-current={activeSection === 'newsletter' ? 'page' : undefined}
            onClick={() => handleNavClick('#newsletter')}
          >
            Newsletter
          </a>
        </nav>

        <a
          className="site-header-action site-header-action-desktop"
          href="#newsletter"
          aria-current={activeSection === 'newsletter' ? 'page' : undefined}
          onClick={() => handleNavClick('#newsletter')}
        >
          Newsletter
        </a>
      </div>
      </header>
    </>
  );
}

export default Header;
