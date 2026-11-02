import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced, isTouch } from '../lib/motion';
import { IMAGES } from '../data';
import { Spark } from './Primitives';

type Tile = { kind: 'photo'; src: string } | { kind: 'hint'; label: string; bg: string; light?: boolean };

// 4 x 3 grid — indexes 5 & 6 (centre) sit behind the feature card
const TILES: Tile[] = [
  { kind: 'photo', src: IMAGES.p2 },
  { kind: 'hint', label: 'Google AI Overviews', bg: 'linear-gradient(154deg,#D0D8F7 22%,#FFF0C4 94%)' },
  { kind: 'photo', src: IMAGES.p1 },
  { kind: 'hint', label: 'ChatGPT', bg: 'linear-gradient(154deg,#FF7381 22%,#F9F1CA 94%)' },
  { kind: 'hint', label: 'Perplexity', bg: 'linear-gradient(154deg,#F2FEDA 22%,#F2C12E 94%)' },
  { kind: 'photo', src: IMAGES.p5 },
  { kind: 'photo', src: IMAGES.p6 },
  { kind: 'photo', src: IMAGES.p3 },
  { kind: 'photo', src: IMAGES.p4 },
  { kind: 'hint', label: 'Gemini', bg: 'linear-gradient(154deg,#EDEBFF 22%,#BAE5E5 94%)' },
  { kind: 'hint', label: 'Claude', bg: 'linear-gradient(154deg,#FFE6CC 22%,#88CFDB 94%)' },
  { kind: 'hint', label: 'Microsoft Copilot', bg: 'linear-gradient(154deg,#1D7FA6 22%,#3AB8CD 94%)', light: true },
];

const NAME = 'Harry Mian';

