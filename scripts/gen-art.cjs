// Generates the six conceptual portfolio artboards (SVG) into src/assets/art.
// Run: node scripts/gen-art.cjs
// Each board is 1600x1100. The focal composition sits inside x:340-1260, y:160-940 so it survives both the
// portrait card crop and the wide case-study hero crop; the periphery carries supporting detail.
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'src', 'assets', 'art');
fs.mkdirSync(OUT, { recursive: true });

const W = 1600, H = 1100;
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
const n = (v) => +(+v).toFixed(1);
const A = (o) => `fill-opacity="${o}"`;
const S = (c, w = 2, o = 1) => `stroke="${c}" stroke-width="${w}" stroke-opacity="${o}"`;
const R = (x, y, w, h, r, fill, ex = '') => `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${r}" fill="${fill}" ${ex}/>`;
const C = (x, y, r, fill, ex = '') => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${fill}" ${ex}/>`;
const L = (x1, y1, x2, y2, c, w = 2, ex = '') => `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${ex}/>`;
const P = (d, fill = 'none', st = '', ex = '') => `<path d="${d}" fill="${fill}" ${st} stroke-linecap="round" stroke-linejoin="round" ${ex}/>`;
const T = (x, y, s, size, fill, ex = '') => `<text x="${n(x)}" y="${n(y)}" font-family="${FONT}" font-size="${size}" font-weight="600" fill="${fill}" ${ex}>${s}</text>`;
const spark = (cx, cy, s, fill, ex = '') =>
  P(`M${cx} ${cy - s} C${cx + s * .08} ${cy - s * .5} ${cx + s * .26} ${cy - s * .08} ${cx + s} ${cy} C${cx + s * .26} ${cy + s * .08} ${cx + s * .08} ${cy + s * .5} ${cx} ${cy + s} C${cx - s * .08} ${cy + s * .5} ${cx - s * .26} ${cy + s * .08} ${cx - s} ${cy} C${cx - s * .26} ${cy - s * .08} ${cx - s * .08} ${cy - s * .5} ${cx} ${cy - s}Z`, fill, '', ex);
