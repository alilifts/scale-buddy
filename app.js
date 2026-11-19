(function () {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const KEY = 'weighin.v1';
const LB = 2.20462262;
const NS = 'http://www.w3.org/2000/svg';

/* ---------- icons ---------- */
const IC = {
  person: '<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2"/>',
  report: '<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4V3h6v1M9 13l2 2 4-4"/>',
  book: '<path d="M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13C17 4 14 4.5 12 6zM12 6v13"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
  right: '<path d="M9 6l6 6-6 6"/>', left: '<path d="M15 6l-6 6 6 6"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', cards: '<rect x="4" y="4" width="16" height="7" rx="2"/><rect x="4" y="13" width="16" height="7" rx="2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  ruler: '<path d="M3 17l14-14 4 4L7 21zM8 12l2 2M11 9l2 2M14 6l2 2"/>',
  bell: '<path d="M6 17V11a6 6 0 1 1 12 0v6l2 2H4zM10 21h4"/>', lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16" cy="11" r="1"/>',
  sync: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 5a3 3 0 0 1 0 6M21 20v-1a5 5 0 0 0-3-4.5"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5M12 17h0"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h0"/>',
  dl: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>', ul: '<path d="M12 16V5M7 9l5-5 5 5M5 20h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', cal: '<rect x="4" y="5" width="16" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  filter: '<path d="M4 7h16M7 12h10M10 17h4"/>', cols: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M9.5 5v14M14.5 5v14"/>',
  share: '<path d="M12 15V4M8 8l4-4 4 4M6 12v7h12v-7"/>', flame: '<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>', mv: '<path d="M7 4v16M7 4L4 7M7 4l3 3M17 20V4M17 20l-3-3M17 20l3-3"/>'
};
const ic = (n, c = '') => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

/* ---------- data ---------- */
const CARD_IDS = ['stats', 'progress', 'trends', 'predict', 'chart', 'bmi', 'energy', 'streak'];
const DEF = { onboarded: false, objective: 'lose', start: null, startDate: null, goal: null, rate: 0.5, splitMode: 'equal', splitN: 10, track: 'trend',
  units: 'kg', remOn: false, remTime: '08:00', remSkip: true, remDays: [0, 1, 2, 3, 4, 5, 6], pin: null, theme: 'dark', accent: 'blue', loss: 'green', gain: 'red',
  twoDec: false, haptics: true, weekStart: 1, predMethod: 'smooth', rateMethod: 'smooth', rateWin: 14, height: null,
  cards: { order: CARD_IDS.slice(), hidden: ['bmi', 'energy', 'streak'] }, lbAsc: false, lbCols: ['rec', 'avg', 'rate', 'notes'] };
const newProfile = (id, name) => ({ id, name, entries: {}, set: JSON.parse(JSON.stringify(DEF)) });
let DB = load();
function load() {
  try { const j = JSON.parse(localStorage.getItem(KEY)); if (j && j.profiles && j.profiles.length) { j.profiles.forEach((p) => { p.set = Object.assign(JSON.parse(JSON.stringify(DEF)), p.set); CARD_IDS.forEach((id) => { if (!p.set.cards.order.includes(id)) p.set.cards.order.push(id); }); }); return j; } } catch (e) {}
  return { v: 1, active: 'p1', profiles: [newProfile('p1', 'Me')] };
}
let saveFailed = false;
function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { if (!saveFailed) { saveFailed = true; toast('Could not save. Storage is full or blocked.'); } } }
const P = () => DB.profiles.find((p) => p.id === DB.active) || DB.profiles[0];
const ST = () => P().set;

/* ---------- units / format ---------- */
const toU = (kg) => (ST().units === 'lb' ? kg * LB : kg);
const fromU = (v) => (ST().units === 'lb' ? v / LB : v);
const dec = () => (ST().twoDec ? 2 : 1);
const fw = (kg, d) => toU(kg).toFixed(d == null ? dec() : d);
const fd = (kg, d) => toU(Math.abs(kg)).toFixed(d == null ? dec() : d);
const U = () => ST().units;
const fdate = (d, o) => new Date(d * E.DAY).toLocaleDateString('en-US', Object.assign({ timeZone: 'UTC' }, o));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pnum = (s) => { const v = parseFloat(String(s).replace(',', '.')); return isFinite(v) ? v : null; };
const WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const when = (days) => (days === 0 ? 'today' : days === 1 ? 'tomorrow' : days < 60 ? `in ${days} days` : days < 700 ? `in ${Math.round(days / 30.4)} months` : `in ${(days / 365).toFixed(1)} years`);

/* ---------- theme ---------- */
const COL = { green: '#3fcf8e', red: '#f0596b', blue: '#2aa7f0', orange: '#f59e42', purple: '#b968ee', teal: '#2dd4bf', pink: '#f472b6', yellow: '#f5d442' };
function applyTheme() {
  const s = ST(), r = document.documentElement;
  r.dataset.theme = s.theme;
  r.style.setProperty('--ac', COL[s.accent] || COL.blue);
  r.style.setProperty('--loss', COL[s.loss] || COL.green);
  r.style.setProperty('--gain', COL[s.gain] || COL.red);
  const m = $('meta[name=theme-color]'); if (m) m.content = getComputedStyle(r).getPropertyValue('--bg').trim() || '#0e0d13';
}

/* ---------- state ---------- */
const S = { tab: 'summary', page: null, rep: 'month', repN: 10, range: 30, predMode: 'commit', predAll: false, predSortDate: true, locked: !!ST().pin };
const app = $('#app');
const vib = () => { if (ST().haptics && navigator.vibrate) navigator.vibrate(8); };
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }

/* ---------- calc ---------- */
function calc() {
  const p = P(), s = p.set, series = E.toSeries(p.entries), tr = E.trend(series, s.predMethod);
  const trR = s.rateMethod === s.predMethod ? tr : E.trend(series, s.rateMethod);
  const last = series[series.length - 1];
  const start = s.start != null ? s.start : (series[0] ? series[0].w : null);
  const c = { p, s, series, tr, trR, last, t: tr[tr.length - 1], start };
  c.R = { cur: E.rateWeek(series, trR, s.rateWin), ov: E.overallRate(series, trR) };
  c.ms = s.objective === 'maintain' || s.goal == null || start == null ? [] : E.milestones(start, s.goal, s.splitMode, s.splitN);
  return c;
}
function tracked(c) {
  if (!c.series.length) return null;
  if (c.s.track === 'latest') return c.last.w;
  if (c.s.track === 'low10') return Math.min(...c.series.filter((p) => p.d >= c.last.d - 9).map((p) => p.w));
  return c.t;
}

