import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { TOOLS } from '../data';

export default function Tools() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root.current);
      gsap.fromTo(
        q('.tools__giant'),
        { xPercent: 12 },
        { xPercent: -38, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 } },
      );
      gsap.fromTo(
        q('.tools__title .sw__in'),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: root.current, start: 'top 70%' } },
      );
      (q('.tools__row') as HTMLElement[]).forEach((row) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 86%' } });
        tl.fromTo(row.querySelector('.tools__line'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out' })
          .fromTo(row.querySelector('.tools__group'), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 0.05)
          .fromTo(
            row.querySelectorAll('.tools__pill'),
            { rotateX: -90, y: 30, opacity: 0 },
            { rotateX: 0, y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.8)', stagger: 0.035 },
            0.12,
          );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="tools" ref={root} className="tools" data-theme="light">
      <div className="tools__giant" aria-hidden="true">
        Toolkit · Toolkit
      </div>
      <div className="tools__inner">
        <div className="tools__head">
          <p className="section-kicker">
            <span className="kicker-dot" /> Tools &amp; platforms
          </p>
          <h2 className="tools__title">
            {'The stack behind the strategy.'.split(' ').map((w, i) => (
              <span key={i} className="sw">
                <span className="sw__in">{w}</span>
              </span>
            ))}
          </h2>
        </div>
        <div className="tools__rows">
          {TOOLS.map((g, i) => (
            <div key={g.group} className="tools__row">
              <div className="tools__line" />
              <div className="tools__group">
                <span className="tools__group-num">0{i + 1}</span>
                <h3>{g.group}</h3>
                <span className="tools__group-count">{g.items.length}</span>
              </div>
              <ul className="tools__pills">
                {g.items.map((t) => (
                  <li key={t} className="tools__pill">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