export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const reduced = prefersReduced();

  /* ---------------------------------------------------------------
     Scroll choreography — one pinned, scrubbed timeline (~3.6 viewports).
     0      lockup leaves letter-by-letter, photograph falls away, grid flies in
     1.2    first headline  → 2.4 it leaves → flip → second headline
     4.65   photograph card expands to full bleed
     5.75   closing line → spark takes the screen → white hand-off to About
     --------------------------------------------------------------- */
  useLayoutEffect(() => {
    if (reduced) return;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context(() => {
      const stage = q('.hero__stage')[0] as HTMLElement;
      const card = q('.hero__feature')[0] as HTMLElement;
      const inner = q('.hero__flip-inner')[0] as HTMLElement;
      const tiles = q('.hero__tile') as HTMLElement[];
      const inline = q('.hero__mark-inline')[0] as HTMLElement;
      const big = q('.hero__mark-big')[0] as HTMLElement;
      const mobile = window.matchMedia('(max-width: 899px)').matches;

      gsap.set(card, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.42, rotateX: 38, z: -400 });
      gsap.set(tiles, { autoAlpha: 0, z: -900, rotateX: 24, scale: 0.7 });
      gsap.set(q('.hero__tag1 .ch, .hero__tag2 .ch'), { yPercent: 110, opacity: 0 });
      gsap.set(q('.hero__line .wd'), { yPercent: 110, opacity: 0 });
      gsap.set(q('.hero__line'), { autoAlpha: 0 });

      // The big spark is positioned over the inline one once the closing line has settled.
      const placeBig = () => {
        const r = inline.getBoundingClientRect();
        const s = stage.getBoundingClientRect();
        gsap.set(big, { left: r.left - s.left, top: r.top - s.top, width: r.width, height: r.height });
      };

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => '+=' + window.innerHeight * (mobile ? 3.2 : 3.6),
          scrub: 0.5,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl
        // 1 — the lockup leaves letter by letter; the grid arrives from depth
        .to(q('.hero__name .ch'), { yPercent: -130, opacity: 0, rotate: -4, duration: 0.8, ease: 'power3.in', stagger: { each: 0.04, from: 'center' } }, 0)
        .to(q('.hero__name-spark'), { scale: 0, rotate: 180, duration: 0.7, ease: 'power3.in' }, 0)
        .to(q('.hero__sub, .hero__scroll'), { y: -40, autoAlpha: 0, duration: 0.6, ease: 'power2.in', stagger: 0.05 }, 0)
        .to(q('.hero__bottom'), { y: 30, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, 0)
        .to(q('.hero__photo-bg'), { scale: 1.45, duration: 1.6, ease: 'power2.in' }, 0)
        .to(q('.hero__photo'), { autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, 0.75)
        .to(q('.hero__grid-lines'), { scale: 1.25, autoAlpha: 0, duration: 1.1 }, 0)
        .to(tiles, { autoAlpha: 1, z: 0, rotateX: 0, scale: 1, duration: 1.3, ease: 'power3.out', stagger: { each: 0.05, from: 'center', grid: [3, 4] } }, 0.35)
        .to(card, { autoAlpha: 1, scale: 1, rotateX: 0, z: 0, duration: 1.3, ease: 'power3.out' }, 0.45)
        .to(q('.hero__bg-warm'), { autoAlpha: 1, duration: 1.2 }, 0.9)
        // 2 — first headline, then the card flips to the photograph
        .to(q('.hero__tag1 .ch'), { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.012, ease: 'power3.out' }, 1.15)
        .to(q('.hero__tag1 .ch'), { yPercent: -110, opacity: 0, duration: 0.45, stagger: 0.006, ease: 'power2.in' }, 2.2)
        .to(inner, { rotateX: 180, duration: 1, ease: 'power3.inOut' }, 2.45)
        .to(card, { scale: 1.05, duration: 0.5, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 2.45)
        .to(q('.hero__tag2 .ch'), { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.012, ease: 'power3.out' }, 3.3)
        // 3 — the photograph takes the whole frame
        .to(q('.hero__tag2'), { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power2.in' }, 4.5)
        .to(card, { width: () => stage.clientWidth, height: () => stage.clientHeight, borderRadius: 0, scale: 1, duration: 1.2, ease: 'power3.inOut' }, 4.65)
        .to(tiles, { scale: 1.35, autoAlpha: 0, duration: 1, stagger: { each: 0.03, from: 'center', grid: [3, 4] }, ease: 'power2.in' }, 4.65)
        .to(q('.hero__photo-img'), { scale: 1.12, duration: 3.4, ease: 'none' }, 4.65)
        // 4 — the closing line
        .set(q('.hero__line'), { autoAlpha: 1 }, 5.75)
        .to(q('.hero__line .wd'), { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.11, ease: 'power3.out' }, 5.75)
        .call(placeBig, undefined, 6.85)
        // 5 — the spark takes over, then white hands off to the next section
        .set(big, { autoAlpha: 1 }, 6.9)
        .set(inline, { opacity: 0 }, 6.9)
        .to(q('.hero__line .wd'), { opacity: 0, duration: 0.35, ease: 'power1.in' }, 6.9)
        .to(
          big,
          {
            scale: () => (Math.hypot(stage.clientWidth, stage.clientHeight) / Math.max(inline.offsetWidth, 1)) * 7,
            rotate: 90,
            left: () => stage.clientWidth / 2 - inline.offsetWidth / 2,
            top: () => stage.clientHeight / 2 - inline.offsetHeight / 2,
            duration: 1.3,
            ease: 'power2.in',
          },
          6.9,
        )
        .to(q('.hero__white'), { autoAlpha: 1, duration: 0.55, ease: 'power1.inOut' }, 7.85);
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  /* ---------------------------------------------------------------
     Opening — runs once the loader has lifted.
     The photograph opens like a curtain behind the name; letters track in and rise out of focus.
     --------------------------------------------------------------- */
  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;
    if (reduced) {
      rootEl.classList.add('is-in');
      return;
    }
    if (!ready) return;
    const q = gsap.utils.selector(rootEl);
    const narrow = window.innerWidth < 600;
    const tl = gsap.timeline({ delay: 0.1, onComplete: () => rootEl.classList.add('is-in') });
    tl.fromTo(q('.hero__photo'), { clipPath: 'inset(46% 0% 46% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'expo.inOut' }, 0)
      .fromTo(q('.hero__photo-bg'), { scale: 1.45 }, { scale: 1.12, duration: 2.6, ease: 'expo.out' }, 0)
      .fromTo(q('.hero__name-text'), { letterSpacing: narrow ? '0.05em' : '0.13em' }, { letterSpacing: '-0.012em', duration: 2.2, ease: 'expo.out' }, 0.45)
      .fromTo(
        q('.hero__name .ch'),
        { yPercent: 160, rotate: 5, opacity: 0, filter: 'blur(14px)' },
        { yPercent: 0, rotate: 0, opacity: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out', stagger: 0.05, clearProps: 'filter' },
        0.45,
      )
      .fromTo(q('.hero__name-spark'), { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 1.3, ease: 'back.out(1.8)' }, 0.8)
      .fromTo(q('.hero__sub > *'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.12 }, 1.2)
      .fromTo(q('.hero__scroll'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 1.5)
      .fromTo(q('.hero__bottom > *'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 }, 1.55)
      .fromTo(q('.hero__grid-lines'), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }, 0.2);

    // Pointer depth: photograph and name drift at different rates, so the type sits in front of the image.
    let off = () => {};
    if (!isTouch()) {
      const bg = q('.hero__photo-bg')[0];
      const name = q('.hero__name')[0];
      const bx = gsap.quickTo(bg, 'x', { duration: 1.4, ease: 'power3.out' });
      const by = gsap.quickTo(bg, 'y', { duration: 1.4, ease: 'power3.out' });
      const nx = gsap.quickTo(name, 'x', { duration: 1.1, ease: 'power3.out' });
      const ny = gsap.quickTo(name, 'y', { duration: 1.1, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        if (window.scrollY > window.innerHeight * 0.35) return;
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        bx(dx * -36);
        by(dy * -24);
        nx(dx * 14);
        ny(dy * 9);
      };
      rootEl.addEventListener('pointermove', move);
      off = () => rootEl.removeEventListener('pointermove', move);
    }
    return () => {
      tl.kill();
      off();
    };
  }, [ready, reduced]);

  const chars = (s: string, accent?: string) =>
    s.split(' ').map((w, wi) => (
      <span key={wi} className={`wdw ${accent && w.replace(/[.,—]/g, '') === accent ? 'hero__accent' : ''}`}>
        {w.split('').map((c, ci) => (
          <span key={ci} className="ch">
            {c}
          </span>
        ))}
      </span>
    ));

  return (
    <section id="hero" ref={root} className={`hero ${reduced ? 'hero--reduced' : ''}`} data-theme="dark">
      <div className="hero__stage">
        <div className="hero__bg" />
        <div className="hero__bg-warm" />

        {/* the photograph that sits behind the name; it is the same image the centre card later flips to */}
        <div className="hero__photo" aria-hidden="true">
          <img className="hero__photo-bg" src={IMAGES.hero} alt="" />
          <div className="hero__photo-veil" />
        </div>
        <div className="hero__grid-lines" />

        {!reduced && (
          <div className="hero__tiles" aria-hidden="true">
            {TILES.map((t, i) => (
              <div key={i} className={`hero__tile ${i === 5 || i === 6 ? 'is-under' : ''}`}>
                {t.kind === 'photo' ? (
                  <img src={t.src} alt="" loading="eager" />
                ) : (
                  <div className={`hero__hint ${t.light ? 'is-light' : ''}`} style={{ background: t.bg }}>
                    <Spark className="hero__hint-spark" />
                    <span>{t.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!reduced && (
          <div className="hero__feature" aria-hidden="true">
            <div className="hero__flip-inner">
              <div className="hero__face hero__face--front">
                <p className="hero__tag1">{chars('Visibility used to mean ranking.')}</p>
              </div>
              <div className="hero__face hero__face--back">
                <img className="hero__photo-img" src={IMAGES.hero} alt="" />
                <div className="hero__photo-shade" />
                <p className="hero__tag2">{chars('Now it means being the answer.', 'answer')}</p>
              </div>
            </div>
          </div>
        )}

        <div className="hero__lockup">
          <h1 className="hero__name" aria-label="Harry Mian">
            <Spark className="hero__name-spark" />
            <span className="hero__name-text" aria-hidden="true">
              {NAME.split('').map((c, i) => (
                <span key={i} className="chw">
                  <span className="ch">{c === ' ' ? '\u00A0' : c}</span>
                </span>
              ))}
            </span>
          </h1>
          <div className="hero__sub">
            <p className="hero__role">Senior SEO, AEO &amp; GEO Strategist</p>
            <p className="hero__role-2">AI Search &amp; Performance Marketing</p>
          </div>
          <span className="hero__scroll" aria-hidden="true">
            <span className="hero__chevrons">
              {[0, 1, 2].map((i) => (
                <svg key={i} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              ))}
            </span>
            Scroll to explore
          </span>
        </div>

        <div className="hero__bottom">
          <span className="hero__release">10+ years</span>
          <p className="hero__updates">Visible. Cited. Recommended.</p>
        </div>

        {!reduced && (
          <>
            <p className="hero__line" aria-hidden="true">
              <span className="wdw"><span className="wd">Found.</span></span>
              <span className="wdw"><span className="wd">Cited.</span></span>
              <span className="wdw"><span className="wd">Chosen</span></span>
              <span className="wdw"><span className="wd hero__mark-inline"><Spark /></span></span>
            </p>
            <div className="hero__mark-big" aria-hidden="true">
              <Spark />
            </div>
            <div className="hero__white" aria-hidden="true" />
          </>
        )}
      </div>
    </section>
  );
}
