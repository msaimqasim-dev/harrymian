import { useCallback, useEffect, useState } from 'react';
import { ScrollTrigger, initSmoothScroll, getLenis, prefersReduced } from './lib/motion';
import Loader from './components/Loader';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Experience from './components/Experience';
import Portfolio from './components/Portfolio';
import Tools from './components/Tools';
import Credentials from './components/Credentials';
import Closing from './components/Closing';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lenis = initSmoothScroll();
    lenis?.stop();
    document.documentElement.classList.add('is-loading');
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    let to = 0;
    const onResize = () => {
      clearTimeout(to);
      to = window.setTimeout(refresh, 200);
    };
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('load', refresh);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const onDone = useCallback(() => {
    window.scrollTo(0, 0);
    setReady(true);
    // Hold scroll for the first beat of the hero opening so user input can never fight the intro timeline.
    const unlock = () => {
      document.documentElement.classList.remove('is-loading');
      getLenis()?.start();
      ScrollTrigger.refresh();
    };
    window.setTimeout(unlock, prefersReduced() ? 0 : 1300);
  }, []);

  return (
    <>
      <Loader onDone={onDone} />
      <Header />
      <main id="top">
        <Hero ready={ready} />
        <About />
        <Expertise />
        <Experience />
        <Portfolio />
        <Tools />
        <Credentials />
        <Closing />
      </main>
    </>
  );
}