const lin = (id, stops, x2 = 1, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const glow = (id, c, o = .5) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
const SH = '<filter id="sh" x="-20%" y="-20%" width="140%" height="165%"><feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#0b0f26" flood-opacity=".24"/></filter><filter id="sh2" x="-20%" y="-20%" width="140%" height="175%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#0b0f26" flood-opacity=".14"/></filter>';
const doc = (defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs>${defs}</defs>${body}</svg>`;
const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function smooth(pts, t = 0.18) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += ` C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/* 01 — AI answers & citations (dark indigo) */
function art1() {
  const defs = lin('bg', [[0, '#0c1030'], [.55, '#1a1f5c'], [1, '#2b1b66']]) + glow('gO', '#f05722', .55) + glow('gV', '#8a63ff', .5) +
    '<pattern id="dots" width="44" height="44" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.8" fill="#fff" fill-opacity=".15"/></pattern>' + SH;
  let b = R(0, 0, W, H, 0, 'url(#bg)') + C(1300, 950, 560, 'url(#gO)') + C(240, 150, 500, 'url(#gV)') + R(0, 0, W, H, 0, 'url(#dots)');
  const eng = ['#7894ff', '#d875ff', '#ff7773', '#5fe3d6', '#ffd84d', '#8ee26b'];
  eng.forEach((c, i) => {
    const y = 250 + i * 118, ty = 330 + i * 58;
    b += P(`M206 ${y} C330 ${y} 340 ${ty} 430 ${ty}`, 'none', S('#fff', 2, .2));
    b += C(170, y, 36, '#10143a', S(c, 5)) + C(170, y, 12, c);
  });
  b += R(430, 230, 740, 600, 40, '#fff', A(.07) + ' ' + S('#fff', 2, .2));
  b += C(492, 292, 24, '#f05722') + spark(492, 292, 12, '#fff');
  b += R(534, 282, 170, 20, 10, '#fff', A(.7)) + R(1000, 272, 140, 40, 20, '#fff', A(.14)) + T(1070, 298, 'AI answer', 17, '#fff', 'text-anchor="middle" fill-opacity=".9"');
  [370, 418, 466, 514, 562].forEach((y, i) => { b += R(470, y, [560, 520, 540, 470, 300][i], 16, 8, '#fff', A(.62 - i * .07)); });
  const chips = [[1000, 411, '1', 578], [1020, 459, '2', 814], [950, 507, '3', 1050]];
  chips.forEach(([x, y, , tx]) => { b += P(`M${x + 22} ${y + 30} C${x + 22} ${y + 150} ${tx} ${y + 80} ${tx} 640`, 'none', S('#ff7a45', 2.5, .9), 'stroke-dasharray="7 9"'); });
  chips.forEach(([x, y, t]) => { b += R(x, y, 44, 30, 10, '#f05722') + T(x + 22, y + 21, t, 16, '#fff', 'text-anchor="middle"'); });
  ['#7894ff', '#ffd84d', '#5fe3d6'].forEach((c, i) => {
    const x = 470 + i * 236, y = 640;
    b += R(x, y, 216, 150, 22, '#fff', A(.1) + ' ' + S('#fff', 2, .22));
    b += C(x + 38, y + 42, 18, c) + R(x + 68, y + 30, 100, 12, 6, '#fff', A(.65)) + R(x + 68, y + 52, 70, 10, 5, '#fff', A(.35));
    b += R(x + 24, y + 90, 168, 10, 5, '#fff', A(.25)) + R(x + 24, y + 112, 120, 10, 5, '#fff', A(.2));
    b += C(x + 188, y + 22, 13, '#f05722') + T(x + 188, y + 28, String(i + 1), 15, '#fff', 'text-anchor="middle"');
  });
  [150, 105, 60].forEach((r) => { b += C(1420, 780, r, 'none', S('#fff', 2, .12)); });
  b += C(1420, 780, 105, 'none', S('#f05722', 14) + ` stroke-dasharray="${n(2 * Math.PI * 105 * .62)} 900" transform="rotate(-90 1420 780)" stroke-linecap="round"`);
  b += T(1420, 786, 'share of voice', 15, '#fff', 'text-anchor="middle" fill-opacity=".6"');
  [90, 150, 110, 190, 140, 220].forEach((h, i) => { b += R(1330 + i * 34, 520 - h, 20, h, 10, '#fff', A(.18 + i * .06)); });
  return doc(defs, b);
}

/* 02 — Technical SEO: crawl tree on blueprint (light) */
function art2() {
  const defs = lin('bg', [[0, '#f4f7fd'], [1, '#dbe5f7']]) +
    '<pattern id="g1" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M50 0H0V50" fill="none" stroke="#13193b" stroke-opacity=".07"/></pattern><pattern id="g2" width="250" height="250" patternUnits="userSpaceOnUse"><path d="M250 0H0V250" fill="none" stroke="#13193b" stroke-opacity=".13" stroke-width="1.5"/></pattern>' + SH;
  let b = R(0, 0, W, H, 0, 'url(#bg)') + R(0, 0, W, H, 0, 'url(#g1)') + R(0, 0, W, H, 0, 'url(#g2)') + C(1380, 140, 320, '#fff', A(.5));
  const root = { x: 800, y: 230, w: 240, h: 78 };
  const l2 = [470, 800, 1130].map((x) => ({ x, y: 420, w: 180, h: 64 }));
  const l3 = [360, 570, 730, 880, 1040, 1230].map((x) => ({ x, y: 620, w: 130, h: 56 }));
  const l4 = [{ x: 360, p: 0 }, { x: 730, p: 2 }, { x: 880, p: 3 }, { x: 1230, p: 5 }].map((o) => ({ ...o, y: 820, w: 120, h: 52 }));
  const edge = (a, c, st, ex = '') => { const y1 = a.y + a.h / 2, y2 = c.y - c.h / 2, m = (y1 + y2) / 2; return P(`M${a.x} ${y1} V${m} H${c.x} V${y2}`, 'none', st, ex); };
  const base = S('#13193b', 3, .26);
  l2.forEach((c) => { b += edge(root, c, base); });
  l3.forEach((c, i) => { b += edge(l2[Math.floor(i / 2)], c, i === 4 ? S('#ff5a5f', 3.5, .8) : base, i === 4 ? 'stroke-dasharray="9 9"' : ''); });
  l4.forEach((c) => { b += edge(l3[c.p], c, base); });
  const hot = S('#f05722', 6);
  b += edge(root, l2[1], hot) + edge(l2[1], l3[3], hot) + edge(l3[3], l4[2], hot);
  const node = (o, on = false, dark = false) =>
    R(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h, 16, dark ? '#13193b' : '#fff', `filter="url(#sh2)" ` + S(on ? '#f05722' : '#13193b', on ? 3.5 : 2, on ? 1 : .16)) +
    R(o.x - o.w / 2 + 18, o.y - 9, o.w * .46, 11, 5.5, dark ? '#fff' : '#13193b', A(dark ? .85 : .7)) +
    R(o.x - o.w / 2 + 18, o.y + 9, o.w * .28, 8, 4, dark ? '#fff' : '#13193b', A(dark ? .4 : .24));
  b += node(root, true, true) + C(root.x + root.w / 2 - 26, root.y, 8, '#f05722');
  l2.forEach((o, i) => { b += node(o, i === 1); });
  l3.forEach((o, i) => { b += node(o, i === 3); });
  l4.forEach((o, i) => { b += node(o, i === 2); });
  [[800, 345], [840, 522], [880, 721]].forEach(([x, y]) => { b += C(x, y, 11, '#f05722', 'stroke="#fff" stroke-width="4"'); });
  const bl = l3[4], bx = bl.x + bl.w / 2, by = bl.y - bl.h / 2;
  b += C(bx, by, 17, '#ff5a5f', 'stroke="#fff" stroke-width="3"') + L(bx - 6, by - 6, bx + 6, by + 6, '#fff', 3) + L(bx + 6, by - 6, bx - 6, by + 6, '#fff', 3);
  b += R(1330, 440, 150, 56, 16, 'none', S('#13193b', 2.5, .4) + ' stroke-dasharray="9 9"') + T(1405, 475, 'orphan page', 17, '#13193b', 'text-anchor="middle" fill-opacity=".5"');
  [['#1fc796', .84], ['#f2b705', .62], ['#f05722', .9]].forEach(([c, t], i) => {
    const cy = 440 + i * 190, cx = 170, r = 66;
    b += P(`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}`, 'none', S('#13193b', 16, .1));
    const x = cx - r * Math.cos(Math.PI * t), y = cy - r * Math.sin(Math.PI * t);
    b += P(`M${cx - r} ${cy} A${r} ${r} 0 0 1 ${n(x)} ${n(y)}`, 'none', S(c, 16));
    b += R(cx - 44, cy + 22, 88, 12, 6, '#13193b', A(.5));
  });
  b += R(1290, 720, 250, 230, 24, '#13193b', 'filter="url(#sh)"') + C(1318, 750, 6, '#ff5a5f') + C(1338, 750, 6, '#ffd84d') + C(1358, 750, 6, '#5fe3a8');
  [[170, '#ff8a63'], [120, '#7894ff'], [200, '#5fe3d6'], [90, '#fff'], [150, '#ffd84d'], [110, '#d875ff']].forEach(([w, c], i) => { b += R(1318 + (i % 3 === 1 ? 24 : 0), 786 + i * 25, w, 11, 5.5, c, A(c === '#fff' ? .35 : .85)); });
  return doc(defs, b);
}

/* 03 — Multi-location healthcare: map + listing card (mint) */
function art3() {
  const rng = mulberry(7);
  const defs = lin('bg', [[0, '#eefbf6'], [1, '#c6ece5']]) + SH;
  let b = R(0, 0, W, H, 0, 'url(#bg)');
  for (let i = 0; i < 70; i++) { const w = 50 + rng() * 90, h = 40 + rng() * 80; b += R(rng() * W - 20, rng() * H - 20, w, h, 12, '#d6efe8', A(.5 + rng() * .4)); }
  b += P('M-50 820 C150 760 300 840 420 920 C520 990 400 1100 300 1150 L-50 1150Z', '#a9dbe8');
  b += '<ellipse cx="1040" cy="800" rx="190" ry="120" fill="#bfe8cb"/><ellipse cx="420" cy="230" rx="200" ry="110" fill="#bfe8cb"/><ellipse cx="1330" cy="300" rx="150" ry="100" fill="#cdeed8"/>';
  const major = ['M-50 300 C300 260 520 420 820 360 S1300 220 1700 300', 'M-50 700 C260 640 560 760 860 680 S1380 600 1700 720', 'M300 -50 C340 300 260 600 380 1150', 'M820 -50 C780 260 900 560 840 1150', 'M1260 -50 C1300 300 1200 650 1320 1150'];
  const minor = ['M-50 500 C400 520 700 480 1700 520', 'M560 -50 C600 400 520 700 600 1150', 'M1060 -50 C1040 380 1120 700 1060 1150', 'M-50 120 C500 160 1000 60 1700 140', 'M-50 940 C500 880 1000 990 1700 900'];
  minor.forEach((d) => { b += P(d, 'none', S('#fff', 9, .85)); });
  major.forEach((d) => { b += P(d, 'none', S('#fff', 22)); });
  major.forEach((d) => { b += P(d, 'none', S('#bfe3da', 2) + ' stroke-dasharray="10 14"'); });
  const pin = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="70" ry="24" fill="none" ${S(c, 3, .35)}/><ellipse cx="0" cy="0" rx="40" ry="14" fill="${c}" fill-opacity=".25"/><path d="M0 0 C-26 -36 -48 -52 -48 -82 A48 48 0 1 1 48 -82 C48 -52 26 -36 0 0Z" fill="${c}" filter="url(#sh2)"/><circle cx="0" cy="-82" r="19" fill="#fff"/></g>`;
  [[470, 430, .85, '#19a5b5'], [700, 545, .8, '#2fb98a'], [1170, 520, .85, '#19a5b5'], [400, 770, .8, '#2fb98a'], [1190, 780, .8, '#19a5b5'], [880, 390, 1.15, '#13193b']].forEach(([x, y, s, c]) => { b += pin(x, y, s, c); });
  b += R(560, 610, 520, 300, 34, '#fff', 'filter="url(#sh)"');
  b += C(612, 662, 26, '#ffd0ba', S('#fff', 4)) + C(650, 662, 26, '#bae5e5', S('#fff', 4)) + C(688, 662, 26, '#d0d8f7', S('#fff', 4));
  b += R(740, 646, 200, 20, 10, '#13193b', A(.85)) + R(740, 676, 140, 14, 7, '#13193b', A(.3));
  b += R(600, 730, 132, 40, 20, '#d6f5e8') + T(666, 757, 'Telehealth', 18, '#0b6b50', 'text-anchor="middle"');
  b += R(744, 730, 124, 40, 20, '#e0f0fa') + T(806, 757, 'In-person', 18, '#14688a', 'text-anchor="middle"');
  b += R(600, 800, 380, 12, 6, '#13193b', A(.12)) + R(600, 828, 300, 12, 6, '#13193b', A(.1));
  b += R(900, 830, 150, 50, 25, '#13193b') + T(975, 862, 'Book visit', 18, '#fff', 'text-anchor="middle"');
  return doc(defs, b);
}

/* 04 — Ecommerce SEO & paid: product feed + sponsored card (peach) */
function art4() {
  const defs = lin('bg', [[0, '#fff3e8'], [.55, '#ffd9c8'], [1, '#ffb9a6']]) +
    '<radialGradient id="sph" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#9fb2ff"/><stop offset="1" stop-color="#4a56d6"/></radialGradient>' + SH;
  let b = R(0, 0, W, H, 0, 'url(#bg)') + C(1300, 210, 280, '#fff', A(.35)) + C(220, 930, 330, '#ff9e86', A(.35));
  b += R(480, 180, 640, 78, 39, '#fff', 'filter="url(#sh2)"');
  b += C(532, 219, 15, 'none', S('#13193b', 4, .8)) + L(543, 230, 556, 243, '#13193b', 4) + R(584, 209, 250, 18, 9, '#13193b', A(.18));
  b += R(972, 194, 136, 50, 25, '#f05722') + T(1040, 227, 'Search', 20, '#fff', 'text-anchor="middle"');
  const prod = (i, cx, cy) => {
    switch (i) {
      case 0: return R(cx - 26, cy - 8, 52, 68, 16, '#13193b') + R(cx - 14, cy - 42, 28, 38, 6, '#13193b') + R(cx - 17, cy - 54, 34, 14, 5, '#f05722') + R(cx - 18, cy + 10, 36, 26, 6, '#fff', A(.9));
      case 1: return P(`M${cx - 50} ${cy - 8} L${cx + 50} ${cy - 8} L${cx + 60} ${cy + 58} L${cx - 60} ${cy + 58}Z`, '#f05722') + P(`M${cx - 26} ${cy - 8} C${cx - 26} ${cy - 52} ${cx + 26} ${cy - 52} ${cx + 26} ${cy - 8}`, 'none', S('#13193b', 8));
      case 2: return C(cx, cy + 6, 52, 'url(#sph)') + `<ellipse cx="${cx - 18}" cy="${cy - 18}" rx="14" ry="8" fill="#fff" fill-opacity=".5" transform="rotate(-30 ${cx - 18} ${cy - 18})"/>`;
      case 3: return P(`M${cx} ${cy - 50} L${cx + 52} ${cy - 22} L${cx} ${cy + 6} L${cx - 52} ${cy - 22}Z`, '#7894ff') + P(`M${cx - 52} ${cy - 22} L${cx} ${cy + 6} L${cx} ${cy + 64} L${cx - 52} ${cy + 36}Z`, '#4f66d8') + P(`M${cx + 52} ${cy - 22} L${cx} ${cy + 6} L${cx} ${cy + 64} L${cx + 52} ${cy + 36}Z`, '#2f45b5');
      case 4: return R(cx - 34, cy - 34, 68, 88, 16, '#13193b') + R(cx - 34, cy - 2, 68, 16, 0, '#f2c12e');
      default: return P(`M${cx - 46} ${cy + 20} C${cx - 46} ${cy - 60} ${cx + 46} ${cy - 60} ${cx + 46} ${cy + 20}`, 'none', S('#13193b', 10)) + R(cx - 58, cy + 6, 26, 46, 12, '#ff7381') + R(cx + 32, cy + 6, 26, 46, 12, '#ff7381');
    }
  };
  const tints = ['#ffe6da', '#ffd0ba', '#e4e7ff', '#d9f5ec', '#fff0c4', '#ffdbe2'];
  const xs = [470, 706, 942], ys = [300, 590];
  for (let i = 0; i < 6; i++) {
    const x = xs[i % 3], y = ys[Math.floor(i / 3)], hot = i === 1;
    b += `<g transform="translate(0 ${hot ? -12 : 0})">` + R(x, y, 216, 252, 28, '#fff', 'filter="url(#sh)"' + (hot ? ' ' + S('#f05722', 4) : '')) + R(x + 20, y + 20, 176, 150, 20, tints[i]) + prod(i, x + 108, y + 98) +
      R(x + 22, y + 192, 118, 14, 7, '#13193b', A(.8)) + R(x + 22, y + 216, 64, 12, 6, '#f05722') + C(x + 180, y + 214, 15, 'none', S('#13193b', 2.5, .25)) +
      (hot ? R(x + 12, y - 14, 118, 32, 16, '#13193b') + T(x + 71, y + 8, 'Sponsored', 16, '#fff', 'text-anchor="middle"') : '') + '</g>';
  }
  b += '<g transform="rotate(-14 230 560)">' + P('M120 470 H300 L350 560 L300 650 H120 Q96 650 96 626 V494 Q96 470 120 470Z', '#f05722', '', 'filter="url(#sh)"') + C(318, 560, 12, '#fff', A(.9)) + R(130, 520, 120, 16, 8, '#fff', A(.9)) + R(130, 552, 80, 14, 7, '#fff', A(.6)) + R(130, 584, 100, 14, 7, '#fff', A(.4)) + '</g>';
  ['#13193b', '#fff', '#fff', '#fff'].forEach((f, i) => {
    const y = 330 + i * 72, w = f === '#fff';
    b += R(1270, y, 230, 52, 26, f, (w ? A(.8) + ' ' : '') + 'filter="url(#sh2)"') + R(1296, y + 19, [110, 90, 120, 80][i], 14, 7, w ? '#13193b' : '#fff', A(w ? .35 : .85));
  });
  return doc(defs, b);
}

/* 05 — Entities & structured data: knowledge graph + JSON-LD (deep violet) */
function art5() {
  const defs = lin('bg', [[0, '#150f3d'], [.5, '#2a1b66'], [1, '#14123a']]) + glow('gC', '#f05722', .6) + glow('gB', '#7894ff', .4) +
    '<linearGradient id="core" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#f05722"/></linearGradient>' + SH;
  const cx = 800, cy = 540;
  let b = R(0, 0, W, H, 0, 'url(#bg)') + C(cx, cy, 480, 'url(#gC)') + C(1300, 160, 380, 'url(#gB)');
  b += C(cx, cy, 235, 'none', S('#fff', 2, .14) + ' stroke-dasharray="4 10"') + C(cx, cy, 405, 'none', S('#fff', 2, .1) + ' stroke-dasharray="4 12"');
  const cols = ['#7894ff', '#d875ff', '#5fe3d6', '#ffd84d', '#ff7773', '#8ee26b'];
  const r1 = cols.map((c, i) => { const a = (-90 + i * 60) * Math.PI / 180; return { x: cx + 235 * Math.cos(a), y: cy + 235 * Math.sin(a), c }; });
  const par = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 0];
  const r2 = par.map((p, i) => { const a = (-75 + i * 30) * Math.PI / 180; return { x: cx + 405 * Math.cos(a), y: cy + 405 * Math.sin(a), p, c: cols[p] }; });
  r1.forEach((o) => { b += L(cx, cy, o.x, o.y, '#fff', 3, 'stroke-opacity=".22"'); });
  r2.forEach((o) => { b += L(r1[o.p].x, r1[o.p].y, o.x, o.y, o.c, 2, 'stroke-opacity=".5"'); });
  r2.forEach((o) => { b += C(o.x, o.y, 24, '#1a1550', S(o.c, 4)) + C(o.x, o.y, 8, o.c); });
  const icon = (i, x, y, c) => [C(x, y, 14, c), R(x - 13, y - 13, 26, 26, 6, c), P(`M${x} ${y - 16} L${x + 16} ${y + 12} L${x - 16} ${y + 12}Z`, c), P(`M${x} ${y - 17} L${x + 17} ${y} L${x} ${y + 17} L${x - 17} ${y}Z`, c), C(x, y, 14, 'none', S(c, 6)), P(`M${x - 8} ${y - 15} H${x + 8} L${x + 17} ${y} L${x + 8} ${y + 15} H${x - 8} L${x - 17} ${y}Z`, c)][i];
  r1.forEach((o, i) => { b += C(o.x, o.y, 50, '#1b1654', S(o.c, 5)) + icon(i, o.x, o.y, o.c); });
  b += C(cx, cy, 78, 'url(#core)') + spark(cx, cy, 38, '#fff');
  ['Organization', 'Person', 'Service', 'Place', 'Topic'].forEach((t, i) => {
    const y = 300 + i * 90;
    b += R(110, y, 210, 46, 23, '#fff', A(.08) + ' ' + S('#fff', 2, .18)) + C(138, y + 23, 7, cols[i]) + T(160, y + 30, t, 19, '#fff', 'fill-opacity=".85"');
  });
  b += R(1290, 290, 260, 430, 26, '#0b0e26', S('#fff', 2, .12) + ' filter="url(#sh)"') + R(1314, 318, 100, 32, 16, '#f05722') + T(1364, 340, 'JSON-LD', 15, '#fff', 'text-anchor="middle"');
  const lc = ['#ff8a63', '#7894ff', '#5fe3d6', '#fff', '#ffd84d', '#d875ff', '#7894ff', '#ff8a63', '#fff', '#5fe3d6'];
  lc.forEach((c, i) => { b += R(1314 + (i % 4 === 0 ? 0 : 22), 380 + i * 29, [90, 150, 120, 80, 140, 110, 160, 100, 70, 130][i], 11, 5.5, c, A(c === '#fff' ? .3 : .85)); });
  return doc(defs, b);
}

/* 06 — Search analytics & performance: dashboard (navy) */
function art6() {
  const defs = lin('bg', [[0, '#0b0f26'], [.6, '#141a4a'], [1, '#1e1757']]) + glow('gO', '#f05722', .4) + glow('gM', '#2fe0b0', .28) +
    lin('fm', [[0, '#2fe0b0', .45], [1, '#2fe0b0', 0]], 0, 1) + lin('fo', [[0, '#f05722', .4], [1, '#f05722', 0]], 0, 1) + SH;
  let b = R(0, 0, W, H, 0, 'url(#bg)') + C(1250, 900, 520, 'url(#gO)') + C(300, 200, 480, 'url(#gM)');
  b += R(360, 250, 880, 560, 34, '#fff', A(.06) + ' ' + S('#fff', 2, .16));
  b += R(400, 285, 180, 18, 9, '#fff', A(.7)) + C(1040, 294, 7, '#2fe0b0') + R(1056, 288, 56, 12, 6, '#fff', A(.45)) + C(1130, 294, 7, '#f05722') + R(1146, 288, 56, 12, 6, '#fff', A(.45));
  [380, 460, 540, 620, 700].forEach((y) => { b += L(400, y, 1200, y, '#fff', 1.5, 'stroke-opacity=".1"'); });
  const pa = [[400, 640], [500, 600], [600, 620], [700, 540], [800, 560], [900, 470], [1000, 500], [1100, 420], [1200, 380]];
  const pb = [[400, 690], [500, 670], [600, 650], [700, 640], [800, 600], [900, 590], [1000, 560], [1100, 540], [1200, 500]];
  b += P(smooth(pa) + ' L1200 700 L400 700Z', 'url(#fm)') + P(smooth(pb) + ' L1200 700 L400 700Z', 'url(#fo)');
  b += P(smooth(pa), 'none', S('#2fe0b0', 5)) + P(smooth(pb), 'none', S('#f05722', 5));
  b += L(900, 350, 900, 700, '#fff', 2, 'stroke-opacity=".3" stroke-dasharray="5 7"');
  b += C(900, 470, 11, '#2fe0b0', 'stroke="#0b0f26" stroke-width="4"') + C(900, 590, 11, '#f05722', 'stroke="#0b0f26" stroke-width="4"');
  b += R(930, 330, 170, 92, 18, '#fff', A(.14) + ' ' + S('#fff', 2, .2)) + R(950, 354, 90, 12, 6, '#fff', A(.7)) + R(950, 380, 120, 12, 6, '#fff', A(.4));
  for (let i = 0; i < 9; i++) { b += R(398 + i * 100, 722, 36, 8, 4, '#fff', A(.22)); }
  [[.55, '#2fe0b0'], [.8, '#7894ff'], [.4, '#f05722'], [.9, '#d875ff']].forEach(([v, c], i) => { b += R(404 + i * 200, 754, 160, 12, 6, '#fff', A(.12)) + R(404 + i * 200, 754, 160 * v, 12, 6, c); });
  [300, 460, 620].forEach((y, i) => {
    b += R(90, y, 210, 130, 24, '#fff', A(.07) + ' ' + S('#fff', 2, .14)) + R(112, y + 26, 90, 12, 6, '#fff', A(.55)) + R(112, y + 54, 120, 26, 8, '#fff', A(.85));
    b += P(smooth([[112, y + 112], [146, y + 100], [180, y + 106], [214, y + 92], [270, y + 84]]), 'none', S(['#2fe0b0', '#f05722', '#7894ff'][i], 4));
  });
  const circ = 2 * Math.PI * 100; let off = 0;
  [[.42, '#f05722'], [.26, '#2fe0b0'], [.2, '#7894ff'], [.12, '#d875ff']].forEach(([f, c]) => {
    b += C(1410, 430, 100, 'none', S(c, 34) + ` stroke-dasharray="${n(circ * f - 6)} ${n(circ - circ * f + 6)}" stroke-dashoffset="${n(-off)}" transform="rotate(-90 1410 430)"`);
    off += circ * f;
  });
  b += T(1410, 438, 'channels', 17, '#fff', 'text-anchor="middle" fill-opacity=".6"');
  [60, 110, 80, 140, 100, 170, 130].forEach((h, i) => { b += R(1300 + i * 32, 850 - h, 20, h, 8, i % 2 ? '#7894ff' : '#2fe0b0', A(.8)); });
  return doc(defs, b);
}

[art1, art2, art3, art4, art5, art6].forEach((f, i) => {
  const file = path.join(OUT, `w${i + 1}.svg`);
  fs.writeFileSync(file, f());
  console.log(path.basename(file), (fs.statSync(file).size / 1024).toFixed(1) + ' KB');
});
