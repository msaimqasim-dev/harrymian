import { useLayoutEffect, useRef } from 'react';
import { EXPERTISE } from '../data';
import { gsap, isTouch, prefersReduced } from '../lib/motion';
import { HoloCard } from './Primitives';
import './hero-cards.css';

const ROTATIONS = [-11, 10, 8, -9, -6, 7];

export default function HeroCards({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layer = root.current!;
    const stage = layer.parentElement!;
    const hero = stage.parentElement!;
    const anchors = Array.from(layer.querySelectorAll<HTMLElement>('.hero-cards__anchor'));
    const q = gsap.utils.selector(layer);
    const reduced = prefersReduced();

    // Measure the existing text instead of moving it to accommodate the cards.
    const place = () => {
      const bounds = stage.getBoundingClientRect();
      const name = stage.querySelector('.hero__name')!.getBoundingClientRect();
      const scroll = stage.querySelector('.hero__scroll')!.getBoundingClientRect();
      const footer = stage.querySelector('.hero__bottom')!.getBoundingClientRect();
      const mobile = bounds.width < 900;
      const topStart = Math.min(78, bounds.height * 0.12);
      const topEnd = name.top - bounds.top - 24;
      const bottomStart = scroll.bottom - bounds.top + 24;
      const bottomEnd = footer.top - bounds.top - 22;
      const topY = (topStart + topEnd) / 2;
      const bottomY = (bottomStart + bottomEnd) / 2;
      const band = Math.max(36, Math.min(topEnd - topStart, bottomEnd - bottomStart));
      // Desktop cards sit beside the text, so size them against the viewport,
      // rather than shrinking them to the narrower space below the scroll cue.
      const width = mobile
        ? Math.max(24, Math.min(bounds.width * 0.18, band * 0.58, 155))
        : Math.min(bounds.width * 0.09, bounds.height * 0.185, 190);
      const desktopTopY = Math.max(topY, width * 0.9 + 28);
      const desktopBottomY = Math.min(bottomY, bottomEnd - width * 0.84);
      const positions = mobile && band < 45
        ? [0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((x) => [x, Math.min(topY, topEnd - 12)])
        : mobile
        ? [[0.17, topY], [0.5, topY - 5], [0.83, topY + 4], [0.17, bottomY], [0.5, bottomY + 5], [0.83, bottomY - 4]]
        : [[0.08, desktopTopY], [0.91, desktopTopY + 12], [0.055, bounds.height * 0.49], [0.945, bounds.height * 0.52], [0.16, desktopBottomY], [0.84, desktopBottomY - 8]];
      anchors.forEach((anchor, i) => {
        const [x, y] = positions[i];
        anchor.style.left = `${x * bounds.width}px`;
        anchor.style.top = `${y}px`;
        anchor.style.width = `${width * [1.06, 0.96, 0.86, 0.89, 0.98, 1.02][i]}px`;
        anchor.style.setProperty('--card-angle', `${ROTATIONS[i]}deg`);
      });
    };
    place();
    const resize = new ResizeObserver(place);
    resize.observe(stage);

    if (!ready || reduced) {
      if (reduced) gsap.set(q('.hero-cards__deal'), { autoAlpha: 1 });
      return () => resize.disconnect();
    }

    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      const deals = q('.hero-cards__deal') as HTMLElement[];
      const floats = q('.hero-cards__float') as HTMLElement[];
      const drifts = q('.hero-cards__drift') as HTMLElement[];
      const scatter = q('.hero-cards__scatter') as HTMLElement[];
      const floating: gsap.core.Tween[] = [];
      const intro = gsap.timeline({ delay: 0.75 });
      deals.forEach((card, i) => {
        intro.fromTo(card, {
          x: () => stage.clientWidth / 2 - anchors[i].offsetLeft,
          y: () => stage.clientHeight * 0.43 - anchors[i].offsetTop,
          z: -450, scale: 0.3, rotateX: 48, rotateY: i % 2 ? -50 : 50,
          rotation: i % 2 ? 24 : -24, autoAlpha: 0,
        }, {
          x: 0, y: 0, z: 0, scale: 1, rotateX: 0, rotateY: 0, rotation: 0,
          autoAlpha: 1, duration: 1.65, ease: 'power3.out',
        }, i * 0.105);
        floating.push(gsap.to(floats[i], {
          y: i % 2 ? 5 : -6, rotation: i % 2 ? 1.3 : -1.3,
          duration: 3.2 + i * 0.27, delay: 2.5 + i * 0.1,
          repeat: -1, yoyo: true, ease: 'sine.inOut',
        }));
      });

      // Separate wrappers keep scroll, pointer, deal and float transforms independent.
      gsap.to(scatter, {
        x: (i) => (anchors[i].offsetLeft - stage.clientWidth / 2) * 0.8,
        y: (i) => (anchors[i].offsetTop - stage.clientHeight / 2) * 0.95,
        rotation: (i) => ROTATIONS[i] * 1.8, rotateY: (i) => i % 2 ? 22 : -22,
        autoAlpha: 0, ease: 'power2.in',
        scrollTrigger: {
          trigger: hero, start: 'top top', end: () => `+=${stage.clientHeight * 0.6}`,
          scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: (self) => {
            anchors.forEach((anchor) => { anchor.style.pointerEvents = self.progress > 0.1 ? 'none' : ''; });
            floating.forEach((tween) => tween.paused(self.progress >= 1));
          },
        },
      });
      if (!isTouch()) {
        const setters = drifts.map((card) => ({
          x: gsap.quickTo(card, 'x', { duration: 1.2, ease: 'power3.out' }),
          y: gsap.quickTo(card, 'y', { duration: 1.2, ease: 'power3.out' }),
        }));
        const move = (event: PointerEvent) => {
          const bounds = stage.getBoundingClientRect();
          setters.forEach((set, i) => {
            const depth = 8 + i * 2;
            set.x((event.clientX / bounds.width - 0.5) * depth);
            set.y(((event.clientY - bounds.top) / bounds.height - 0.5) * depth);
          });
        };
        const leave = () => setters.forEach((set) => { set.x(0); set.y(0); });
        stage.addEventListener('pointermove', move);
        stage.addEventListener('pointerleave', leave);
        cleanups.push(() => {
          stage.removeEventListener('pointermove', move);
          stage.removeEventListener('pointerleave', leave);
          setters.forEach((set) => { set.x.tween.kill(); set.y.tween.kill(); });
        });
      }
    }, layer);
    return () => { resize.disconnect(); cleanups.forEach((off) => off()); ctx.revert(); };
  }, [ready]);

  return (
    <div ref={root} className="hero-cards" aria-hidden="true">
      {EXPERTISE.map((card) => (
        <div key={card.id} className="hero-cards__anchor">
          <div className="hero-cards__scatter">
            <div className="hero-cards__deal">
              <div className="hero-cards__float">
                <div className="hero-cards__drift">
                  <div className="hero-cards__lift">
                    <HoloCard title={card.title} subtitle={card.tagline} num={card.num}
                      background={card.background} light={card.light} icon={card.icon} flat />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
