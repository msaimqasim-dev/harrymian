import { useLayoutEffect, useRef } from 'react';
import { gsap, prefersReduced } from '../lib/motion';
import { CERTS } from '../data';
import { HoloCard, Spark } from './Primitives';

export default function Credentials() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        // pile → fan, scrubbed
        const fan = [
          { x: -1.5, r: -12, y: 40 },
          { x: -0.5, r: -4, y: 6 },
          { x: 0.5, r: 4, y: 6 },
          { x: 1.5, r: 12, y: 40 },
        ];
        (q('.creds__cert') as HTMLElement[]).forEach((c, i) => {
          gsap.fromTo(
            c,
            { xPercent: 0, x: 0, y: 120, rotation: (i - 1.5) * 3, scale: 0.9 },
            {
              x: () => fan[i].x * c.offsetWidth * 0.82,
              y: fan[i].y,
              rotation: fan[i].r,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: q('.creds__fan')[0], start: 'top 95%', end: 'center 55%', scrub: 0.8, invalidateOnRefresh: true },
            },
          );
        });
      });
      mm.add('(max-width: 899px)', () => {
        gsap.fromTo(
          q('.creds__cert'),
          { y: 80, rotate: 8, opacity: 0 },
          { y: 0, rotate: 0, opacity: 1, duration: 1, ease: 'back.out(1.6)', stagger: 0.08, scrollTrigger: { trigger: q('.creds__fan')[0], start: 'top 85%' } },
        );
      });
      gsap.fromTo(
        q('.creds__title .sw__in'),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: root.current, start: 'top 72%' } },
      );
      gsap.fromTo(
        q('.creds__edu'),
        { clipPath: 'inset(18% 18% 18% 18% round 32px)', y: 60 },
        { clipPath: 'inset(0% 0% 0% 0% round 32px)', y: 0, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: q('.creds__edu')[0], start: 'top 80%' } },
      );
      gsap.fromTo(
        q('.creds__edu-in > *'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.08, delay: 0.25, scrollTrigger: { trigger: q('.creds__edu')[0], start: 'top 80%' } },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="credentials" ref={root} className="creds" data-theme="light">
      <div className="creds__inner">
        <div className="creds__head">
          <p className="section-kicker">
            <span className="kicker-dot" /> Education &amp; certifications
          </p>
          <h2 className="creds__title">
            {'My foundation in computer science.'.split(' ').map((w, i) => (
              <span key={i} className="sw">
                <span className="sw__in">{w}</span>
              </span>
            ))}
          </h2>
        </div>

        <div className="creds__edu">
          <div className="creds__edu-foil" aria-hidden="true" />
          <div className="creds__edu-in">
            <span className="creds__edu-years">2010 – 2014</span>
            <h3 className="creds__edu-degree">
              Bachelor of Science
              <br />
              in Computer Science
            </h3>
            <p className="creds__edu-school">
              <Spark className="creds__edu-spark" /> The University of Chicago
            </p>
          </div>
        </div>

        <div className="creds__certs">
          <p className="creds__certs-label">My certifications</p>
          <div className="creds__fan">
            {CERTS.map((c) => (
              <div key={c.title} className="creds__cert">
                <HoloCard title={c.title} subtitle={c.sub} background={c.background} lift={-8} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
