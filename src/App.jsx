import { useEffect } from 'react';
import Header from './components/Header/Header.jsx';
import HeroSection from './components/Hero/HeroSection.jsx';
import AboutEllen from './components/AboutEllen/AboutEllen.jsx';
import SmartStyle from './components/SmartStyle/SmartStyle.jsx';
import Magazine from './components/Magazine/Magazine.jsx';
import Tendencia from './components/Tendencia/Tendencia.jsx';
import Newsletter from './components/Newsletter/Newsletter.jsx';
import Footer from './components/Footer/Footer.jsx';
import AdminPage from './pages/Admin/AdminPage.jsx';
import MagazineArticlePage from './pages/MagazineArticle/MagazineArticlePage.jsx';
import { initRevealOnScroll } from './utils/revealOnScroll.js';

function App() {
  const currentPath = window.location.pathname;
  const isAdminRoute = currentPath === '/admin' || currentPath === '/admin/reset-password';
  const articleSlug = currentPath.startsWith('/revista/') ? decodeURIComponent(currentPath.replace('/revista/', '')) : '';
  const isArticleRoute = Boolean(articleSlug);

  useEffect(() => {
    if (isAdminRoute || isArticleRoute) {
      return undefined;
    }

    const previousScrollRestoration = window.history.scrollRestoration;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo(0, 0);

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = previousScrollRestoration;
      }
    };
  }, [isAdminRoute, isArticleRoute]);

  useEffect(() => {
    if (isAdminRoute || isArticleRoute) {
      return undefined;
    }

    return initRevealOnScroll();
  }, [isAdminRoute, isArticleRoute]);

  if (isAdminRoute) {
    return <AdminPage />;
  }

  if (isArticleRoute) {
    return <MagazineArticlePage slug={articleSlug} />;
  }

  return (
    <>
      <Header />
      <main id="top">
        <HeroSection />
        <AboutEllen />
        <SmartStyle />
        <Magazine />
        <Tendencia />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

export default App;