/* ---------- chart ---------- */
function niceStep(raw) { const e = Math.pow(10, Math.floor(Math.log10(raw))); const f = raw / e; return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * e; }
function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
window.__ch = {};
let chSeq = 0;
function chartSvg(c, o) {
  const s = c.s, W = 360, H = o.h || 220, mini = !!o.mini;
  const pl = mini ? 6 : 34, pr = mini ? 6 : 8, pt = 10, pb = mini ? 20 : 24;
  const pts = c.series.map((p, i) => ({ d: p.d, iso: p.iso, w: toU(p.w), t: toU(c.tr[i]), n: p.n })).filter((p) => p.d >= o.from && p.d <= o.to);
  if (!pts.length) return '<div class="empty">No entries in this range</div>';
  const goalOn = !mini && s.goal != null, goal = goalOn ? toU(s.goal) : null;
  const vals = []; pts.forEach((p) => vals.push(p.w, p.t)); if (goalOn) vals.push(goal);
  let lo = Math.min(...vals), hi = Math.max(...vals); const pd = (hi - lo) * 0.12 || 1; lo -= pd; hi += pd;
  const span = Math.max(1, o.to - o.from);
  const X = (d) => pl + (d - o.from) / span * (W - pl - pr), Y = (v) => pt + (hi - v) / (hi - lo) * (H - pt - pb);
  const id = 'c' + (++chSeq); let g = '';
  const base = pts[0].t, yb = Y(base);
  // week bands
  if (!mini && span <= 130) {
    for (let d = o.from; d <= o.to; d++) if (E.dow(d) === s.weekStart) { const w = Math.min(7, o.to - d); if (Math.floor((d - o.from) / 7) % 2 === 0 || true) { if ((E.dayNum(E.dayIso(d)) / 7 | 0) % 2 === 0) g += `<rect x="${X(d).toFixed(1)}" y="${pt}" width="${(X(d + w) - X(d)).toFixed(1)}" height="${H - pt - pb}" fill="var(--s2)" opacity=".55"/>`; } }
  }
  // grid + y labels
  if (!mini) { const st = niceStep((hi - lo) / 4); for (let v = Math.ceil(lo / st) * st; v <= hi; v += st) g += `<line x1="${pl}" x2="${W - pr}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="var(--line)" stroke-width=".6"/><text x="${pl - 5}" y="${(Y(v) + 4).toFixed(1)}" text-anchor="end">${+v.toFixed(2)}</text>`; }
  const tp = pts.map((p) => [X(p.d), Y(p.t)]);
  if (pts.length > 1) {
    const path = smoothPath(tp), area = `${path}L${tp[tp.length - 1][0].toFixed(1)},${yb.toFixed(1)}L${tp[0][0].toFixed(1)},${yb.toFixed(1)}Z`;
    g += `<clipPath id="${id}a"><rect x="0" y="0" width="${W}" height="${yb.toFixed(1)}"/></clipPath><clipPath id="${id}b"><rect x="0" y="${yb.toFixed(1)}" width="${W}" height="${H}"/></clipPath>`;
    g += `<path d="${area}" fill="var(--gain)" opacity=".28" clip-path="url(#${id}a)"/><path d="${area}" fill="var(--loss)" opacity=".28" clip-path="url(#${id}b)"/>`;
  }
  if (goalOn) { const gy = Y(goal); g += `<line x1="${pl}" x2="${W - pr}" y1="${gy.toFixed(1)}" y2="${gy.toFixed(1)}" stroke="var(--loss)" stroke-width="1.5" stroke-dasharray="5 4"/><text x="${W - pr}" y="${(gy - 5).toFixed(1)}" text-anchor="end" style="fill:var(--loss);font-weight:700;letter-spacing:.06em;font-size:10px">${s.objective === 'maintain' ? 'MAINTENANCE WEIGHT' : 'GOAL WEIGHT'}</text>`; }
  pts.forEach((p) => { const x = X(p.d), y1 = Y(p.t), y2 = Y(p.w); g += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${y1.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(--ac)" stroke-width="1.4" opacity=".7"/><circle cx="${x.toFixed(1)}" cy="${y2.toFixed(1)}" r="${mini ? 2.6 : 3.2}" fill="var(--ac)"/>`; });
  if (pts.length > 1) g += `<path d="${smoothPath(tp)}" fill="none" stroke="var(--ac)" stroke-width="3" stroke-linecap="round"/>`; else g += `<circle cx="${tp[0][0]}" cy="${tp[0][1]}" r="5" fill="var(--ac)"/>`;
  // x labels
  const n = mini ? Math.min(span + 1, 10) : 5;
  for (let i = 0; i < n; i++) {
    const d = mini ? o.from + i : Math.round(o.from + span * i / (n - 1)); if (d > o.to) continue;
    const lab = mini ? fdate(d, { weekday: 'narrow' }) : span > 400 ? fdate(d, { month: 'short', year: '2-digit' }) : span > 120 ? fdate(d, { month: 'short' }) : fdate(d, { month: 'short', day: 'numeric' });
    g += `<text x="${X(d).toFixed(1)}" y="${H - 5}" text-anchor="${!mini && i === 0 ? 'start' : !mini && i === n - 1 ? 'end' : 'middle'}">${lab}</text>`;
  }
  g += `<line class="cur" x1="0" x2="0" y1="${pt}" y2="${H - pb}" stroke="var(--tx)" stroke-width="1" opacity="0"/>`;
  window.__ch[id] = { pts, from: o.from, span, pl, pr, W };
  return `<svg class="chart" data-ch="${id}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Weight chart">${g}</svg>`;
}
function chartTouch(e) {
  const svg = e.target.closest('svg.chart'); if (!svg) return;
  const m = window.__ch[svg.dataset.ch]; if (!m) return;
  const r = svg.getBoundingClientRect(), vx = (e.clientX - r.left) / r.width * m.W;
  const d = m.from + (vx - m.pl) / (m.W - m.pl - m.pr) * m.span;
  let best = m.pts[0]; m.pts.forEach((p) => { if (Math.abs(p.d - d) < Math.abs(best.d - d)) best = p; });
  const x = m.pl + (best.d - m.from) / m.span * (m.W - m.pl - m.pr), cur = svg.querySelector('.cur');
  if (cur) { cur.setAttribute('x1', x); cur.setAttribute('x2', x); cur.setAttribute('opacity', '.5'); }
  const ro = svg.parentElement.querySelector('.readout');
  if (ro) ro.textContent = `${fdate(best.d, { weekday: 'short', month: 'short', day: 'numeric' })}: ${best.w.toFixed(dec())} ${U()} (trend ${best.t.toFixed(dec())})`;
}
document.addEventListener('pointerdown', chartTouch);
document.addEventListener('pointermove', (e) => { if (e.buttons || e.pointerType === 'touch') chartTouch(e); });

/* ---------- small UI parts ---------- */
const card = (title, body, acts) => `<section class="card"><div class="card-h"><h2>${title}</h2><div class="act">${acts || ''}</div></div>${body}</section>`;
const arrow = (v, thr) => (Math.abs(v) < (thr == null ? 0.05 : thr) ? '<span class="fl">—</span>' : v > 0 ? `<span class="up">${ic('up', 'a')}</span>` : `<span class="dn">${ic('down', 'a')}</span>`);
const chg = (v, label) => `<b>${arrow(v)} <span class="num">${Math.abs(v) < 0.05 ? '' : fd(v)}</span></b><span>${label}</span>`;
const row = (icon, label, val, a, v, sub) => `<button class="row" data-a="${a}" ${v != null ? `data-v="${esc(v)}"` : ''}>${icon ? ic(icon) : ''}<span class="l">${label}${sub ? `<small>${sub}</small>` : ''}</span>${val != null ? `<span class="v">${val}</span>` : ''}${ic('right', 'chev')}</button>`;
const tgl = (label, on, a, sub) => `<button class="row" role="switch" aria-checked="${on}" data-a="${a}"><span class="l">${label}${sub ? `<small>${sub}</small>` : ''}</span><span class="tg ${on ? 'on' : ''}"></span></button>`;
const chk = (label, on, a, v, sub) => `<button class="row" data-a="${a}" data-v="${esc(v)}"><span class="l">${label}${sub ? `<small>${sub}</small>` : ''}</span>${on ? ic('check', 'check') : ''}</button>`;
const emptyHtml = '<div class="empty"><h2>No weigh-ins yet</h2><p>Tap the + button to log your first weight.</p></div>';

/* ---------- Summary ---------- */
const CARDS = {
  stats(c) {
    const today = E.todayNum(); let pts = c.series.map((p, i) => ({ ...p, t: c.tr[i] })).filter((p) => p.d > today - 10); if (pts.length < 2) pts = c.series.slice(-10).map((p) => ({ ...p, t: c.tr[c.series.indexOf(p)] }));
    const hi = pts.reduce((a, b) => (b.w > a.w ? b : a)), lo = pts.reduce((a, b) => (b.w < a.b ? b : a), pts[0]);
    const lo2 = pts.reduce((a, b) => (b.w < a.w ? b : a)), ago = (p) => { const n = c.last.d - p.d; return n === 0 ? 'latest' : `${n} day${n > 1 ? 's' : ''} ago`; };
    const from = pts[0].d, to = Math.max(pts[pts.length - 1].d, from + 6);
    return card('Recent Stats', `<div class="stats"><div>${chartSvg(c, { from, to, h: 330, mini: true })}</div><div class="tiles">
      <div class="tile t-hi"><span class="cap">High</span><b class="num">${fw(hi.w)}</b><small>${ago(hi)}</small></div>
      <div class="tile t-la"><span class="cap">Latest</span><b class="num">${fw(c.last.w)}</b><small>${fdate(c.last.d, { month: 'short', day: 'numeric' })}</small></div>
      <div class="tile t-tr"><span class="cap">Trend</span><b class="num">${fw(c.t)}</b></div>
      <div class="tile t-lo"><span class="cap">Low</span><b class="num">${fw(lo2.w)}</b><small>${ago(lo2)}</small></div></div></div>`);
  },
  progress(c) {
    const s = c.s, t = tracked(c), title = s.objective === 'maintain' ? 'Maintenance' : s.objective === 'gain' ? 'Weight Gain Progress' : 'Weight Loss Progress';
    if (s.goal == null) return card(title, `<div class="empty"><p>Set a goal weight to see your progress.</p><button class="btn" data-a="page" data-v="goals">Set my goal</button></div>`);
    if (s.objective === 'maintain') {
      const diff = t - s.goal;
      return card(title, `<div class="center"><div class="cap">Trend vs maintenance weight</div><div class="num" style="font-size:56px;font-weight:700;margin:6px 0">${fw(t)}</div><div class="mu">${Math.abs(diff) < 0.05 ? 'Right on target' : `${fd(diff)} ${U()} ${diff > 0 ? 'above' : 'below'} your ${fw(s.goal)} ${U()} target`}</div></div>`);
    }
    const p = E.progress(c.start, s.goal, c.ms, t); if (!p) return '';
    const C = 2 * Math.PI * 115, arc = C * 0.75, done = p.reached;
    const dots = c.ms.length <= 14 ? `<div class="dots">${c.ms.map((m, i) => `<span class="dot ${i < done ? 'on' : ''}"></span>${i < c.ms.length - 1 ? `<i class="${i < done - 1 ? 'on' : ''}"></i>` : ''}`).join('')}</div>` : '';
    return card(title, `<div class="gauge"><svg viewBox="0 0 300 250" aria-hidden="true"><g transform="rotate(135 150 140)"><circle cx="150" cy="140" r="115" fill="none" stroke="var(--s3)" stroke-width="22" stroke-linecap="round" stroke-dasharray="${arc} ${C}"/><circle cx="150" cy="140" r="115" fill="none" stroke="var(--prog)" stroke-width="22" stroke-linecap="round" stroke-dasharray="${Math.max(0.01, arc * p.pct)} ${C}"/></g></svg>
      <div class="mid"><span class="cap">${p.done ? 'Goal reached' : 'Milestone ' + (p.reached + 1)}</span><b class="num">${fw(p.next)}</b></div></div>
      <div class="gstats"><div><b class="num">${fw(t)}</b><span class="cap">Today</span></div><div><b class="num">${Math.round(p.pct * 100)}%</b><span class="cap">Complete</span></div><div><b class="num">${fd(p.toGo)}</b><span class="cap">To go</span></div></div>
      ${dots}<p class="center cap" style="margin-top:8px">${done} of ${c.ms.length} milestones completed</p><p class="center cap" style="margin-top:4px;color:var(--tx)">${(p.overall * 100).toFixed(1)}% complete overall</p>`);
  },
  trends(c) {
    const at = (n) => E.trendAt(c.series, c.tr, c.last.d - n), first = c.tr[0];
    const t = (n, lab) => { const v = c.t - (n ? at(n) : first); const small = Math.abs(v) < 0.05; return `<div class="${small ? '' : v < 0 ? 'l' : 'g'}"><b class="num">${fd(v)}</b><span>${small ? 'Steady' : v < 0 ? 'Lost' : 'Gained'} ${lab}</span></div>`; };
    return card('Weight Trends', `<div class="tt">${t(7, 'in 7 days')}${t(30, 'in 30 days')}${t(90, 'in 90 days')}${t(0, 'all time')}</div>`);
  },
  predict(c) {
    const s = c.s; if (s.objective === 'maintain') return '';
    if (s.goal == null) return card('Predictions', `<p class="mu">Set a goal weight to see predictions.</p>`);
    const t = tracked(c), dir = Math.sign(s.goal - c.start) || -1, R = c.R, m = S.predMode;
    const rate = m === 'commit' ? s.rate : m === 'cur' ? (R.cur != null && R.cur * dir > 0 ? Math.abs(R.cur) : 0) : (R.ov != null && R.ov * dir > 0 ? Math.abs(R.ov) : 0);
    const label = { commit: 'your commitment rate', cur: 'your current rate', ov: 'your overall rate' }[m];
    let rows = c.ms.filter((w) => dir * (w - t) < -1e-9 ? false : true).map((w, i, a) => ({ w, days: E.daysTo(t, w, rate, dir), tag: w === s.goal ? 'Goal weight' : 'Milestone' }));
    const nextW = rows.length ? rows[0].w : null; rows.forEach((r) => { if (r.w === nextW && r.tag !== 'Goal weight') r.tag = 'Next milestone'; });
    rows.sort((a, b) => (S.predSortDate ? (a.days == null) - (b.days == null) || dir * (b.w - a.w) * -1 : dir * (b.w - a.w)));
    const shown = S.predAll ? rows : rows.slice(0, 3);
    const rateTxt = (v) => (v == null ? '–' : fd(Math.abs(v), 2));
    return card('Predictions', `<div class="seg" role="tablist">${[['commit', 'Commitment', s.rate], ['cur', 'Current Rate', R.cur], ['ov', 'Overall Rate', R.ov]].map(([k, n, v]) => `<button data-a="pm" data-v="${k}" class="${m === k ? 'on' : ''}">${n}<b class="num">${k === 'commit' ? fd(v, 2) : rateTxt(v)}</b></button>`).join('')}</div>
      <p class="mu" style="margin-top:12px;font-size:14px">${rate ? `At ${label} of ${fd(rate, 2)} ${U()} per week, here's your forecast:` : `Your ${m === 'cur' ? 'current' : 'overall'} trend is not heading toward your goal, so there is no date to predict.`}</p>
      <table class="tbl"><thead><tr><th><button data-a="psort" class="mu">Weight ${S.predSortDate ? '↓' : '↑'}</button></th><th>Date</th></tr></thead><tbody>${shown.map((r) => `<tr><td><b class="num">${fw(r.w)} ${U()}</b><small>${r.tag}</small></td><td>${r.days == null ? '<span class="mu">–</span>' : `<b>${fdate(E.todayNum() + r.days, { month: 'long', day: 'numeric', year: r.days > 300 ? 'numeric' : undefined })}</b><small>${when(r.days)}</small>`}</td></tr>`).join('')}</tbody></table>
      ${rows.length > 3 ? `<button class="lnk" data-a="pall">${S.predAll ? 'Show less' : `Show all ${rows.length}`}</button>` : ''}`);
  },
  chart(c) {
    const to = Math.max(E.todayNum(), c.last.d), from = S.range ? to - S.range + 1 : c.series[0].d;
    return card('Weight Chart', `<div class="readout" aria-live="polite">Touch the chart for details</div>${chartSvg(c, { from, to: Math.max(to, from + 1), h: 240 })}
      <div class="rng">${[[7, '7 Days'], [30, '30 Days'], [90, '90 Days'], [365, '365 Days'], [0, 'All']].map(([v, n]) => `<button data-a="rng" data-v="${v}" class="${S.range === v ? 'on' : ''}">${n}</button>`).join('')}</div>`);
  },
  bmi(c) {
    const h = c.s.height; if (!h) return card('BMI', `<p class="mu">Add your height to see BMI.</p><button class="btn alt" data-a="askHeight">Add height</button>`);
    const b = E.bmi(c.t, h), cat = b < 18.5 ? 'Underweight' : b < 25 ? 'Healthy range' : b < 30 ? 'Overweight' : 'Obese';
    const pos = Math.min(100, Math.max(0, (b - 15) / 25 * 100));
    return card('BMI', `<div class="center"><div class="num" style="font-size:48px;font-weight:700">${b.toFixed(1)}</div><div class="mu">${cat} · based on trend weight and ${h} cm</div><div style="height:10px;border-radius:9px;margin:16px 4px 0;background:linear-gradient(90deg,#4aa8ff 0 14%,#3fcf8e 14% 40%,#f5b64a 40% 60%,#f0596b 60%);position:relative"><i style="position:absolute;left:${pos}%;top:-4px;width:4px;height:18px;border-radius:2px;background:var(--tx)"></i></div></div>`);
  },
  energy(c) {
    const r = c.R.cur; if (r == null) return card('Energy Balance', `<p class="mu">Log a few more days to estimate this.</p>`);
    const k = Math.round(E.kcalPerDay(r) / 10) * 10;
    return card('Energy Balance', `<div class="center"><div class="num" style="font-size:44px;font-weight:700">${Math.abs(k)} <span style="font-size:18px">kcal/day</span></div><div class="mu">Estimated ${k < 0 ? 'deficit' : 'surplus'} over the last ${c.s.rateWin} days (about 7,700 kcal per kg)</div></div>`);
  },
  streak(c) {
    const st = E.streak(c.series), n = c.series.length, days = c.last.d - c.series[0].d + 1;
    return card('Consistency', `<div class="tt" style="grid-template-columns:repeat(3,1fr)"><div><b class="num">${st.cur}</b><span>Day streak</span></div><div><b class="num">${st.best}</b><span>Best streak</span></div><div><b class="num">${Math.round(n / days * 100)}%</b><span>Days logged</span></div></div>`);
  }
};
function vSummary(c) {
  const hid = c.s.cards.hidden, list = c.s.cards.order.filter((id) => !hid.includes(id));
  return `<div class="top"><h1>Summary</h1><button class="pill" data-a="manage" aria-label="Choose and reorder cards">${ic('cards')}</button></div>${c.series.length ? list.map((id) => CARDS[id](c)).join('') : emptyHtml}${hid.length ? `<p class="center mu" style="font-size:13px">${hid.length} card${hid.length > 1 ? 's' : ''} hidden</p>` : ''}`;
}

/* ---------- Reports ---------- */
function vReports(c) {
  const kinds = [['week', 'Weekly'], ['month', 'Monthly'], ['year', 'Yearly']];
  let h = `<div class="top"><h1>Reports</h1></div><div class="seg" style="margin-bottom:14px">${kinds.map(([k, n]) => `<button data-a="rep" data-v="${k}" class="${S.rep === k ? 'on' : ''}">${n}</button>`).join('')}</div>`;
  if (!c.series.length) return h + emptyHtml;
  const reps = E.reports(c.series, c.tr, S.rep, c.s.weekStart), more = reps.length > S.repN;
  h += reps.slice(0, S.repN).map((r) => {
    const title = S.rep === 'month' ? fdate(r.s, { month: 'long', year: 'numeric' }) : S.rep === 'year' ? fdate(r.s, { year: 'numeric' }) : `${fdate(r.s, { month: 'short', day: 'numeric' })} – ${fdate(r.e, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    const to = Math.min(r.e, Math.max(E.todayNum(), r.s + 1)) === r.e ? r.e : Math.max(c.last.d, r.s + 1), n = r.span;
    return card(title, `<div class="rep-stats">
      <div><b class="num">${fw(r.low.w)} ${U()}</b><span>Low weigh-in · ${fdate(r.low.d, { month: 'short', day: 'numeric' })}</span></div>
      <div>${r.lowDelta == null ? '<b class="fl">—</b>' : chg(r.lowDelta, 'vs last ' + S.rep)}</div>
      <div>${chg(r.tWeek, 'Trend per week')}</div><div>${chg(r.tChange, `Trend change in ${n} day${n > 1 ? 's' : ''}`)}</div>
      <div><b class="num">${fw(r.avg)} ${U()}</b><span>Average</span></div><div><b class="num">${r.count}</b><span>Weigh-ins${r.notes ? ` · ${r.notes} note${r.notes > 1 ? 's' : ''}` : ''}</span></div></div>
      <div class="cap" style="display:flex;justify-content:space-between;margin-bottom:4px"><span>${fdate(r.s, { month: 'short', day: 'numeric', year: 'numeric' })}</span><span>${fdate(r.e, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>${chartSvg(c, { from: r.s, to: S.rep === 'year' || r.e <= c.last.d ? r.e : Math.max(r.e, to), h: 170 })}`,
    `<button class="ib" data-a="shareRep" data-v="${r.key}" aria-label="Share report">${ic('share')}</button>`);
  }).join('');
  return h + (more ? `<button class="btn alt" data-a="repMore">Show more</button>` : '');
}

/* ---------- Logbook ---------- */
function vLog(c) {
  const cols = c.s.lbCols, rows = E.logRows(c.series, c.tr, c.s.rateWin);
  let h = `<div class="top"><h1>Logbook</h1><div style="display:flex;gap:8px"><button class="pill" data-a="lbsort" aria-label="Sort order">${ic('filter')}</button><button class="pill" data-a="lbcols" aria-label="Choose columns">${ic('cols')}</button></div></div>`;
  if (!rows.length) return h + emptyHtml;
  const by = new Map(); rows.forEach((r) => { const k = r.iso.slice(0, 7); if (!by.has(k)) by.set(k, []); by.get(k).push(r); });
  let keys = [...by.keys()].sort(); if (!c.s.lbAsc) keys.reverse();
  return h + keys.map((k) => {
    let rs = by.get(k).slice(); if (!c.s.lbAsc) rs.reverse();
    const th = `<tr><th>Date</th>${cols.includes('rec') ? '<th>Recorded</th>' : ''}${cols.includes('avg') ? '<th>Moving<br>Average</th>' : ''}${cols.includes('rate') ? '<th>Weekly<br>Rate</th>' : ''}${cols.includes('notes') ? '<th>Notes</th>' : ''}</tr>`;
    const body = rs.map((r) => `<tr data-a="edit" data-v="${r.iso}"><td class="d"><b class="num">${r.iso.slice(8)}</b><span>${fdate(r.d, { weekday: 'short' })}</span></td>${cols.includes('rec') ? `<td class="num">${fw(r.w)}</td>` : ''}${cols.includes('avg') ? `<td class="num">${fw(r.t)}</td>` : ''}${cols.includes('rate') ? `<td>${r.rate == null || Math.abs(r.rate) < 0.05 ? '' : `<span class="badge ${r.rate < 0 ? 'l' : 'g'}">${ic(r.rate < 0 ? 'down' : 'up')}${fd(r.rate)}</span>`}</td>` : ''}${cols.includes('notes') ? `<td class="note">${esc(r.n)}</td>` : ''}</tr>`).join('');
    return card(fdate(E.dayNum(k + '-01'), { month: 'long', year: 'numeric' }), `<table class="lb"><thead>${th}</thead><tbody>${body}</tbody></table>`);
  }).join('');
}

/* ---------- Settings ---------- */
function setGroup(rows) { return `<div class="group">${rows.join('')}</div>`; }
function vSettings(c) {
  const s = c.s;
  if (S.page) return vPage(c);
  return `<div class="top"><h1>Settings</h1></div>
  <div class="card" style="background:linear-gradient(135deg,color-mix(in srgb,var(--ac) 30%,var(--s1)),var(--s1))"><h2 style="font-size:19px">Everything is unlocked</h2><p class="mu" style="margin-top:4px">Notes, weekly and yearly reports, all prediction methods, export and every setting are free. Always.</p></div>
  ${setGroup([row('target', 'Weight Goals', null, 'page', 'goals'), row('ruler', 'Weight Units', s.units === 'kg' ? 'Kilograms' : 'Pounds', 'page', 'units'), row('bell', 'Weigh-In Reminder', s.remOn ? s.remTime : 'Off', 'page', 'reminder'), row('lock', 'Passcode Protection', s.pin ? 'On' : 'Off', 'page', 'pin'), row('palette', 'Appearance', null, 'page', 'look'), row('sync', 'Backup, Sync & Export', null, 'page', 'sync'), row('sliders', 'Calculation Methods', null, 'page', 'calc'), row('users', 'User Profiles', esc(c.p.name), 'page', 'profiles')])}
  ${setGroup([row('help', 'Help & Support', null, 'page', 'help'), row('info', 'About This App', null, 'page', 'about')])}`;
}
const back = (t) => `<div class="top"><button class="back" data-a="page" data-v="" aria-label="Back">${ic('left')}</button><h1>${t}</h1></div>`;
function pick(title, opts, cur, cb) { showSheet(title, () => opts.map(([v, l, sub]) => chk(l, v === cur, 'shpick', v, sub)).join(''), { pick: cb }); }
function vPage(c) {
  const s = c.s, pg = S.page; let b = '';
  const unitLabel = U();
  if (pg === 'goals') {
    const o = { lose: 'Lose weight', gain: 'Gain weight', maintain: 'Maintain weight' }[s.objective];
    b = back('Weight Goals') + setGroup([row(null, 'My objective', o, 'g-obj'), row(null, s.objective === 'maintain' ? 'Maintenance started' : 'Starting point', c.start != null ? `${fw(c.start)} ${unitLabel}` : 'Set', 'g-start', null, s.startDate ? fdate(E.dayNum(s.startDate), { month: 'short', day: 'numeric', year: 'numeric' }) : ''), row(null, s.objective === 'maintain' ? 'Maintenance weight' : 'My goal weight', s.goal != null ? `${fw(s.goal)} ${unitLabel}` : 'Set', 'g-goal'),
      ...(s.objective === 'maintain' ? [] : [row(null, `I commit to ${s.objective} (per week)`, `${fd(s.rate, 2)} ${unitLabel}`, 'g-rate'), row(null, 'Split my goal into', s.splitMode === 'none' ? 'One goal' : s.splitMode === 'round' ? 'Round numbers' : `${s.splitN} equal segments`, 'g-split')])]) +
      `<div class="glabel">Progress tracking</div>` + setGroup([row(null, 'Track using', { trend: 'Moving average', low10: '10-day low', latest: 'Latest weight' }[s.track], 'g-track')]);
  } else if (pg === 'units') {
    b = back('Weight Units') + setGroup([chk('Kilograms (kg)', s.units === 'kg', 'unit', 'kg'), chk('Pounds (lb)', s.units === 'lb', 'unit', 'lb')]) + `<p class="hint">Your data is stored in kilograms and converted for display, so you can switch any time without losing precision.</p>`;
  } else if (pg === 'reminder') {
    b = back('Weigh-In Reminder') + setGroup([tgl('Enable weigh-in reminder', s.remOn, 'rem-on'), tgl('Skip if weight already entered', s.remSkip, 'rem-skip')]) +
      `<div class="glabel">Schedule</div>` + setGroup([chk('Every day', s.remDays.length === 7, 'rem-days', 'all'), chk('Weekdays only', s.remDays.join() === '1,2,3,4,5', 'rem-days', 'wk'), row(null, 'Time', `<input type="time" id="remtime" value="${s.remTime}" style="background:none;border:0;color:inherit;font:inherit;font-weight:600">`, 'noop')]) +
      `<div class="glabel">Step 1 · Works even when the app is closed</div>` + setGroup([row('cal', 'Add the daily alarm to my Calendar', null, 'rem-ics', null, 'iPhone and Android. Choose Calendar in the share sheet, tap Add. Your phone then rings at the time above, with no server and no internet needed.')]) +
      `<div class="glabel">Step 2 · Optional extras while the app is open</div>` + setGroup([row('bell', 'Allow notifications', typeof Notification === 'undefined' ? 'Not supported' : Notification.permission, 'rem-perm', null, 'Pops up a banner if the app is open or recently used.'), row('bell', 'Send a test reminder now', null, 'rem-test')]) +
      `<p class="hint">If you change the time or days, add the Calendar alarm again and delete the old one. Phones only let an app ring by itself through a server; this app has none, so your data never leaves your phone.</p>`;
  } else if (pg === 'pin') {
    b = back('Passcode Protection') + setGroup([tgl('Require a 4-digit passcode', !!s.pin, 'pin-toggle')]) + `<p class="hint">The passcode locks the app on this device when you open it. It cannot be recovered if forgotten. Export a backup first.</p>`;
  } else if (pg === 'look') {
    const sw = (key) => `<div class="sw" role="radiogroup">${Object.entries(COL).map(([n, v]) => `<button data-a="col" data-v="${key}:${n}" class="${s[key] === n ? 'on' : ''}" style="background:${v}" aria-label="${n}" role="radio" aria-checked="${s[key] === n}"></button>`).join('')}</div>`;
    b = back('Appearance') + setGroup([chk('Dark', s.theme === 'dark', 'theme', 'dark'), chk('Light', s.theme === 'light', 'theme', 'light'), chk('Match my phone', s.theme === 'auto', 'theme', 'auto')]) +
      `<div class="glabel">Accent color</div><div class="group" style="padding:8px 16px">${sw('accent')}</div><div class="glabel">Color for losing weight</div><div class="group" style="padding:8px 16px">${sw('loss')}</div><div class="glabel">Color for gaining weight</div><div class="group" style="padding:8px 16px">${sw('gain')}</div>` +
      setGroup([tgl('Show two decimal places', s.twoDec, 'twodec'), tgl('Haptic feedback (Android)', s.haptics, 'haptics')]);
  } else if (pg === 'sync') {
    b = back('Backup, Sync & Export') + `<div class="glabel">Move to another device</div>` + setGroup([row('ul', 'Save a full backup', null, 'bk-save', null, 'One file with everything: entries, notes, settings, profiles.'), row('dl', 'Restore from a backup', null, 'bk-load')]) +
      `<p class="hint">Your data lives only on this phone. To use the same data on a new phone or keep a safety copy, save a backup and open it on the other device (AirDrop, WhatsApp or email it to yourself).</p><div class="glabel">Spreadsheet</div>` + setGroup([row('ul', 'Export weights as CSV', null, 'csv-out'), row('dl', 'Import weights from CSV', null, 'csv-in', null, 'Columns: date, weight (kg), notes. Works with Happy Scale exports.')]) +
      `<div class="glabel">Danger zone</div>` + setGroup([row('trash', 'Load sample data to try the app', null, 'demo'), `<button class="row dan" data-a="wipe">${ic('trash')}<span class="l">Delete all data for this profile</span></button>`]) + '<input type="file" id="fileIn" hidden>';
  } else if (pg === 'calc') {
    const M = { smooth: 'Smoothed (recommended)', exp: 'Exponential', dexp: 'Double exponential', ma7: '7-day moving average' };
    b = back('Calculation Methods') + setGroup([row(null, 'First day of week', WD[s.weekStart], 'c-week'), row(null, 'How to predict my weight', M[s.predMethod], 'c-pred'), row(null, 'How to calculate rate of change', M[s.rateMethod], 'c-rate'), row(null, 'Rate looks back over', `${s.rateWin} days`, 'c-win')]) +
      `<p class="hint">Your trend weight smooths out daily water and food noise. Smoothed is the default: it reacts steadily to real change and shrugs off one-day spikes. Change it any time and every screen updates.</p>`;
  } else if (pg === 'profiles') {
    b = back('User Profiles') + `<div class="glabel">This profile</div>` + setGroup([row(null, 'Name', esc(c.p.name), 'pf-name'), row(null, 'Height', s.height ? s.height + ' cm' : 'Add', 'askHeight')]) +
      (DB.profiles.length > 1 ? `<div class="glabel">Switch profile</div>` + setGroup(DB.profiles.map((p) => chk(esc(p.name), p.id === DB.active, 'pf-switch', p.id))) : '') +
      `<div class="glabel">Multi-profile mode</div>` + setGroup([row('plus', 'Create a new profile', null, 'pf-new'), ...(DB.profiles.length > 1 ? [`<button class="row dan" data-a="pf-del"><span class="l">Delete this profile</span></button>`] : [])]) + `<p class="hint">Profiles share this phone only. Your brother just installs the app on his own phone and gets his own private data.</p>`;
  } else if (pg === 'help') {
    b = back('Help & Support') + `<div class="card"><h2>How should I pick a method?</h2><p class="mu" style="margin-top:8px"><b style="color:var(--ac)">Smoothed</b> is best for most people. It follows real change and ignores one-off spikes. <b style="color:var(--ac)">7-day moving average</b> is the simplest but lags and can be jumpy. <b style="color:var(--ac)">Exponential</b> reacts faster. <b style="color:var(--ac)">Double exponential</b> follows direction quickly but can overshoot.</p></div><div class="card"><h2>Install on your phone</h2><p class="mu" style="margin-top:8px">iPhone: open the link in Safari, tap Share, then Add to Home Screen. Android: open in Chrome, tap the menu, then Install app.</p></div><div class="card"><h2>What is the trend?</h2><p class="mu" style="margin-top:8px">Your weight swings a kilo or more day to day from water, salt and food. The trend line averages that out so you can see the real direction. Weekly rate is how fast the trend line moved over your chosen look-back window.</p></div>`;
  } else if (pg === 'about') {
    b = back('About') + `<div class="card"><h2>Scale Buddy</h2><p class="mu" style="margin-top:8px">A private weight tracker. Everything runs on your phone. No account, no ads, no subscriptions, no tracking, nothing is sent anywhere. Version 1.0.</p><p class="mu" style="margin-top:8px">Total entries on this profile: ${c.series.length}.</p></div>`;
  }
  return `<div class="sub">${b}</div>`;
}

/* ---------- render ---------- */
function render() {
  applyTheme();
  const c = calc(), s = c.s; let h;
  if (S.locked) { renderLock(); return; }
  if (!s.onboarded) { renderWelcome(); return; }
  h = S.tab === 'summary' ? vSummary(c) : S.tab === 'reports' ? vReports(c) : S.tab === 'log' ? vLog(c) : vSettings(c);
  const y = window.scrollY;
  app.innerHTML = `<main class="screen">${h}</main><nav class="dock"><div class="dock-in"><div class="tabs" role="tablist">${[['summary', 'person', 'Summary'], ['reports', 'report', 'Reports'], ['log', 'book', 'Logbook'], ['settings', 'gear', 'Settings']].map(([k, i, n]) => `<button class="tab ${S.tab === k ? 'on' : ''}" role="tab" aria-selected="${S.tab === k}" data-a="tab" data-v="${k}">${ic(i)}${n}</button>`).join('')}</div><button class="fab" data-a="add" aria-label="Log my weight">${ic('plus')}</button></div></nav>`;
  window.scrollTo(0, y);
}
function renderWelcome() {
  const s = ST();
  app.innerHTML = `<main class="screen welcome"><h1>Scale Buddy</h1><p class="mu" style="margin-bottom:22px">Track your weight, see the real trend, and know when you'll hit your goal. Everything stays on your phone. Nothing is locked.</p>
  <div class="field"><label for="w-name">Your name</label><input id="w-name" value="${esc(P().name === 'Me' ? '' : P().name)}" placeholder="Optional" autocomplete="given-name"></div>
  <div class="field"><label for="w-units">Units</label><select id="w-units"><option value="kg">Kilograms</option><option value="lb">Pounds</option></select></div>
  <div class="field"><label for="w-obj">I want to</label><select id="w-obj"><option value="lose">Lose weight</option><option value="gain">Gain weight</option><option value="maintain">Maintain weight</option></select></div>
  <div class="field"><label for="w-cur">Current weight</label><input id="w-cur" inputmode="decimal" placeholder="e.g. 76.0"></div>
  <div class="field"><label for="w-goal">Goal weight</label><input id="w-goal" inputmode="decimal" placeholder="e.g. 70.0"></div>
  <div class="field"><label for="w-rate">Weekly pace (kg or lb)</label><input id="w-rate" inputmode="decimal" value="0.5"></div><p class="hint" id="w-err" role="alert" style="color:var(--gain)"></p>
  <button class="btn" data-a="start">Get started</button><button class="btn dan" data-a="skipwelcome">Skip, I'll set up later</button></main>`;
}
function renderLock(msg) {
  let buf = '';
  app.innerHTML = `<div class="lock"><h2>Enter passcode</h2><div class="pdots">${[0, 1, 2, 3].map(() => '<i></i>').join('')}</div><p class="mu" id="lk">${msg || ''}</p><div class="pin">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((k) => `<button ${k === '' ? 'style="visibility:hidden"' : ''} data-k="${k}">${k}</button>`).join('')}</div></div>`;
  app.querySelector('.pin').onclick = async (e) => {
    const k = e.target.closest('button')?.dataset.k; if (k == null) return;
    if (k === '⌫') buf = buf.slice(0, -1); else if (buf.length < 4) buf += k;
    app.querySelectorAll('.pdots i').forEach((d, i) => d.classList.toggle('on', i < buf.length));
    if (buf.length === 4) { if (await sha(buf) === ST().pin) { S.locked = false; render(); } else { buf = ''; app.querySelectorAll('.pdots i').forEach((d) => d.classList.remove('on')); $('#lk').textContent = 'Wrong passcode'; } }
  };
}
async function sha(t) { try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('wi:' + t)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join(''); } catch (e) { return 'p:' + t; } }

/* ---------- sheets ---------- */
let SH = null;
function showSheet(title, bodyFn, o) {
  closeSheet(); SH = { bodyFn, o: o || {} };
  const ov = document.createElement('div'); ov.className = 'ov'; ov.id = 'ov';
  ov.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="sheet-h"><button class="ib" data-a="closeSheet" aria-label="Close">${ic('x')}</button><h3>${esc(title)}</h3><span style="width:44px"></span></div><div id="shb">${bodyFn()}</div></div>`;
  ov.addEventListener('click', (e) => { if (e.target === ov) closeSheet(); });
  document.body.appendChild(ov); if (SH.o.mount) SH.o.mount();
}
const refreshSheet = () => { if (SH) { $('#shb').innerHTML = SH.bodyFn(); if (SH.o.mount) SH.o.mount(); } };
function closeSheet() { const o = $('#ov'); if (o) o.remove(); SH = null; }
function ask(title, label, val, suffix, cb) {
  showSheet(title, () => `<div class="field"><label for="ask-i">${label}</label><input id="ask-i" inputmode="decimal" value="${val == null ? '' : val}" ${suffix ? `aria-label="${label} in ${suffix}"` : ''}><span class="mu">${suffix || ''}</span></div><button class="btn" data-a="ask-ok">Save</button>`, { mount() { const i = $('#ask-i'); i.focus(); i.select(); i.onkeydown = (e) => { if (e.key === 'Enter') $('[data-a=ask-ok]').click(); }; }, ok() { const v = pnum($('#ask-i').value); if (v == null) { toast('Enter a number'); return; } closeSheet(); cb(v); } });
}

/* log sheet */
function openLog(iso) {
  const s = ST(); let cur = iso || E.todayIso(); const maxIso = E.todayIso();
  const entries = () => P().entries;
  showSheet('Log My Weight', () => {
    const e = entries()[cur], last = E.toSeries(entries()).filter((p) => p.iso <= cur).pop() || E.toSeries(entries()).pop();
    const v = e ? toU(e.w).toFixed(dec()) : '';
    return `<div class="dnav"><button data-a="lg-prev" aria-label="Previous day">${ic('left')}</button><label style="position:relative"><b data-a="lg-pick">${fdate(E.dayNum(cur), { month: 'short', day: 'numeric', year: 'numeric' })}</b><input type="date" id="lg-date" value="${cur}" max="${maxIso}"></label><button data-a="lg-next" aria-label="Next day" ${cur >= maxIso ? 'disabled' : ''}>${ic('right')}</button></div>
    <div class="field"><label for="lg-w">Weight</label><input id="lg-w" inputmode="decimal" value="${v}" placeholder="${last ? toU(last.w).toFixed(dec()) : '0.0'}"><span class="mu">${U()}</span></div>
    <div class="nudge"><button data-a="lg-n" data-v="-0.5">−0.5</button><button data-a="lg-n" data-v="-0.1">−0.1</button><button data-a="lg-n" data-v="0.1">+0.1</button><button data-a="lg-n" data-v="0.5">+0.5</button></div>
    <div class="field col"><label for="lg-note">Notes</label><textarea id="lg-note" placeholder="How was today? Meals, sleep, workout…">${esc(e ? e.n : '')}</textarea></div>
    <div id="lg-more">${S.more || s.height ? '' : '<button class="lnk" data-a="lg-more">More…</button>'}${S.more ? `<div class="field"><label for="lg-h">Height</label><input id="lg-h" inputmode="decimal" value="${s.height || ''}"><span class="mu">cm</span></div>` : ''}</div>
    <button class="btn" data-a="lg-save">${e ? 'Update Entry' : 'Add Entry'}</button>${e ? '<button class="btn dan" data-a="lg-del">Delete entry</button>' : ''}`;
  }, { mount() {
    const w = $('#lg-w'); if (w && !w.value && !S.noFocus) w.focus();
    const dp = $('#lg-date'); if (dp) dp.onchange = () => { if (dp.value && dp.value <= maxIso) { cur = dp.value; refreshSheet(); } };
  }, lg: { get cur() { return cur; }, set cur(v) { cur = v; }, maxIso } });
  S.more = false;
}

/* ---------- actions ---------- */
function lgRead() { return { w: pnum($('#lg-w').value), n: $('#lg-note').value.trim(), h: $('#lg-h') ? pnum($('#lg-h').value) : null }; }
const shift = (iso, n) => E.dayIso(E.dayNum(iso) + n);
function doneSet() { save(); render(); }
const A = {
  tab(v) { S.tab = v; S.page = null; render(); window.scrollTo(0, 0); },
  add() { openLog(); }, edit(v) { openLog(v); }, closeSheet,
  page(v) { S.page = v || null; render(); window.scrollTo(0, 0); },
  pm(v) { S.predMode = v; render(); }, psort() { S.predSortDate = !S.predSortDate; render(); }, pall() { S.predAll = !S.predAll; render(); },
  rng(v) { S.range = +v; render(); }, rep(v) { S.rep = v; S.repN = 10; render(); }, repMore() { S.repN += 12; render(); },
  noop() {},
  'ask-ok'() { SH && SH.o.ok && SH.o.ok(); },
  shpick(v) { const cb = SH && SH.o.pick; closeSheet(); if (cb) cb(v); },
  'lg-prev'() { const l = SH.o.lg; const d = lgRead(); l.cur = shift(l.cur, -1); refreshSheet(); },
  'lg-next'() { const l = SH.o.lg; if (l.cur < l.maxIso) { l.cur = shift(l.cur, 1); refreshSheet(); } },
  'lg-pick'() { const d = $('#lg-date'); try { d.showPicker(); } catch (e) { d.focus(); d.click(); } },
  'lg-n'(v) { const i = $('#lg-w'); let x = pnum(i.value); if (x == null) { const l = E.toSeries(P().entries).pop(); x = l ? toU(l.w) : toU(70); } i.value = (x + +v).toFixed(dec()); },
  'lg-more'() { S.more = true; const w = lgRead(); refreshSheet(); $('#lg-w').value = w.w == null ? '' : w.w; $('#lg-note').value = w.n; },
  'lg-save'() {
    const l = SH.o.lg, r = lgRead(); if (r.w == null || r.w <= 0) { toast('Enter your weight'); return; }
    const kg = fromU(r.w); if (kg < 20 || kg > 400) { toast('That weight looks off. Check the number and unit.'); return; }
    const p = P(), s = p.set, had = !!p.entries[l.cur];
    p.entries[l.cur] = { w: kg, n: r.n }; if (r.h && r.h > 50 && r.h < 260) s.height = r.h;
    if (s.start == null) { s.start = kg; s.startDate = l.cur; }
    save(); closeSheet(); vib(); render(); toast(had ? 'Entry updated' : 'Entry saved');
  },
  'lg-del'() { const l = SH.o.lg; if (confirm('Delete this entry?')) { delete P().entries[l.cur]; save(); closeSheet(); render(); } },
  manage() {
    showSheet('Summary Cards', () => { const s = ST(); const names = { stats: 'Recent Stats', progress: 'Progress', trends: 'Weight Trends', predict: 'Predictions', chart: 'Weight Chart', bmi: 'BMI', energy: 'Energy Balance', streak: 'Consistency' };
      return s.cards.order.map((id, i) => `<div class="row"><span class="l">${names[id]}</span><button class="ib" data-a="mv" data-v="${i}:-1" aria-label="Move up">${ic('up')}</button><button class="ib" data-a="mv" data-v="${i}:1" aria-label="Move down">${ic('down')}</button><button class="tg ${s.cards.hidden.includes(id) ? '' : 'on'}" data-a="cv" data-v="${id}" role="switch" aria-label="Show ${names[id]}"></button></div>`).join(''); });
  },
  mv(v) { const [i, d] = v.split(':').map(Number), o = ST().cards.order, j = i + d; if (j < 0 || j >= o.length) return; [o[i], o[j]] = [o[j], o[i]]; save(); refreshSheet(); render(); },
  cv(v) { const h = ST().cards.hidden, i = h.indexOf(v); if (i < 0) h.push(v); else h.splice(i, 1); save(); refreshSheet(); render(); },
  lbsort() { const s = ST(); s.lbAsc = !s.lbAsc; save(); render(); toast(s.lbAsc ? 'Oldest first' : 'Newest first'); },
  lbcols() { const all = [['rec', 'Recorded'], ['avg', 'Moving average'], ['rate', 'Weekly rate'], ['notes', 'Notes']]; showSheet('Columns', () => all.map(([k, n]) => tgl(n, ST().lbCols.includes(k), 'lbc:' + k)).join('')); },
  askHeight() { ask('Height', 'Height', ST().height, 'cm', (v) => { ST().height = v; doneSet(); }); },
  start() {
    const g = (id) => $(id).value, units = g('#w-units'), obj = g('#w-obj'), cur = pnum(g('#w-cur')), goal = pnum(g('#w-goal')), pace = pnum(g('#w-rate')) || 0.5, s = ST();
    const err = $('#w-err'); s.units = units; const kgOf = (v) => (units === 'lb' ? v / LB : v);
    if (cur == null || kgOf(cur) < 20 || kgOf(cur) > 400) { err.textContent = 'Enter your current weight.'; return; }
    if (obj !== 'maintain' && (goal == null || kgOf(goal) < 20 || kgOf(goal) > 400)) { err.textContent = 'Enter a goal weight.'; return; }
    if (obj === 'lose' && goal >= cur) { err.textContent = 'For losing weight, the goal must be lower than your current weight.'; return; }
    if (obj === 'gain' && goal <= cur) { err.textContent = 'For gaining weight, the goal must be higher than your current weight.'; return; }
    const nm = g('#w-name').trim(); if (nm) P().name = nm;
    s.objective = obj; s.start = kgOf(cur); s.startDate = E.todayIso(); s.goal = obj === 'maintain' ? kgOf(cur) : kgOf(goal); s.rate = Math.min(2, Math.max(0.05, kgOf(pace))); s.onboarded = true;
    P().entries[E.todayIso()] = { w: kgOf(cur), n: '' }; save(); render(); toast('All set. Log your weight each day.');
  },
  skipwelcome() { const s = ST(); s.onboarded = true; save(); render(); },
  /* goals */
  'g-obj'() { pick('My objective', [['lose', 'Lose weight'], ['gain', 'Gain weight'], ['maintain', 'Maintain weight']], ST().objective, (v) => { ST().objective = v; doneSet(); }); },
  'g-start'() { const s = ST(); ask(s.objective === 'maintain' ? 'Maintenance started at' : 'Starting weight', 'Weight', s.start != null ? fw(s.start) : '', U(), (v) => { s.start = fromU(v); if (!s.startDate) s.startDate = E.todayIso(); doneSet(); }); },
  'g-goal'() { const s = ST(); ask(s.objective === 'maintain' ? 'Maintenance weight' : 'Goal weight', 'Weight', s.goal != null ? fw(s.goal) : '', U(), (v) => { s.goal = fromU(v); doneSet(); }); },
  'g-rate'() { const s = ST(); ask('Weekly pace', 'Per week', fd(s.rate, 2), U() + '/wk', (v) => { s.rate = Math.min(fromU(5), Math.max(fromU(0.05), fromU(v))); doneSet(); }); },
  'g-track'() { pick('Track using', [['trend', 'Moving average weight'], ['low10', '10-day low weight'], ['latest', 'Latest weight']], ST().track, (v) => { ST().track = v; doneSet(); }); },
  'g-split'() {
    showSheet('Split my goal into', () => { const s = ST(), c = calc(); const ms = c.ms;
      return [['none', "Don't split it up", 'One big segment'], ['equal', 'Equal segments'], ['round', 'Round numbers']].map(([v, n, sub]) => chk(n, s.splitMode === v, 'sp-mode', v, sub)).join('') +
      (s.splitMode === 'equal' ? `<div class="row"><span class="l">Number of milestones</span><button class="ib" data-a="sp-n" data-v="-1" aria-label="Fewer">${ic('left')}</button><b class="num">${s.splitN}</b><button class="ib" data-a="sp-n" data-v="1" aria-label="More">${ic('right')}</button></div>` : '') +
      `<div class="glabel">Your milestone goals</div><div class="group"><div class="row"><span class="l">Start</span><span class="v num">${fw(c.start)}</span></div>${ms.map((m, i) => `<div class="row"><span class="l">${i === ms.length - 1 ? 'Goal' : 'Milestone ' + (i + 1)}</span><span class="v num">${fw(m)}</span></div>`).join('')}</div>`; });
  },
  'sp-mode'(v) { ST().splitMode = v; save(); refreshSheet(); render(); },
  'sp-n'(v) { const s = ST(); s.splitN = Math.min(40, Math.max(1, s.splitN + +v)); save(); refreshSheet(); render(); },
  unit(v) { ST().units = v; doneSet(); }, theme(v) { ST().theme = v; save(); render(); },
  col(v) { const [k, n] = v.split(':'); ST()[k] = n; save(); render(); }, twodec() { const s = ST(); s.twoDec = !s.twoDec; doneSet(); }, haptics() { const s = ST(); s.haptics = !s.haptics; doneSet(); },
  /* calc */
  'c-week'() { pick('First day of week', WD.map((d, i) => [String(i), d]), String(ST().weekStart), (v) => { ST().weekStart = +v; doneSet(); }); },
  'c-pred'() { pick('How to predict my weight', [['smooth', 'Smoothed', 'Recommended. Steady and resists spikes.'], ['dexp', 'Double exponential', 'Follows direction quickly. Can overshoot.'], ['exp', 'Exponential', 'Simple. Reacts faster, a bit noisier.'], ['ma7', '7-day moving average', 'Simple. Lags and can be jumpy.']], ST().predMethod, (v) => { ST().predMethod = v; doneSet(); }); },
  'c-rate'() { pick('How to calculate rate of change', [['smooth', 'Smoothed', 'Recommended.'], ['exp', 'Exponential', 'Good at following trends.'], ['dexp', 'Double exponential', 'Responsive. Can overshoot.'], ['ma7', '7-day moving average', 'Simple. Can be jumpy.']], ST().rateMethod, (v) => { ST().rateMethod = v; doneSet(); }); },
  'c-win'() { pick('Rate looks back over', [7, 14, 21, 28, 30].map((n) => [String(n), `Previous ${n} days`]), String(ST().rateWin), (v) => { ST().rateWin = +v; doneSet(); }); },
  /* reminder */
  'rem-on'() { const s = ST(); s.remOn = !s.remOn; if (s.remOn && typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission().then(render); doneSet(); },
  'rem-skip'() { const s = ST(); s.remSkip = !s.remSkip; doneSet(); },
  'rem-days'(v) { ST().remDays = v === 'all' ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5]; doneSet(); },
  'rem-perm'() { if (typeof Notification === 'undefined') { toast('Not supported in this browser. Use the calendar alarm.'); return; } Notification.requestPermission().then((r) => { render(); toast(r === 'granted' ? 'Notifications allowed' : 'Notifications not allowed'); }); },
  'rem-test'() { lastFired = ''; fireReminder(true); },
  'rem-ics'() {
    const s = ST(), [hh, mm] = s.remTime.split(':'), t = E.todayIso().replace(/-/g, '') + `T${hh}${mm}00`, days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const rule = s.remDays.length === 7 ? 'FREQ=DAILY' : `FREQ=WEEKLY;BYDAY=${s.remDays.map((d) => days[d]).join(',')}`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ScaleBuddy//EN', 'BEGIN:VEVENT', 'UID:scalebuddy-reminder-' + P().id + '@local', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''), 'DTSTART:' + t, 'RRULE:' + rule, 'DURATION:PT5M', 'SUMMARY:Log your weight (Scale Buddy)', 'DESCRIPTION:Log your weight in Scale Buddy', 'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:Time to log your weight', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    download('scale-buddy-reminder.ics', ics, 'text/calendar', true);
  },
  /* pin */
  'pin-toggle'() {
    const s = ST();
    if (s.pin) { if (confirm('Turn off passcode?')) { s.pin = null; doneSet(); } return; }
    let first = '', buf = '';
    showSheet('Set passcode', () => `<p class="center mu" id="pt">Choose 4 digits</p><div class="pdots" style="justify-content:center;margin:14px 0">${[0, 1, 2, 3].map(() => '<i></i>').join('')}</div><div class="pin" style="justify-content:center;margin:auto">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'].map((k) => `<button ${k === '' ? 'style="visibility:hidden"' : ''} data-k="${k}">${k}</button>`).join('')}</div>`, { mount() {
      $('#shb .pin').onclick = async (e) => { const k = e.target.closest('button')?.dataset.k; if (k == null) return; if (k === '⌫') buf = buf.slice(0, -1); else if (buf.length < 4) buf += k;
        document.querySelectorAll('#shb .pdots i').forEach((d, i) => d.classList.toggle('on', i < buf.length));
        if (buf.length === 4) { if (!first) { first = buf; buf = ''; $('#pt').textContent = 'Enter it again'; document.querySelectorAll('#shb .pdots i').forEach((d) => d.classList.remove('on')); } else if (buf === first) { s.pin = await sha(buf); closeSheet(); doneSet(); toast('Passcode set'); } else { first = ''; buf = ''; $('#pt').textContent = "Didn't match. Start again"; document.querySelectorAll('#shb .pdots i').forEach((d) => d.classList.remove('on')); } } };
    } });
  },
  /* profiles */
  'pf-name'() { const n = prompt('Profile name', P().name); if (n && n.trim()) { P().name = n.trim().slice(0, 30); doneSet(); } },
  'pf-new'() { const n = prompt('Name for the new profile'); if (n && n.trim()) { const id = 'p' + Date.now(); DB.profiles.push(newProfile(id, n.trim().slice(0, 30))); DB.active = id; S.page = null; S.tab = 'summary'; doneSet(); } },
  'pf-switch'(v) { DB.active = v; S.page = null; S.tab = 'summary'; doneSet(); },
  'pf-del'() { if (DB.profiles.length > 1 && confirm(`Delete profile "${P().name}" and all its data? This cannot be undone.`)) { DB.profiles = DB.profiles.filter((p) => p.id !== DB.active); DB.active = DB.profiles[0].id; S.page = null; doneSet(); } },
  /* data */
  'bk-save'() { download(`scale-buddy-backup-${E.todayIso()}.json`, JSON.stringify(DB), 'application/json', true); },
  'bk-load'() { fileIn('.json,application/json', (txt) => { try { const j = JSON.parse(txt); if (!j.profiles || !j.profiles.length) throw 0; if (!confirm(`Replace everything on this device with the backup (${j.profiles.length} profile(s))?`)) return; DB = j; DB.active = DB.profiles.some((p) => p.id === DB.active) ? DB.active : DB.profiles[0].id; DB = (localStorage.setItem(KEY, JSON.stringify(DB)), load()); S.locked = false; render(); toast('Backup restored'); } catch (e) { toast('That file is not a valid backup'); } }); },
  'csv-out'() { const rows = E.toSeries(P().entries).map((p) => `${p.iso},${p.w.toFixed(2)},"${(p.n || '').replace(/"/g, '""')}"`); download(`scale-buddy-${E.todayIso()}.csv`, 'Date,Weight (kg),Notes\n' + rows.join('\n'), 'text/csv'); },
  'csv-in'() { fileIn('.csv,text/csv,text/plain', (txt) => { let n = 0; const e = P().entries; const lb = /lb|pound/i.test(txt.split('\n')[0]); txt.split(/\r?\n/).forEach((ln) => { const m = ln.match(/^\s*"?([^",;]+)"?\s*[,;]\s*"?([\d.,]+)"?\s*(?:[,;]\s*(.*))?$/); if (!m) return; let d = m[1].trim(), iso; if (/^\d{4}-\d{2}-\d{2}/.test(d)) iso = d.slice(0, 10); else { const t = new Date(d); if (isNaN(t)) return; iso = `${t.getFullYear()}-${E.pad(t.getMonth() + 1)}-${E.pad(t.getDate())}`; } let w = pnum(m[2]); if (w == null) return; if (lb) w /= LB; if (w < 20 || w > 400) return; e[iso] = { w, n: (m[3] || '').replace(/^"|"$/g, '') }; n++; }); const s = ST(); if (n && s.start == null) { const f = E.toSeries(e)[0]; s.start = f.w; s.startDate = f.iso; } doneSet(); toast(`Imported ${n} entries`); }); },
  demo() {
    if (!confirm('Replace this profile with 120 days of sample data?')) return;
    const e = {}, s = ST(); let w = 77, seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647), notes = ['Late dinner', 'Gym day', 'Salty meal', 'Felt great', 'Travel day', 'Poor sleep'];
    for (let i = 119; i >= 0; i--) { if (rnd() < 0.12) continue; w -= 0.07 + (rnd() - 0.45) * 0.05; const v = w + (rnd() - 0.5) * 1.6; e[E.dayIso(E.todayNum() - i)] = { w: v, n: rnd() < 0.15 ? notes[Math.floor(rnd() * notes.length)] : '' }; }
    P().entries = e; s.start = 77; s.startDate = E.dayIso(E.todayNum() - 119); s.goal = 68; s.rate = 0.5; s.objective = 'lose'; s.onboarded = true; s.height = 175; doneSet(); toast('Sample data loaded');
  },
  wipe() { if (confirm('Delete ALL entries for this profile? This cannot be undone.') && confirm('Really delete everything? Save a backup first if unsure.')) { P().entries = {}; const s = ST(); s.start = null; s.startDate = null; doneSet(); } },
  shareRep(v) {
    const c = calc(), r = E.reports(c.series, c.tr, S.rep, c.s.weekStart).find((x) => x.key === v); if (!r) return;
    const txt = `Scale Buddy report ${v}: low ${fw(r.low.w)} ${U()}, trend ${r.tChange < 0 ? '-' : '+'}${fd(r.tChange)} ${U()} (${r.span} days), average ${fw(r.avg)} ${U()}, ${r.count} weigh-ins.`;
    if (navigator.share) navigator.share({ text: txt }).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast('Report copied'));
  }
};
function fileIn(accept, cb) { const i = document.createElement('input'); i.type = 'file'; i.accept = accept; i.onchange = () => { const f = i.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => cb(String(r.result)); r.readAsText(f); }; i.click(); }
function download(name, text, type, share) {
  const f = new File([text], name, { type });
  if (share && navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: name }).catch(() => {}); return; }
  const a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 1500);
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-a]'); if (!t) return;
  const a = t.dataset.a, v = t.dataset.v;
  if (a.startsWith('lbc:')) { const k = a.slice(4), cols = ST().lbCols, i = cols.indexOf(k); if (i < 0) cols.push(k); else if (cols.length > 1) cols.splice(i, 1); save(); const keep = ['rec', 'avg', 'rate', 'notes']; ST().lbCols = keep.filter((x) => cols.includes(x)); refreshSheet(); render(); return; }
  if (A[a]) A[a](v, t);
});
document.addEventListener('change', (e) => { if (e.target.id === 'remtime') { ST().remTime = e.target.value || '08:00'; save(); } });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

