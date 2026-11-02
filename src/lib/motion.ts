import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
// iOS/Android URL-bar show/hide fires resize; ignoring it stops pinned sections from jumping on touch.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
export const range = (a: number, b: number, v: number) => clamp((v - a) / (b - a), 0, 1);

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (prefersReduced() || lenis) return lenis;
  lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis() {
  return lenis;
}

export function scrollToTarget(target: string | number, offset = 0) {
  const l = getLenis();
  if (l) {
    l.scrollTo(target as never, { offset, duration: 1.6 });
  } else {
    if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' });
    else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
}
