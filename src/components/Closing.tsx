import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReduced, scrollToTarget, clamp } from '../lib/motion';
import { CERTS, EMAIL, EXPERTISE } from '../data';
import { HoloCard, Roll, Spark } from './Primitives';

const DECK = [
  ...EXPERTISE.map((e) => ({ title: e.title, sub: e.tagline, bg: e.background, light: e.light, icon: e.icon })),
  ...CERTS.map((c) => ({ title: c.title, sub: c.sub, bg: c.background, light: false, icon: undefined as string | undefined })),
];
// scatter positions: [x % of width, y % of height, rotation]
const SPOTS: [number, number, number][] = [
  [-41, -34, -9],
  [-19, -41, 6],
  [8, -43, -5],
  [31, -38, 10],
  [44, -6, -7],
  [41, 27, 8],
  [20, 41, -10],
  [-6, 44, 5],
  [-29, 38, -7],
  [-45, 10, 9],
];

export default function Closing() {
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const cards = q('.closing__card') as HTMLElement[];
      const stage = q('.closing__stage')[0] as HTMLElement;
      const floats: gsap.core.Tween[] = [];
      // pile → scatter as the section arrives
      cards.forEach((c, i) => {
        const [x, y, r] = SPOTS[i];
        const edgeSize = () => {
          const angle = (Math.abs(r) + 3) * Math.PI / 180;
          const halfW = c.offsetWidth / 2;
          const halfH = c.offsetHeight / 2;
          return {
            x: halfW * Math.cos(angle) + halfH * Math.sin(angle),
            y: halfH * Math.cos(angle) + halfW * Math.sin(angle),
          };
        };
        gsap.fromTo(
          c,
          { x: (i - 5) * 6, y: () => stage.offsetHeight * 0.25 + i * -4, rotation: (i % 2 ? -1 : 1) * 3, scale: 0.7 },
          {
            x: () => {
              const limit = Math.max(0, stage.offsetWidth / 2 - edgeSize().x - 24);
              return clamp((x / 100) * stage.offsetWidth, -limit, limit);
            },
            y: () => Math.max((y / 100) * stage.offsetHeight, -stage.offsetHeight / 2 + edgeSize().y + 24),
            rotation: r,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 5%', scrub: 0.8, invalidateOnRefresh: true },
          },
        );
        // idle float on the inner wrapper
        floats.push(gsap.to(c.firstElementChild, {
          y: gsap.utils.random(-14, 14),
          rotation: gsap.utils.random(-3, 3),
          duration: gsap.utils.random(2.6, 4.2),
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.2,
        }));
      });
      floats.forEach((t) => t.pause());
      const sync = (s: ScrollTrigger) => floats.forEach((t) => (s.isActive ? t.resume() : t.pause()));
      ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top', onToggle: sync, onRefresh: sync });
      // mouse parallax
      const xTo = gsap.quickTo(q('.closing__cards')[0], 'x', { duration: 1.2, ease: 'power3.out' });
      const yTo = gsap.quickTo(q('.closing__cards')[0], 'y', { duration: 1.2, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        xTo((e.clientX / window.innerWidth - 0.5) * -30);
        yTo((e.clientY / window.innerHeight - 0.5) * -20);
      };
      el.addEventListener('pointermove', move);

      gsap.fromTo(
        q('.closing__heading .sw__in'),
        { yPercent: 115, rotate: 4 },
        { yPercent: 0, rotate: 0, duration: 1.3, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: el, start: 'top 35%' } },
      );
      gsap.fromTo(
        q('.closing__panel'),
        { y: 80, opacity: 0, rotateX: 18 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 25%' } },
      );
      gsap.fromTo(
        q('.footer__word .ch'),
        { yPercent: 160 },
        {
          yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.04,
          onComplete: () => q('.footer__word')[0]?.classList.add('is-in'),
          scrollTrigger: { trigger: q('.footer')[0], start: 'top 92%' },
        },
      );
      return () => el.removeEventListener('pointermove', move);
    }, el);
    return () => ctx.revert();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <section id="contact" ref={root} className="closing" data-theme="dark">
      <div className="closing__bg" aria-hidden="true" />
      <div className="closing__stage">
        <div className="closing__cards" aria-hidden="true">
          {DECK.map((c, i) => (
            <div key={i} className="closing__card">
              <div className="closing__card-float">
                <HoloCard title={c.title} subtitle={c.sub} background={c.bg} light={c.light} icon={c.icon} flat />
              </div>
            </div>
          ))}
        </div>

        <div className="closing__inner">
          <h2 className="closing__heading">
            {['Ready', 'to', 'become', 'the'].map((w, i) => (
              <span key={i} className="sw">
                <span className="sw__in">{w}</span>
              </span>
            ))}
            <span className="sw">
              <span className="sw__in closing__accent">answer?</span>
            </span>
          </h2>

          <div className="closing__panel">
            <p className="closing__panel-kicker">
              <Spark className="closing__panel-spark" /> Start a conversation
            </p>
            <p className="closing__panel-name">Harry Mian</p>
            <a href={`mailto:${EMAIL}`} className="closing__email roll-trigger">
              <Roll>{EMAIL}</Roll>
            </a>
            <div className="closing__actions">
              <a href={`mailto:${EMAIL}`} className="closing__btn closing__btn--primary roll-trigger">
                <Roll>Email me</Roll>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
              <button type="button" className="closing__btn roll-trigger" onClick={copy}>
                <Roll>{copied ? 'Copied!' : 'Copy address'}</Roll>
              </button>
            </div>
            <p className="closing__panel-note">Senior SEO, AEO &amp; GEO Strategist · AI Search &amp; Performance Marketing</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer__word" aria-label="Harry Mian">
          {'Harry Mian'.split('').map((c, i) => (
            <span key={i} className="chw" aria-hidden="true">
              <span className="ch">{c === ' ' ? '\u00A0' : c}</span>
            </span>
          ))}
          <Spark className="footer__spark" />
        </div>
        <div className="footer__bar">
          <span>© {new Date().getFullYear()} Harry Mian</span>
          <a href="tel:+18722499666" className="roll-trigger">
            <Roll>(872) 249-9666</Roll>
          </a>
          <a href={`mailto:${EMAIL}`} className="roll-trigger">
            <Roll>{EMAIL}</Roll>
          </a>
          <button
            type="button"
            className="roll-trigger footer__top"
            onClick={() => scrollToTarget(0)}
          >
            <Roll>Back to top ↑</Roll>
          </button>
        </div>
      </footer>
    </section>
  );
}
