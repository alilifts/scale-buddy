/* Scale Buddy engine: pure functions, no DOM. All weights stored in kg. */
(function (root) {
  const DAY = 86400000;
  const pad = (n) => String(n).padStart(2, '0');
  const dayNum = (iso) => { const [y, m, d] = iso.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / DAY); };
  const dayIso = (n) => { const d = new Date(n * DAY); return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`; };
  const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const todayNum = () => dayNum(todayIso());
  const dow = (n) => new Date(n * DAY).getUTCDay();

  function toSeries(entries) {
    return Object.keys(entries).sort().filter((k) => entries[k] && entries[k].w > 0)
      .map((iso) => ({ iso, d: dayNum(iso), w: entries[iso].w, n: entries[iso].n || '', h: entries[iso].h }));
  }

  /* Trend methods. Returns array of trend values, one per series point. */
  function trend(series, method) {
    const out = [];
    if (!series.length) return out;
    if (method === 'ma7') {
      for (let i = 0; i < series.length; i++) {
        let s = 0, c = 0;
        for (let j = i; j >= 0 && series[i].d - series[j].d < 7; j--) { s += series[j].w; c++; }
        out.push(s / c);
      }
      return out;
    }
    if (method === 'dexp') { // Holt double exponential smoothing
      let L = series[0].w, T = 0; out.push(L);
      for (let i = 1; i < series.length; i++) {
        const g = series[i].d - series[i - 1].d, w = series[i].w;
        const pred = L + T * g;
        const a = 1 - Math.pow(0.75, g), b = 1 - Math.pow(0.92, g);
        const nL = pred + a * (w - pred);
        T = T + b * ((nL - L) / g - T); L = nL; out.push(L);
      }
      return out;
    }
    // 'smooth' (default, gap-aware, resists spikes) and 'exp' (faster)
    const base = method === 'exp' ? 0.8 : 0.9;
    let t = series[0].w; out.push(t);
    for (let i = 1; i < series.length; i++) {
      const g = series[i].d - series[i - 1].d;
      let a = 1 - Math.pow(base, g);
      if (method !== 'exp') { // damp spikes: big jumps count less
        const dev = Math.abs(series[i].w - t);
        if (dev > 2) a *= Math.max(0.4, 2 / dev);
      }
      t = t + a * (series[i].w - t); out.push(t);
    }
    return out;
  }

  function trendAt(series, tr, day) {
    if (!series.length) return null;
    if (day <= series[0].d) return tr[0];
    const last = series.length - 1;
    if (day >= series[last].d) return tr[last];
    let lo = 0, hi = last;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (series[m].d <= day) lo = m; else hi = m; }
    const f = (day - series[lo].d) / (series[hi].d - series[lo].d);
    return tr[lo] + f * (tr[hi] - tr[lo]);
  }

  /* kg change per week, negative = losing. */
  function rateWeek(series, tr, win) {
    if (series.length < 2) return null;
    const end = series[series.length - 1].d;
    const start = Math.max(series[0].d, end - win);
    const span = end - start;
    if (span < 2) return null;
    return (trendAt(series, tr, end) - trendAt(series, tr, start)) / span * 7;
  }
  function overallRate(series, tr) {
    if (series.length < 2) return null;
    const span = series[series.length - 1].d - series[0].d;
    if (span < 2) return null;
    return (tr[tr.length - 1] - tr[0]) / span * 7;
  }

  function milestones(start, goal, mode, n) {
    if (start == null || goal == null || start === goal) return [];
    if (mode === 'none') return [goal];
    const dir = Math.sign(goal - start);
    if (mode === 'round') {
      const out = []; let v = dir < 0 ? Math.floor(start - 1e-9) : Math.ceil(start + 1e-9);
      while (dir * (goal - v) > 1e-9) { out.push(v); v += dir; }
      out.push(goal); return out;
    }
    n = Math.max(1, n | 0);
    return Array.from({ length: n }, (_, i) => start + (goal - start) * (i + 1) / n);
  }

  function progress(start, goal, ms, t) {
    if (!ms.length || t == null) return null;
    const dir = Math.sign(goal - start);
    const reached = ms.filter((m) => dir * (m - t) <= 1e-9).length;
    const done = reached >= ms.length;
    const next = ms[Math.min(reached, ms.length - 1)];
    const prev = reached === 0 ? start : ms[reached - 1];
    const seg = Math.abs(prev - next) || 1;
    const pct = done ? 1 : Math.min(1, Math.max(0, Math.abs(prev - t) / seg));
    const overall = Math.min(1, Math.max(0, (start - t) / (start - goal)));
    return { reached, total: ms.length, next, prev, pct, toGo: done ? 0 : Math.abs(t - next), overall, done };
  }

  /* Days until trend reaches target at kg/week rate (positive magnitude). */
  function daysTo(t, target, rateAbs, dirTowards) {
    const dist = target - t; // signed
    if (Math.abs(dist) < 1e-6) return 0;
    if (!rateAbs || rateAbs < 0.005) return null;
    if (dirTowards != null && Math.sign(dist) !== dirTowards) return null;
    return Math.ceil(Math.abs(dist) / (rateAbs / 7));
  }

  function mean(a) { return a.reduce((s, x) => s + x, 0) / (a.length || 1); }

  function periodKey(day, kind, weekStart) {
    const d = new Date(day * DAY);
    if (kind === 'month') return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1);
    if (kind === 'year') return String(d.getUTCFullYear());
    const off = (dow(day) - weekStart + 7) % 7; return dayIso(day - off);
  }
  function periodBounds(key, kind) {
    if (kind === 'month') { const [y, m] = key.split('-').map(Number); return [Math.round(Date.UTC(y, m - 1, 1) / DAY), Math.round(Date.UTC(y, m, 0) / DAY)]; }
    if (kind === 'year') { const y = +key; return [Math.round(Date.UTC(y, 0, 1) / DAY), Math.round(Date.UTC(y, 11, 31) / DAY)]; }
    const s = dayNum(key); return [s, s + 6];
  }

  function reports(series, tr, kind, weekStart) {
    const groups = new Map();
    series.forEach((p, i) => { const k = periodKey(p.d, kind, weekStart); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(i); });
    const keys = [...groups.keys()].sort();
    const today = todayNum();
    const res = keys.map((key, ki) => {
      const idx = groups.get(key); const [s, e] = periodBounds(key, kind);
      const ws = idx.map((i) => series[i].w);
      let lowI = idx[0]; idx.forEach((i) => { if (series[i].w < series[lowI].w) lowI = i; });
      let hiI = idx[0]; idx.forEach((i) => { if (series[i].w > series[hiI].w) hiI = i; });
      const endDay = Math.min(e, Math.max(series[idx[idx.length - 1]].d, 0), today);
      const first = idx[0], before = first - 1;
      const t0 = before >= 0 ? tr[before] : tr[first];
      const t1 = tr[idx[idx.length - 1]];
      const startDay = before >= 0 ? series[before].d : series[first].d;
      const span = Math.max(1, series[idx[idx.length - 1]].d - startDay);
      return { key, kind, s, e, idx, count: idx.length, low: series[lowI], high: series[hiI], avg: mean(ws), tChange: t1 - t0, tWeek: (t1 - t0) / span * 7, span, notes: idx.filter((i) => series[i].n).length, endDay };
    });
    res.forEach((r, i) => { r.lowDelta = i > 0 ? r.low.w - res[i - 1].low.w : null; });
    return res.reverse();
  }

  function logRows(series, tr, win) {
    return series.map((p, i) => {
      let rate = null;
      if (i > 0) {
        const start = Math.max(series[0].d, p.d - win);
        if (p.d - start >= 2) rate = (tr[i] - trendAt(series, tr, start)) / (p.d - start) * 7;
      }
      return { ...p, t: tr[i], rate };
    });
  }

  function streak(series) {
    if (!series.length) return { cur: 0, best: 0 };
    const set = new Set(series.map((p) => p.d)); let best = 0, run = 0;
    for (let d = series[0].d; d <= series[series.length - 1].d; d++) { if (set.has(d)) { run++; best = Math.max(best, run); } else run = 0; }
    const today = todayNum(); let cur = 0, d = set.has(today) ? today : today - 1;
    while (set.has(d)) { cur++; d--; }
    return { cur, best };
  }

  function bmi(w, hcm) { return hcm > 50 ? w / Math.pow(hcm / 100, 2) : null; }
  function kcalPerDay(rateKgWeek) { return rateKgWeek * 7700 / 7; }

  const api = { DAY, pad, dayNum, dayIso, todayIso, todayNum, dow, toSeries, trend, trendAt, rateWeek, overallRate, milestones, progress, daysTo, mean, periodKey, periodBounds, reports, logRows, streak, bmi, kcalPerDay };
  if (typeof module !== 'undefined') module.exports = api; else root.E = api;
})(typeof window !== 'undefined' ? window : globalThis);
