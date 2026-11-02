import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, getLenis, scrollToTarget } from '../lib/motion';
import { EMAIL } from '../data';
import { Logo, Roll } from './Primitives';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#expertise', label: 'Expertise' },
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Selected Work' },
  { href: '#tools', label: 'Tools' },
  { href: '#credentials', label: 'Education' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [shown, setShown] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // progress bar
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });
      // theme switching: any section marked data-theme="dark" flips the header
      const update = () => {
        const probe = 40;
        const els = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'));
        let theme = 'light';
        for (const el of els) {
          const r = el.getBoundingClientRect();
          if (r.top <= probe && r.bottom > probe) theme = el.dataset.theme || theme;
        }
        setDark(theme === 'dark');
        const hero = document.getElementById('hero');
        setShown(!!hero && hero.getBoundingClientRect().bottom < window.innerHeight * 0.5);
      };
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: update });
      update();
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const l = getLenis();
    if (open) {
      l?.stop();
      document.documentElement.classList.add('menu-open');
    } else {
      l?.start();
      document.documentElement.classList.remove('menu-open');
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollToTarget(href), 350);
  };

  return (
    <>
      <header className={`header ${dark ? 'is-dark' : 'is-light'} ${shown ? 'is-shown' : ''}`}>
        <div className="header__bar">
          <div ref={barRef} className="header__bar-fill" />
        </div>
        <a
          href="#top"
          className="header__logo"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(0);
          }}
          aria-label="Harry Mian — back to top"
        >
          <Logo dark={!dark} />
        </a>
        <div className="header__right">
          <a className="header__cta roll-trigger" href={`mailto:${EMAIL}`}>
            <Roll>Let’s talk</Roll>
          </a>
          <button
            className={`header__toggle ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="menu__fade" onClick={() => setOpen(false)} />
        <nav className="menu__panel" aria-label="Sections">
          <p className="menu__kicker">Index</p>
          <ul className="menu__list">
            {LINKS.map((l, i) => (
              <li key={l.href} style={{ transitionDelay: open ? `${0.12 + i * 0.045}s` : '0s' }}>
                <a
                  href={l.href}
                  className="roll-trigger"
                  tabIndex={open ? 0 : -1}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.href);
                  }}
                >
                  <span className="menu__num">0{i + 1}</span>
                  <Roll>{l.label}</Roll>
                </a>
              </li>
            ))}
          </ul>
          <div className="menu__foot">
            <span>Senior SEO, AEO & GEO Strategist</span>
            <a href={`mailto:${EMAIL}`} className="roll-trigger" tabIndex={open ? 0 : -1}>
              <Roll>{EMAIL}</Roll>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
