import { useEffect } from 'react';
import Header from './components/Header/Header.jsx';
import HeroSection from './components/Hero/HeroSection.jsx';
import AboutEllen from './components/AboutEllen/AboutEllen.jsx';
import SmartStyle from './components/SmartStyle/SmartStyle.jsx';
import Magazine from './components/Magazine/Magazine.jsx';
import Tendencia from './components/Tendencia/Tendencia.jsx';
import Newsletter from './components/Newsletter/Newsletter.jsx';
import Footer from './components/Footer/Footer.jsx';
import TendenciaPage from './pages/Tendencia/TendenciaPage.jsx';
import { initRevealOnScroll } from './utils/revealOnScroll.js';

function App() {
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const isTendenciaPage = currentPath === '/tendencia';

  useEffect(() => {
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
  }, []);

  useEffect(() => initRevealOnScroll(), []);

  useEffect(() => {
    const title = isTendenciaPage
      ? 'Tendência Multimarcas | Curadoria feminina premium'
      : 'Ellen Paiva | Estilo inteligente para mulheres reais';
    const description = isTendenciaPage
      ? 'Tendência Multimarcas: curadoria feminina, moda funcional e elegância prática para mulheres reais.'
      : 'Ellen Paiva: moda feminina madura, elegancia pratica e estilo inteligente para mulheres reais.';
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const metaDescription = document.querySelector('meta[name="description"]');

    document.title = title;
    metaDescription?.setAttribute('content', description);
    ogTitle?.setAttribute('content', title);
    ogDescription?.setAttribute('content', description);
  }, [isTendenciaPage]);

  if (isTendenciaPage) {
    return <TendenciaPage />;
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