/* ---------- reminder (while app is open) ---------- */
let lastFired = '';
async function fireReminder(test) {
  const msg = 'Time to log your weight';
  try { if (typeof Notification !== 'undefined' && Notification.permission === 'granted') { const reg = await navigator.serviceWorker.getRegistration(); if (reg) reg.showNotification('Scale Buddy', { body: msg, icon: 'icon-192.png', tag: 'scalebuddy' }); else new Notification('Scale Buddy', { body: msg }); } } catch (e) {}
  toast(test ? 'Test reminder: ' + msg : msg);
}
function checkReminder() {
  const s = ST(); if (!s.remOn || S.locked) return; const now = new Date(), hm = `${E.pad(now.getHours())}:${E.pad(now.getMinutes())}`, day = E.todayIso();
  if (hm < s.remTime || !s.remDays.includes(now.getDay())) return;
  let last = ''; try { last = localStorage.getItem('sb.fired') || ''; } catch (e) {}
  if (last === day || lastFired === day) return;
  lastFired = day; try { localStorage.setItem('sb.fired', day); } catch (e) {}
  if (s.remSkip && P().entries[day]) return;
  fireReminder(false);
}
setInterval(checkReminder, 20000);
let hiddenAt = 0;
document.addEventListener('visibilitychange', () => { if (document.hidden) hiddenAt = Date.now(); else { if (ST().pin && Date.now() - hiddenAt > 60000) { S.locked = true; closeSheet(); } render(); checkReminder(); } });

/* ---------- boot ---------- */
render();
if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
window.__app = { DB: () => DB, S, render };
})();
