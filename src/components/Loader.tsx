import { useEffect, useState } from 'react';
import { prefersReduced } from '../lib/motion';

const N = 12;

export default function Loader({ onDone }: { onDone: () => void }) {
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let t1 = 0;
    let t2 = 0;
    const finish = () => {
      const wait = Math.max(0, (prefersReduced() ? 500 : 1900) - (performance.now() - start));
      t1 = window.setTimeout(() => {
        setHiding(true);
        onDone();
        t2 = window.setTimeout(() => setGone(true), 700);
      }, wait);
    };
    const ready = () => (document.fonts ? document.fonts.ready.then(finish) : finish());
    if (document.readyState === 'complete') ready();
    else window.addEventListener('load', ready, { once: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('load', ready);
    };
  }, [onDone]);

  if (gone) return null;
  return (
    <div className={`loader ${hiding ? 'is-hiding' : ''}`} aria-hidden="true">
      <div className="loader__wheel">
        <svg viewBox="-60 -60 120 120">
          {Array.from({ length: N }).map((_, i) => {
            const a = (i / N) * 360;
            return (
              <g key={i} transform={`rotate(${a}) translate(0 -38)`}>
                <rect
                  className="loader__card"
                  style={{ animationDelay: `${(i * 0.16).toFixed(2)}s` }}
                  x="-7"
                  y="-10"
                  width="14"
                  height="20"
                  rx="2.4"
                />
              </g>
            );
          })}
          <path
            className="loader__spark"
            transform="translate(-14 -14) scale(.28)"
            d="M50 0c3.2 24.6 12.4 41.4 50 50-37.6 8.6-46.8 25.4-50 50-3.2-24.6-12.4-41.4-50-50C37.6 41.4 46.8 24.6 50 0Z"
          />
        </svg>
        <span className="loader__label">Harry Mian</span>
      </div>
    </div>
  );
}
