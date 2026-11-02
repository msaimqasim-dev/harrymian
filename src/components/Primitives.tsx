import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { clamp, lerp } from '../lib/motion';

/* ---------- Roll text (hover line swap, .42s cubic-bezier(.5,0,.1,1)) ---------- */
export function Roll({ children }: { children: string }) {
  return (
    <span className="roll" aria-label={children}>
      <span className="roll__stack" aria-hidden="true">
        <span className="roll__line">{children}</span>
        <span className="roll__line">{children}</span>
      </span>
    </span>
  );
}

/* ---------- The Spark mark (Harry's brand glyph) ---------- */
export function Spark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" aria-hidden="true">
      <path
        fill="currentColor"
        d="M50 0c3.2 24.6 12.4 41.4 50 50-37.6 8.6-46.8 25.4-50 50-3.2-24.6-12.4-41.4-50-50C37.6 41.4 46.8 24.6 50 0Z"
      />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`logo ${dark ? 'logo--dark' : ''}`}>
      <Spark className="logo__spark" />
      <span className="logo__word">
        Harry<b>Mian</b>
      </span>
    </span>
  );
}

/* ---------- Line icons for the expertise cards ---------- */
export function CardIcon({ name }: { name: string }) {
  const p = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const icons: Record<string, ReactNode> = {
    search: (
      <>
        <circle cx="44" cy="44" r="24" {...p} />
        <circle cx="44" cy="44" r="14" {...p} opacity=".5" />
        <path d="M62 62 82 82" {...p} />
      </>
    ),
    answer: (
      <>
        <path d="M18 24h64v40H46L30 78V64H18Z" {...p} />
        <path d="M32 40h36M32 50h22" {...p} />
      </>
    ),
    spark: (
      <>
        <path d="M50 14c2 16 8 26 30 36-22 10-28 20-30 36-2-16-8-26-30-36 22-10 28-20 30-36Z" {...p} />
        <circle cx="50" cy="50" r="6" {...p} />
      </>
    ),
    target: (
      <>
        <circle cx="50" cy="50" r="32" {...p} />
        <circle cx="50" cy="50" r="20" {...p} />
        <circle cx="50" cy="50" r="7" {...p} />
        <path d="M50 10v10M50 80v10M10 50h10M80 50h10" {...p} />
      </>
    ),
    chart: (
      <>
        <path d="M16 82h68" {...p} />
        <path d="M24 70V52M40 70V38M56 70V46M72 70V24" {...p} />
        <path d="M22 40 40 26l16 10 20-18" {...p} opacity=".55" />
      </>
    ),
    crown: (
      <>
        <path d="M18 70 22 32l16 16 12-22 12 22 16-16 4 38Z" {...p} />
        <path d="M22 80h56" {...p} />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 100 100" className="holo__icon-svg">
      {icons[name] ?? icons.spark}
    </svg>
  );
}

/* ---------- Holographic foil card ---------- */
export type HoloCardProps = {
  title: string;
  subtitle?: string;
  num?: string;
  background: string;
  light?: boolean;
  icon?: string;
  flat?: boolean;
  lift?: number;
  className?: string;
  footer?: ReactNode;
};

export function HoloCard({ title, subtitle, num, background, light, icon, flat = false, lift, className = '', footer }: HoloCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const host = (!flat && el.parentElement) || el;
    let raf = 0;
    const pos = { x: 0, y: 0 };
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      const gx = clamp((pos.x - r.left) / r.width, 0, 1);
      const gy = clamp((pos.y - r.top) / r.height, 0, 1);
      if (!flat) {
        const rx = (gy - 0.5) * -13;
        const ry = (gx - 0.5) * 20;
        const ty = lift ?? (host.classList.contains('is-apex') ? -10 : -6);
        el.style.transition = 'transform 0.12s ease-out';
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${ty}%)`;
      }
      el.style.setProperty('--mx', `${gx * 100}%`);
      el.style.setProperty('--my', `${gy * 100}%`);
      el.style.setProperty('--bgx', `${lerp(30, 70, gx)}%`);
      el.style.setProperty('--bgy', `${lerp(30, 70, gy)}%`);
      el.style.setProperty('--active', '1');
    };
    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    const leave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (!flat) {
        el.style.transition = '';
        el.style.transform = '';
      }
      el.style.setProperty('--active', '0');
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    return () => {
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, [flat, lift]);

  const lines = title.split('\n');
  return (
    <div ref={ref} className={`holo ${light ? 'holo--light' : ''} ${className}`} style={{ background }}>
      <div className="holo__scale">
        {icon && (
          <div className="holo__icon" aria-hidden="true">
            <CardIcon name={icon} />
            <div className="holo__icon-holo" />
          </div>
        )}
        <div className="holo__texture" aria-hidden="true" />
        <div className="holo__foil" aria-hidden="true" />
        <div className="holo__glare" aria-hidden="true" />
        <div className="holo__frame" aria-hidden="true" />
        <div className="holo__inner">
          <div className="holo__top">
            <p className="holo__title">
              {lines.map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </p>
            {num && <span className="holo__num">{num}</span>}
          </div>
          <div className="holo__bottom">
            {subtitle && <p className="holo__subtitle">{subtitle}</p>}
            {footer ?? <Spark className="holo__mark" />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Split text into words/chars for staggered reveals ---------- */
export function SplitWords({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i} className={`sw ${className}`}>
          <span className="sw__in">{w}</span>
              </span>
      ))}
    </>
  );
}
