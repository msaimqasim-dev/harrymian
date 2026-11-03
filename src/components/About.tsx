import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReduced } from '../lib/motion';
import { PLATFORMS } from '../data';
import { Spark, SplitWords } from './Primitives';

const DISCIPLINES = ['Technical SEO', 'Entity optimization', 'Structured data', 'Answer-first content', 'Performance marketing'];
const OUTCOMES = ['Leads', 'Bookings', 'Revenue'];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root.current);
      // Headline enters like the reference's section title: slides & settles
      gsap.fromTo(
        q('.about__kicker'),
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, ease: 'power3.out', duration: 1.2, scrollTrigger: { trigger: root.current, start: 'top 75%' } },
      );
      // Word-by-word scrub reveal of the statement
      gsap.fromTo(
        q('.about__statement .sw__in'),
        { opacity: 0.12, yPercent: 18 },
        {
          opacity: 1,
          yPercent: 0,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: q('.about__statement')[0], start: 'top 82%', end: 'bottom 42%', scrub: 0.6 },
        },
      );
      // Big number count & columns
      const num = { v: 0 };
      gsap.to(num, {
        v: 10,
        duration: 1.6,
        ease: 'power3.out',
        onUpdate: () => {
          const n = q('.about__num-val')[0];
          if (n) n.textContent = String(Math.round(num.v));
        },
        scrollTrigger: { trigger: q('.about__grid')[0], start: 'top 80%' },
      });
      gsap.fromTo(
        q('.about__col'),
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.12, scrollTrigger: { trigger: q('.about__grid')[0], start: 'top 78%' } },
      );
      // Marquee driven by time + scroll velocity
      const track = q('.about__marquee-track')[0] as HTMLElement;
      let x = 0;
      let dir = -1;
      let boost = 0;
      let on = false;
      const tick = () => {
        if (!on) return;
        const w = track.scrollWidth / 2;
        x += dir * (0.6 + boost);
        boost *= 0.92;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        gsap.set(track, { x });
      };
      gsap.ticker.add(tick);
      ScrollTrigger.create({
        trigger: q('.about__marquee')[0],
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          on = self.isActive;
        },
        onUpdate: (self) => {
          dir = self.direction === 1 ? -1 : 1;
          boost = Math.min(Math.abs(self.getVelocity()) / 120, 18);
        },
      });
      gsap.fromTo(
        q('.about__marquee'),
        { skewY: 3, yPercent: 30, opacity: 0 },
        { skewY: 0, yPercent: 0, opacity: 1, ease: 'power3.out', duration: 1.3, scrollTrigger: { trigger: q('.about__marquee')[0], start: 'top 88%' } },
      );
      // Connect line: chips pop in sequence
      gsap.fromTo(
        q('.about__chip'),
        { y: 40, opacity: 0, rotate: () => gsap.utils.random(-4, 4) },
        {
          y: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          ease: 'back.out(1.6)',
          stagger: 0.07,
          scrollTrigger: { trigger: q('.about__connect')[0], start: 'top 75%' },
        },
      );
      return () => gsap.ticker.remove(tick);
    }, root);
    return () => ctx.revert();
  }, []);

  const doubled = [...PLATFORMS, ...PLATFORMS];

  return (
    <section id="about" ref={root} className="about" data-theme="light">
      <div className="about__inner">
        <p className="about__kicker">
          <span className="kicker-dot" /> About me
        </p>
        <h2 className="about__statement">
          <SplitWords text="I'm Harry Mian, a Senior SEO, AEO & GEO Strategist specializing in Search Engine Optimization (SEO), Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and performance marketing." />
        </h2>

        <div className="about__grid">
          <div className="about__col about__num">
            <span className="about__num-big">
              <span className="about__num-val">10</span>
              <span className="about__plus">+</span>
            </span>
            <p>
              years I’ve spent growing organic and paid search visibility for brands across ecommerce, SaaS, B2B, healthcare and multi-location services.
            </p>
          </div>
          <div className="about__col">
            <p className="about__lead">
              My experience spans search visibility programs, technical optimization, AI search strategy, paid media, analytics, content authority and
              leading search marketing teams.
            </p>
          </div>
          <div className="about__col">
            <p className="about__lead">
              My approach connects traditional search performance with emerging AI-driven discovery — improving discoverability while keeping business
              outcomes central to the strategy.
            </p>
          </div>
        </div>
      </div>

      <div className="about__marquee-wrap">
        <p className="about__marquee-label">I help brands become visible, cited &amp; recommended across</p>
        <div className="about__marquee" aria-label={PLATFORMS.join(', ')}>
          <div className="about__marquee-track" aria-hidden="true">
            {doubled.map((p, i) => (
              <span key={i} className="about__marquee-item">
                {p}
                <Spark className="about__marquee-spark" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="about__connect">
        <p className="about__connect-label">I combine</p>
        <div className="about__chips">
          {DISCIPLINES.map((d) => (
            <span key={d} className="about__chip">
              {d}
            </span>
          ))}
        </div>
        <p className="about__connect-label">into measurable search strategies tied to</p>
        <div className="about__chips">
          {OUTCOMES.map((d) => (
            <span key={d} className="about__chip about__chip--accent">
              {d}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
