import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReduced, clamp, lerp, smooth, range } from '../lib/motion';
import { EXPERTISE, FILTERS } from '../data';
import { HoloCard } from './Primitives';

const N = EXPERTISE.length;
const WHEEL_END = 0.68;
const MORPH_START = 0.7;
const MORPH_END = 0.86;

const matches = (i: number, f: string) => f === 'all' || EXPERTISE[i].category.includes(f);

function FilterDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);
  const current = FILTERS.find((f) => f.id === value)!;
  return (
    <div className={`filterdd ${open ? 'is-open' : ''}`} ref={ref}>
      <span className="filterdd__prefix">I want to</span>
      <button className="filterdd__btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="listbox">
        <span className="filterdd__value">{current.label}</span>
        <span className="filterdd__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M5 8h14M8 12h8M11 16h2" />
          </svg>
        </span>
      </button>
      <ul className="filterdd__menu" role="listbox">
        {FILTERS.map((f) => (
          <li key={f.id}>
            <button
              role="option"
              aria-selected={f.id === value}
              className={f.id === value ? 'is-active' : ''}
              onClick={() => {
                onChange(f.id);
                setOpen(false);
              }}
            >
              {f.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Expertise() {
  const root = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [filter, setFilter] = useState('all');
  const filterRef = useRef('all');
  const api = useRef<{ refilter: () => void } | null>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const reduced = prefersReduced();

  useLayoutEffect(() => {
    if (reduced) return;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const pin = q('.xp__pin')[0] as HTMLElement;
    const detail = q('.xp__detail')[0] as HTMLElement;
    const S = { vw: 0, vh: 0, R: 0, cw: 0, spacing: 15, apexY: 0, wheelScale: 1.04, slots: [] as { x: number; y: number; scale: number }[], rank: {} as Record<number, number>, p: 0 };
    let tweening = false;

    const layoutGrid = () => {
      const ids = EXPERTISE.map((_, i) => i).filter((i) => matches(i, filterRef.current));
      const n = ids.length;
      const { vw, vh, cw } = S;
      const ch = cw / 0.71;
      const cols = vw >= 1100 ? Math.min(6, n) : vw >= 640 ? Math.min(3, n) : Math.min(2, n);
      const rows = Math.ceil(n / cols);
      const gap = Math.max(12, vw * 0.016);
      const availW = vw * 0.92 - gap * (cols - 1);
      const summary = q('.xp__summary')[0] as HTMLElement;
      const filter = q('.filterdd')[0] as HTMLElement;
      const summaryTop = summary.getBoundingClientRect().top - pin.getBoundingClientRect().top;
      const gridTop = summaryTop + filter.offsetHeight + 20;
      const gridBottom = vh - (vw >= 1100 ? clamp(vh * 0.15, 96, 140) : 24);
      const gridHeight = Math.max(1, gridBottom - gridTop);
      const availH = Math.max(1, gridHeight - gap * (rows - 1));
      const sc = Math.min(availW / cols / cw, availH / rows / ch, 1.25);
      const w = cw * sc;
      const h = ch * sc;
      const totalH = rows * h + gap * (rows - 1);
      const slots: typeof S.slots = [];
      for (let k = 0; k < n; k++) {
        const r = Math.floor(k / cols);
        const inRow = Math.min(cols, n - r * cols);
        const c = k - r * cols;
        const rowW = inRow * w + gap * (inRow - 1);
        slots.push({ x: -rowW / 2 + w / 2 + c * (w + gap), y: gridTop + gridHeight / 2 - vh / 2 - totalH / 2 + h / 2 + r * (h + gap), scale: sc });
      }
      S.rank = {};
      ids.forEach((id, k) => (S.rank[id] = k));
      S.slots = slots;
    };

    const measureDescriptionBottom = () => {
      const body = detail.querySelector<HTMLElement>('.xp__detail-body');
      const kicker = detail.querySelector<HTMLElement>('.xp__detail-kicker');
      if (!body || !kicker) return S.vh * 0.35;

      // Reserve enough space for the longest description at this viewport width.
      const probe = body.cloneNode(false) as HTMLElement;
      Object.assign(probe.style, {
        position: 'absolute',
        visibility: 'hidden',
        pointerEvents: 'none',
        top: '0',
        left: '0',
        width: `${body.offsetWidth}px`,
      });
      probe.setAttribute('aria-hidden', 'true');
      pin.appendChild(probe);
      const bodyHeight = Math.max(...EXPERTISE.map((item) => {
        probe.textContent = item.body;
        return probe.offsetHeight;
      }));
      probe.remove();

      const detailTop = detail.getBoundingClientRect().top - pin.getBoundingClientRect().top;
      const kickerGap = parseFloat(getComputedStyle(kicker).marginBottom) || 0;
      return detailTop + kicker.offsetHeight + kickerGap + bodyHeight;
    };

    const measure = () => {
      S.vw = pin.clientWidth || window.innerWidth;
      S.vh = pin.clientHeight || window.innerHeight;
      S.cw = cards[0]?.offsetWidth || 220;
      const mobile = S.vw < 640;
      S.R = S.vh * (mobile ? 0.82 : 0.9);
      S.spacing = mobile ? 17 : 14;
      const cardHeight = S.cw / 0.71;
      const previousTop = S.vh * (mobile ? 0.67 : 0.65) - cardHeight * 1.04 * 0.59;
      const cardTop = Math.max(previousTop + 18, measureDescriptionBottom() + clamp(S.vh * 0.03, 20, 28));
      S.wheelScale = clamp((S.vh - cardTop - 20) / cardHeight, 0.35, 1.04);
      S.apexY = cardTop - S.vh * 0.5 + cardHeight * S.wheelScale * 0.59;
      layoutGrid();
    };

    const gridTarget = (i: number) => {
      if (matches(i, filterRef.current)) {
        const s = S.slots[S.rank[i]] || { x: 0, y: 0, scale: 1 };
        return { x: s.x, y: s.y, rotation: 0, scale: s.scale, autoAlpha: 1 };
      }
      return { x: 0, y: S.vh * 0.1, rotation: 0, scale: 0.6, autoAlpha: 0 };
    };

    const ease = gsap.parseEase('power2.out');
    let lastActive = -1;

    const render = (p: number) => {
      S.p = p;
      // wheel index with dwell: integer part linear, fractional smoothstep
      let I: number;
      const intro = 0.07;
      if (p < intro) I = lerp(-3.2, 0, ease(p / intro));
      else {
        const t = range(intro, WHEEL_END, p) * (N - 1);
        const k = Math.floor(t);
        const f = t - k;
        I = Math.min(N - 1, k + smooth(0.25, 0.75, f));
      }
      const morph = smooth(MORPH_START, MORPH_END, p);
      const apexIdx = morph < 0.05 ? clamp(Math.round(I), 0, N - 1) : -1;

      if (apexIdx !== lastActive) {
        lastActive = apexIdx;
        if (apexIdx >= 0) setActive(apexIdx);
      }

      // backgrounds crossfade by I
      q('.xp__mesh').forEach((m, i) => gsap.set(m, { opacity: clamp(1 - Math.abs(I - i), 0, 1) * (1 - morph * 0.6) }));
      gsap.set(q('.xp__mesh-base'), { opacity: morph });
      gsap.set(q('.xp__detail'), { autoAlpha: smooth(0.0, 0.05, p) * (1 - smooth(MORPH_START - 0.03, MORPH_START + 0.05, p)) });
      gsap.set(q('.xp__head'), { y: -smooth(0, 0.06, p) * 0 });
      gsap.set(q('.xp__filter'), { autoAlpha: smooth(MORPH_END - 0.06, MORPH_END, p), y: (1 - smooth(MORPH_END - 0.06, MORPH_END, p)) * -20 });
      gsap.set(q('.xp__counter'), { autoAlpha: 1 - morph });
      el.classList.toggle('is-grid', morph > 0.98);

      if (tweening) return;
      cards.forEach((c, i) => {
        const deg = (i - I) * S.spacing;
        const rad = (deg * Math.PI) / 180;
        const ad = Math.abs(deg);
        const wx = Math.sin(rad) * S.R;
        const wy = (1 - Math.cos(rad)) * S.R * 0.96 + S.apexY;
        const ws = lerp(S.wheelScale * (0.92 / 1.04), S.wheelScale, 1 - smooth(0, 16, ad));
        const wa = ad > 95 ? 0 : 1;
        const g = gridTarget(i);
        gsap.set(c, {
          x: lerp(wx, g.x, morph),
          y: lerp(wy, g.y, morph),
          rotation: lerp(deg, g.rotation, morph),
          scale: lerp(ws, g.scale, morph),
          autoAlpha: lerp(wa, g.autoAlpha, morph),
          zIndex: morph > 0.5 ? 10 : 100 - Math.round(ad),
        });
        c.classList.toggle('is-apex', i === apexIdx);
      });
    };

    const ctx = gsap.context(() => {
      measure();
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: () => '+=' + window.innerHeight * (N * 0.55 + 1.1),
        pin: q('.xp__pin')[0],
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          render(self.progress);
        },
        onUpdate: (self) => render(self.progress),
      });
      // title entry
      gsap.fromTo(
        q('.xp__title .sw__in'),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 70%' } },
      );
      render(0);
    }, el);

    api.current = {
      refilter: () => {
        layoutGrid();
        if (S.p < MORPH_END - 0.02) {
          render(S.p);
          return;
        }
        tweening = true;
        const tl = gsap.timeline({ onComplete: () => { tweening = false; render(S.p); } });
        cards.forEach((c, i) => {
          const g = gridTarget(i);
          tl.to(c, { ...g, duration: 0.75, ease: 'power3.inOut' }, matches(i, filterRef.current) ? 0.05 + (S.rank[i] ?? 0) * 0.04 : 0);
        });
      },
    };

    return () => {
      ctx.revert();
      api.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    filterRef.current = filter;
    api.current?.refilter();
  }, [filter]);

  const a = EXPERTISE[active];
  const h = hovered !== null ? EXPERTISE[hovered] : null;

  if (reduced) {
    return (
      <section id="expertise" className="xp xp--static" data-theme="light">
        <h2 className="xp__title">Six disciplines. One search strategy.</h2>
        <div className="xp__static-grid">
          {EXPERTISE.map((e) => (
            <div key={e.id} className="xp__static-item">
              <div className="xp__static-card">
                <HoloCard title={e.title} subtitle={e.tagline} num={e.num} background={e.background} light={e.light} icon={e.icon} flat />
              </div>
              <p>{e.body}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="expertise" ref={root} className="xp" data-theme="light">
      <div className="xp__pin">
        <div className="xp__bg" aria-hidden="true">
          <div className="xp__mesh-base" />
          {EXPERTISE.map((e) => (
            <div key={e.id} className="xp__mesh" style={{ background: e.mesh }} />
          ))}
        </div>

        <div className="xp__head">
          <p className="section-kicker">
            <span className="kicker-dot" /> Core expertise
          </p>
          <h2 className="xp__title">
            {'Six disciplines. One search strategy.'.split(' ').map((w, i) => (
              <span key={i} className="sw">
                <span className="sw__in">{w}</span>
              </span>
            ))}
          </h2>
          <div className="xp__summary">
            <div className="xp__detail" aria-live="polite">
              <div key={a.id} className="xp__detail-in">
                <p className="xp__detail-kicker">
                  <span>{a.num}</span> — {a.short}
                </p>
                <p className="xp__detail-body">{a.body}</p>
              </div>
            </div>
            <div className="xp__filter">
              <FilterDropdown value={filter} onChange={setFilter} />
            </div>
          </div>
        </div>

        <div className="xp__counter" aria-hidden="true">
          <span className="xp__counter-cur">{a.num}</span>
          <span className="xp__counter-sep" />
          <span>0{N}</span>
        </div>

        <div className={`xp__caption ${h ? 'is-on' : ''}`} aria-hidden={!h}>
          {h && (
            <div key={h.id} className="xp__caption-in">
              <span className="xp__caption-num">{h.num}</span>
              <p>{h.body}</p>
            </div>
          )}
        </div>

        <div className="xp__stage">
          {EXPERTISE.map((e, i) => (
            <div
              key={e.id}
              ref={(n) => {
                cardRefs.current[i] = n;
              }}
              className="xp__card"
              tabIndex={0}
              aria-label={`${e.num} ${e.title.replace('\n', ' ')}: ${e.body}`}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            >
              <HoloCard title={e.title} subtitle={e.tagline} num={e.num} background={e.background} light={e.light} icon={e.icon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
