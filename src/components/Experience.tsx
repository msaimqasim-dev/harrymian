import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReduced, lerp, smooth, range, scrollToTarget } from '../lib/motion';
import { EXPERIENCE } from '../data';
import { Spark } from './Primitives';

const N = EXPERIENCE.length;
const MAX_DEPTH = 3;

// Reference deck slot math (alternating offset, lift, tilt, scale step), made continuous.
function slot(d: number, mult: number) {
  const t = Math.min(d, MAX_DEPTH);
  const sign = Math.round(d) % 2 ? 1 : -1;
  return {
    x: d === 0 ? 0 : sign * t * 26 * mult,
    y: -t * 22 * mult,
    r: d === 0 ? 0 : sign * t * 5,
    s: 1 - t * 0.05,
    o: d > MAX_DEPTH ? 0 : 1 - t * 0.06,
  };
}

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const st = useRef<ScrollTrigger | null>(null);
  const reduced = prefersReduced();

  useLayoutEffect(() => {
    if (reduced) return;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const cards = q('.deck__card') as HTMLElement[];
    let last = -1;
    const ctx = gsap.context(() => {
      const render = (p: number) => {
        const t = range(0.04, 0.92, p) * (N - 1);
        const k = Math.floor(t);
        const P = Math.min(N - 1, k + smooth(0.3, 0.8, t - k));
        const vw = window.innerWidth;
        const mult = vw < 430 ? 0.5 : vw < 700 ? 0.7 : 1;
        cards.forEach((c, i) => {
          const d = i - P;
          if (d >= 0) {
            const a = slot(Math.floor(d), mult);
            const b = slot(Math.ceil(d), mult);
            const f = d - Math.floor(d);
            gsap.set(c, {
              xPercent: -50,
              yPercent: -50,
              x: lerp(a.x, b.x, f),
              y: lerp(a.y, b.y, f),
              rotation: lerp(a.r, b.r, f),
              scale: lerp(a.s, b.s, f),
              autoAlpha: lerp(a.o, b.o, f),
              zIndex: 100 - i,
            });
          } else {
            const f = Math.min(1, -d);
            gsap.set(c, {
              xPercent: -50,
              yPercent: -50,
              x: -f * vw * 0.75,
              y: f * 60,
              rotation: -f * 16,
              scale: 1 - f * 0.08,
              autoAlpha: 1 - smooth(0.55, 1, f),
              zIndex: 200 - i,
            });
          }
        });
        const active = Math.round(P);
        if (active !== last) {
          last = active;
          setIdx(active);
        }
        gsap.set(q('.deck__rail-fill'), { scaleY: P / (N - 1) });
      };
      st.current = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => '+=' + window.innerHeight * (N * 0.62),
        pin: q('.deck__pin')[0],
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (s) => render(s.progress),
        onRefresh: (s) => render(s.progress),
      });
      render(0);

      gsap.fromTo(
        q('.deck__title .sw__in'),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 70%' } },
      );
      gsap.fromTo(
        q('.deck__stage'),
        { y: 160, rotate: 6, opacity: 0 },
        { y: 0, rotate: 0, opacity: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 60%' } },
      );
    }, el);
    return () => {
      ctx.revert();
      st.current = null;
    };
  }, [reduced]);

  const goTo = (i: number) => {
    const s = st.current;
    if (!s) return;
    const n = Math.max(0, Math.min(N - 1, i));
    const p = 0.04 + (n / (N - 1)) * 0.88;
    scrollToTarget(s.start + (s.end - s.start) * p + 2);
  };

  /* drag to swipe */
  const drag = useRef({ on: false, x0: 0, dx: 0 });
  const onDown = (e: React.PointerEvent) => {
    drag.current = { on: true, x0: e.clientX, dx: 0 };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.on) return;
    drag.current.dx = e.clientX - drag.current.x0;
    const front = (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('.deck__card')[idx];
    if (front) front.style.translate = `${drag.current.dx * 0.6}px 0`;
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drag.current.on) return;
    drag.current.on = false;
    const front = (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('.deck__card')[idx];
    if (front) front.style.translate = '';
    if (Math.abs(drag.current.dx) > 56) goTo(idx + (drag.current.dx < 0 ? 1 : -1));
  };

  return (
    <section id="experience" ref={root} className={`deck ${reduced ? 'deck--static' : ''}`} data-theme="light">
      <div className="deck__pin">
        <div className="deck__side">
          <p className="section-kicker">
            <span className="kicker-dot" /> Professional experience
          </p>
          <h2 className="deck__title">
            {'Ten years. Four chapters.'.split(' ').map((w, i) => (
              <span key={i} className="sw">
                <span className="sw__in">{w}</span>
              </span>
            ))}
          </h2>
          <div className="deck__rail">
            <div className="deck__rail-track">
              <div className="deck__rail-fill" />
            </div>
            <ol className="deck__index">
              {EXPERIENCE.map((r, i) => (
                <li key={r.company} className={i === idx ? 'is-active' : i < idx ? 'is-past' : ''}>
                  <button onClick={() => goTo(i)}>
                    <span className="deck__index-years">{r.years}</span>
                    <span className="deck__index-co">{r.company}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="deck__main">
          <div className="deck__stage" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
            {EXPERIENCE.map((r, i) => (
              <article key={r.company} className={`deck__card ${r.light ? 'is-light' : ''}`} style={{ background: r.background }} aria-hidden={!reduced && i !== idx}>
                <div className="deck__card-texture" />
                <div className="deck__card-frame" />
                <header className="deck__card-head">
                  <span className="deck__card-years">{r.years}</span>
                  <span className="deck__card-num">
                    0{i + 1}
                    <em>/0{N}</em>
                  </span>
                </header>
                <div className="deck__card-body">
                  <p className="deck__card-co">{r.company}</p>
                  <h3 className="deck__card-title">{r.title}</h3>
                  <ul className="deck__card-list">
                    {r.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                <Spark className="deck__card-spark" />
              </article>
            ))}
          </div>
          <div className="deck__controls">
            <button className="deck__arrow" onClick={() => goTo(idx - 1)} disabled={idx === 0} aria-label="Previous role">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <span className="deck__count">
              <b>0{idx + 1}</b> / 0{N}
            </span>
            <button className="deck__arrow" onClick={() => goTo(idx + 1)} disabled={idx === N - 1} aria-label="Next role">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
