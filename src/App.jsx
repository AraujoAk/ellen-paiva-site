import { useEffect } from 'react';
import Header from './components/Header/Header.jsx';
import HeroSection from './components/Hero/HeroSection.jsx';
import AboutEllen from './components/AboutEllen/AboutEllen.jsx';
import SmartStyle from './components/SmartStyle/SmartStyle.jsx';
import Magazine from './components/Magazine/Magazine.jsx';
import Tendencia from './components/Tendencia/Tendencia.jsx';
import Newsletter from './components/Newsletter/Newsletter.jsx';
import Footer from './components/Footer/Footer.jsx';
import { initRevealOnScroll } from './utils/revealOnScroll.js';

function App() {
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

  return (
    <>
      <Header />
      <main>
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
