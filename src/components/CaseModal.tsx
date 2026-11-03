import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap, getLenis, prefersReduced } from '../lib/motion';
import { CASES, EMAIL, WORK } from '../data';
import { Roll, Spark } from './Primitives';

type Props = {
  index: number;
  origin: DOMRect | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
};

const SECTIONS = [
  { id: 'cm-overview', label: 'Overview' },
  { id: 'cm-challenge', label: 'Challenge' },
  { id: 'cm-approach', label: 'My approach' },
  { id: 'cm-outcomes', label: 'Deliverables & measures' },
];

export default function CaseModal({ index, origin, onClose, onNavigate }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const first = useRef(true);
  const work = WORK[index];
  const cs = CASES[work.id];
  const reduced = prefersReduced();

  useEffect(() => {
    const l = getLenis();
    l?.stop();
    document.documentElement.classList.add('modal-open');
    const prevFocus = document.activeElement as HTMLElement | null;
    root.current?.querySelector<HTMLElement>('.cm__close')?.focus({ preventScroll: true });
    return () => {
      l?.start();
      document.documentElement.classList.remove('modal-open');
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, []);

  useLayoutEffect(() => {
    const q = gsap.utils.selector(root.current);
    const sc = scroller.current!;
    sc.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      if (first.current) {
        const hero = (q('.cm__hero-media')[0] as HTMLElement).getBoundingClientRect();
        const shared = q('.cm__shared')[0] as HTMLElement;
        const start = origin ?? hero;
        const sourceImg = document.querySelector<HTMLImageElement>('.work__slide.is-active .work__media img');
        const m = sourceImg ? new DOMMatrixReadOnly(getComputedStyle(sourceImg).transform) : null;
        gsap.set(shared, {
          top: start.top, left: start.left, width: start.width, height: start.height,
          borderRadius: origin ? '20px' : '0px', opacity: 1,
        });
        gsap.set(q('.cm__shared img'), { scale: m ? Math.hypot(m.a, m.b) : 1 });
        gsap.set(q('.cm__panel, .cm__hero-img'), { opacity: 0 });
        tl.fromTo(q('.cm__backdrop'), { opacity: 0 }, { opacity: 1, duration: 0.75, ease: 'power2.out' }, 0)
          .to(shared, { top: hero.top, left: hero.left, width: hero.width, height: hero.height, borderRadius: '0px', duration: 1.08, ease: 'power3.inOut' }, 0)
          .to(q('.cm__shared img'), { scale: 1, duration: 1.08, ease: 'power3.inOut' }, 0)
          .to(q('.cm__panel'), { opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.42)
          .to(q('.cm__hero-img'), { opacity: 1, duration: 0.25, ease: 'none' }, 0.94)
          .to(shared, { opacity: 0, duration: 0.25, ease: 'none' }, 0.94)
          .fromTo(q('.cm__chrome'), { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.86);
      } else {
        gsap.set(q('.cm__shared'), { opacity: 0 });
        tl.fromTo(q('.cm__hero-img'), { opacity: 0 }, { opacity: 1, duration: 0.65 }, 0);
      }
      const d = first.current ? 0.86 : 0.1;
      tl.fromTo(q('.cm__title .ch'), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.012 }, d)
        .fromTo(q('.cm__hero-lede'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, d + 0.2)
        .fromTo(q('.cm__fact'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.08 }, d + 0.3)
        .fromTo(q('.cm__reveal-now'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, d + 0.35);
      first.current = false;

      const items = q('.cm__reveal') as HTMLElement[];
      gsap.set(items, { y: 50, opacity: 0 });
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              gsap.to(e.target, { y: 0, opacity: 1, duration: 1, ease: 'expo.out' });
              const steps = e.target.querySelectorAll('.cm__step, .cm__obj, .cm__chip, .cm__metric');
              if (steps.length) gsap.fromTo(steps, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'expo.out', delay: 0.1 });
              io.unobserve(e.target);
            }
          }),
        { root: sc, threshold: 0.15 },
      );
      items.forEach((i) => io.observe(i));

      // progress, parallax, sticky-rail states
      const bar = q('.cm__rail-bar')[0] as HTMLElement;
      const links = q('.cm__rail-link') as HTMLButtonElement[];
      links.forEach((b, i) => b.classList.toggle('is-active', i === 0));
      const onScroll = () => {
        const max = sc.scrollHeight - sc.clientHeight;
        const p = max > 0 ? sc.scrollTop / max : 0;
        gsap.set(q('.cm__progress-fill'), { scaleX: p });
        gsap.set(q('.cm__rail-fill'), { scaleY: p });
        gsap.set(q('.cm__hero-img'), { yPercent: Math.min(sc.scrollTop / 9, 18) });
        gsap.set(bar, { '--cm-pct': `${Math.round(p * 100)}%` } as gsap.TweenVars);
        root.current?.classList.toggle('is-scrolled', sc.scrollTop > 40);
        let cur = 0;
        SECTIONS.forEach((s, i) => {
          const el = sc.querySelector('#' + s.id);
          if (el && (el as HTMLElement).offsetTop - sc.scrollTop < window.innerHeight * 0.45) cur = i;
        });
        links.forEach((b, i) => b.classList.toggle('is-active', i === cur));
      };
      sc.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => {
        io.disconnect();
        sc.removeEventListener('scroll', onScroll);
      };
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    if (reduced) return onClose();
    const q = gsap.utils.selector(root.current);
    const sc = scroller.current;
    const activeCard = document.querySelector('.work__slide.is-active');
    const target = activeCard?.querySelector('.work__media')?.getBoundingClientRect();
    if (!target || sc?.scrollTop || WORK[index].num !== activeCard?.querySelector('.work__copy-num')?.textContent) {
      gsap.to(root.current, { opacity: 0, duration: 0.35, ease: 'power2.inOut', onComplete: onClose });
      return;
    }
    const hero = (q('.cm__hero-media')[0] as HTMLElement).getBoundingClientRect();
    const shared = q('.cm__shared')[0] as HTMLElement;
    gsap.set(shared, { top: hero.top, left: hero.left, width: hero.width, height: hero.height, borderRadius: 0, opacity: 1 });
    gsap.timeline({ onComplete: onClose })
      .to(q('.cm__chrome, .cm__hero-content, .cm__body'), { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
      .to(q('.cm__panel'), { opacity: 0, duration: 0.45, ease: 'power2.in' }, 0.12)
      .to(shared, { top: target.top, left: target.left, width: target.width, height: target.height, borderRadius: '20px', duration: 0.9, ease: 'power3.inOut' }, 0)
      .to(q('.cm__backdrop'), { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 0.35);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % WORK.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + WORK.length) % WORK.length);
      if (e.key === 'Tab' && root.current) {
        const f = root.current.querySelectorAll<HTMLElement>('button, a[href]');
        const a = f[0];
        const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const jumpTo = (id: string) => {
    const sc = scroller.current!;
    const el = sc.querySelector('#' + id) as HTMLElement | null;
    if (el) sc.scrollTo({ top: Math.max(0, el.offsetTop - 96), behavior: reduced ? 'auto' : 'smooth' });
  };

  const next = WORK[(index + 1) % WORK.length];
  const prev = WORK[(index - 1 + WORK.length) % WORK.length];

  return createPortal(
    <div ref={root} className="cm" role="dialog" aria-modal="true" aria-labelledby="cm-title" style={{ ['--accent' as string]: work.accent }}>
      <div className="cm__backdrop" onClick={close} />
      <div className="cm__panel">
        <div className="cm__chrome">
          <div className="cm__progress"><div className="cm__progress-fill" /></div>
          <span className="cm__crumb">
            <Spark className="cm__crumb-spark" /> Harry Mian <em>· Case studies</em>
          </span>
          <div className="cm__chrome-right">
            <span className="cm__page">
              <b>{work.num}</b> / 0{WORK.length}
            </span>
            <button className="cm__nav" onClick={() => onNavigate((index - 1 + WORK.length) % WORK.length)} aria-label={`Previous: ${prev.title}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button className="cm__nav" onClick={() => onNavigate((index + 1) % WORK.length)} aria-label={`Next: ${next.title}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
            <button className="cm__close" onClick={close} aria-label="Close case study">
              <span /><span />
            </button>
          </div>
        </div>

        <div ref={scroller} className="cm__scroll" data-lenis-prevent>
          <header className="cm__hero">
            <div className="cm__hero-media">
              <img className="cm__hero-img" src={work.image} alt={`Concept visual for ${work.title}`} />
              <div className="cm__hero-shade" />
            </div>
            <div className="cm__hero-facts">
              {work.tags.map((t) => (
                <span key={t} className="cm__fact">{t}</span>
              ))}
              <span className="cm__fact cm__fact--status"><i /> Illustrative concept</span>
            </div>
            <div className="cm__hero-content">
              <p className="cm__eyebrow-row">
                <span className="cm__badge">Concept {work.num}</span>
                <span className="cm__eyebrow">{cs.eyebrow}</span>
              </p>
              <h2 id="cm-title" className="cm__title" aria-label={work.title}>
                {work.title.split(' ').map((w, i) => (
                  <span key={i} className="wdw" aria-hidden="true">
                    {w.split('').map((c, j) => <span key={j} className="ch">{c}</span>)}
                  </span>
                ))}
              </h2>
              <p className="cm__hero-lede">{cs.summary}</p>
            </div>
          </header>

          <div className="cm__body">
            <aside className="cm__rail" aria-label="On this page">
              <span className="cm__page cm__page--rail">
                <b>{work.num}</b> / 0{WORK.length}
              </span>
              <div className="cm__rail-bar">
                <div className="cm__rail-fill" />
              </div>
              <nav>
                {SECTIONS.map((s, i) => (
                  <button key={s.id} className="cm__rail-link" onClick={() => jumpTo(s.id)}>
                    <span>0{i + 1}</span> {s.label}
                  </button>
                ))}
              </nav>
              <div className="cm__rail-card">
                <p>Want this approach applied to your brand?</p>
                <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Concept: ${work.title}`)}`} className="cm__rail-cta roll-trigger">
                  <Roll>Email me</Roll>
                </a>
              </div>
              <p className="cm__rail-status">
                <i /> Concept work — methodology only, no outcomes claimed.
              </p>
            </aside>

            <main className="cm__main">
              <section className="cm__section cm__reveal-now" id="cm-overview">
                <span className="cm__kicker">Overview</span>
                <p className="cm__summary">{work.blurb}</p>
              </section>

              <section className="cm__section cm__reveal" id="cm-challenge">
                <div className="cm__label"><span>02</span> The challenge</div>
                <p className="cm__lead">{cs.challenge}</p>
                <div className="cm__label cm__label--sub"><span>↗</span> Objectives</div>
                <div className="cm__objectives">
                  {cs.goals.map((g, i) => (
                    <div key={g} className="cm__obj">
                      <span className="cm__obj-num">{String(i + 1).padStart(2, '0')}</span>
                      <p>{g}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="cm__section cm__section--band cm__reveal" id="cm-approach">
                <div className="cm__label cm__label--onband"><span>03</span> My approach</div>
                <ol className="cm__approach">
                  {cs.approach.map((a, i) => (
                    <li key={a.title} className="cm__step">
                      <span className="cm__approach-num">{String(i + 1).padStart(2, '0')}</span>
                      <span className="cm__approach-arrow" aria-hidden="true">→</span>
                      <h3>{a.title}</h3>
                      <p>{a.body}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="cm__section cm__reveal" id="cm-outcomes">
                <div className="cm__label"><span>04</span> Deliverables</div>
                <ul className="cm__chips">
                  {cs.deliverables.map((d) => <li key={d} className="cm__chip">{d}</li>)}
                </ul>

                <div className="cm__dark">
                  <span className="cm__kicker cm__kicker--light">Signals to track — not reported results</span>
                  <ul className="cm__metrics">
                    {cs.measure.map((m) => (
                      <li key={m} className="cm__metric"><Spark className="cm__metric-spark" />{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="cm__label cm__label--sub"><span>05</span> Toolkit</div>
                <ul className="cm__chips">
                  {cs.stack.map((s) => <li key={s} className="cm__chip cm__chip--outline">{s}</li>)}
                </ul>

                <p className="cm__disclaimer">
                  This conceptual case study illustrates my methodology. It does not represent a completed client engagement, and I’m not claiming any outcomes.
                </p>
              </section>

              <section className="cm__cta cm__reveal">
                <span className="cm__kicker">Next step</span>
                <p>Let’s make your brand the answer.</p>
                <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Concept: ${work.title}`)}`} className="cm__cta-btn roll-trigger">
                  <Roll>Start a conversation</Roll>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
                </a>
              </section>

              <button className="cm__next cm__reveal" onClick={() => onNavigate((index + 1) % WORK.length)}>
                <img src={next.image} alt="" />
                <span className="cm__next-shade" />
                <span className="cm__next-label">Next concept · {next.num}</span>
                <span className="cm__next-title">{next.title}</span>
                <span className="cm__next-arrow">→</span>
              </button>
            </main>
          </div>
        </div>
      </div>
      <div className="cm__shared" aria-hidden="true">
        <img src={work.image} alt="" />
      </div>
    </div>,
    document.body,
  );
}
