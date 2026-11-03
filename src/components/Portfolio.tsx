import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { gsap, ScrollTrigger, prefersReduced, scrollToTarget } from '../lib/motion';
import { WORK } from '../data';
import { Roll, Spark } from './Primitives';
import CaseModal from './CaseModal';

const N = WORK.length;

export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const st = useRef<ScrollTrigger | null>(null);
  const reduced = prefersReduced();
  const [modal, setModal] = useState<{ i: number; rect: DOMRect | null } | null>(null);

  useLayoutEffect(() => {
    if (reduced) return;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    let last = 0;
    const ctx = gsap.context(() => {
      const pin = q('.work__pin')[0] as HTMLElement;
      // ~0.5 viewport of scroll per concept — enough for the accordion to breathe, short enough not to tire
      st.current = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => '+=' + window.innerHeight * N * 0.5,
        pin,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (s) => {
          const i = Math.min(N - 1, Math.floor(s.progress * N * 0.999));
          if (i !== last) {
            last = i;
            setActive(i);
          }
          gsap.set(q('.work__progress-fill'), { scaleX: s.progress });
        },
      });
      // The dark section arrives as a rounded sheet and squares off as it locks in place.
      gsap.fromTo(
        pin,
        { borderTopLeftRadius: 44, borderTopRightRadius: 44 },
        { borderTopLeftRadius: 0, borderTopRightRadius: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top top', scrub: true } },
      );
      gsap.fromTo(
        q('.work__title .sw__in'),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 70%' } },
      );
      gsap.fromTo(
        q('.work__slide'),
        { y: 120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: el, start: 'top 55%' } },
      );
    }, el);
    return () => {
      ctx.revert();
      st.current = null;
    };
  }, [reduced]);

  const goTo = (i: number) => {
    if (reduced || !st.current) {
      setActive(i);
      return;
    }
    const s = st.current;
    scrollToTarget(s.start + ((i + 0.5) / N) * (s.end - s.start));
  };

  // pointer depth on the open card's artwork (CSS-variable driven, no React re-render)
  const tilt = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    e.currentTarget.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const untilt = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--px', '0');
    e.currentTarget.style.setProperty('--py', '0');
  };

  return (
    <section id="work" ref={root} className="work" data-theme="dark">
      <div className="work__pin">
        <div className="work__bg" aria-hidden="true" />
        <div className="work__head">
          <div>
            <p className="section-kicker section-kicker--light">
              <span className="kicker-dot" /> My selected work
            </p>
            <h2 className="work__title">
              {'Concepts built for the new search.'.split(' ').map((w, i) => (
                <span key={i} className="sw">
                  <span className="sw__in">{w}</span>
                </span>
              ))}
            </h2>
          </div>
          <p className="work__note">
            <span className="work__note-badge">Concept work</span>
            These illustrate my approach, not completed client engagements. My case studies are coming soon.
          </p>
        </div>

        <div className="work__row" role="tablist" aria-label="Concept projects">
          {WORK.map((w, i) => {
            const on = i === active;
            return (
              <div
                key={w.id}
                className={`work__slide ${on ? 'is-active' : ''}`}
                style={{ ['--tint' as string]: w.tint, ['--accent' as string]: w.accent }}
                role="tab"
                aria-selected={on}
                tabIndex={0}
                onClick={() => !on && goTo(i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goTo(i)}
              >
                <div className="work__pill" aria-hidden={on}>
                  <img className="work__pill-bg" src={w.image} alt="" loading="lazy" />
                  <span className="work__pill-num">{w.num}</span>
                  <span className="work__pill-label">{w.label}</span>
                  <span className="work__pill-plus">+</span>
                </div>

                <div className="work__body" aria-hidden={!on}>
                  <div className="work__media" onPointerMove={tilt} onPointerLeave={untilt}>
                    <img src={w.image} alt={`Concept artwork for ${w.title}`} loading="lazy" />
                    {on && (
                      <button
                        type="button"
                        className="work__media-open"
                        aria-label={`Open case study: ${w.title}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setModal({ i, rect: e.currentTarget.parentElement!.getBoundingClientRect() });
                        }}
                      />
                    )}
                    <div className="work__media-shade" />
                    <span className="work__media-tag">
                      <Spark className="work__media-spark" /> Concept {w.num} · Placeholder
                    </span>
                  </div>
                  <div className="work__copy">
                    <span className="work__copy-num">{w.num}</span>
                    <h3 className="work__copy-title">{w.title}</h3>
                    <p className="work__copy-blurb">{w.blurb}</p>
                    <ul className="work__tags">
                      {w.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <button
                      className="work__cta roll-trigger"
                      type="button"
                      tabIndex={on ? 0 : -1}
                      onClick={(e) => {
                        e.stopPropagation();
                        const media = (e.currentTarget.closest('.work__slide') as HTMLElement)?.querySelector('.work__media');
                        setModal({ i, rect: media?.getBoundingClientRect() ?? null });
                      }}
                    >
                      <Roll>View concept</Roll>
                      <span className="work__cta-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M7 17 17 7M8 7h9v9" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="work__foot">
          <span className="work__count">
            <b>{WORK[active].num}</b> / 0{N}
          </span>
          <div className="work__progress">
            <div className="work__progress-fill" />
          </div>
          <span className="work__hint">Scroll or select a concept</span>
        </div>
      </div>
      {modal && (
        <CaseModal
          index={modal.i}
          origin={modal.rect}
          onClose={() => setModal(null)}
          onNavigate={(i) => setModal((m) => (m ? { ...m, i } : m))}
        />
      )}
    </section>
  );
}
