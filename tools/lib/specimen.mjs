// A specimen page per system (colours, contrast, type, space, shape) and an index of the whole collection.
import { themes, primitives, semantics, resolveColor, flatFamilies } from './system.mjs';
import { contrast } from './color.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const textOn = (bg) => (contrast('#000000', bg) >= contrast('#FFFFFF', bg) ? '#000000' : '#FFFFFF');

const STYLE = `
:root { color-scheme: light dark; }
body { margin: 0; background: var(--surface, #fff); color: var(--ink, #111); font-family: var(--font-sans, system-ui, sans-serif); font-size: 16px; line-height: 24px; }
main { max-width: 1120px; margin: 0 auto; padding: 48px 24px 96px; display: grid; gap: 64px; }
header p { color: var(--ink-muted, #555); max-width: 70ch; margin: 8px 0 0; }
h1 { font-family: var(--font-display, var(--font-sans, inherit)); font-size: 56px; line-height: 60px; margin: 0; letter-spacing: -0.02em; }
h2 { font-size: 24px; line-height: 32px; margin: 0 0 16px; }
h3 { font-size: 14px; line-height: 20px; margin: 24px 0 8px; color: var(--ink-muted, #555); font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
.meta { font-family: var(--font-mono, ui-monospace, monospace); font-size: 13px; color: var(--ink-muted, #555); }
.bar { display: flex; gap: 8px; align-items: center; margin-top: 16px; }
.bar button { font: inherit; font-size: 14px; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--line-strong, #888); background: var(--surface-raised, #fff); color: var(--ink, #111); cursor: pointer; }
.bar button:focus-visible { outline: 2px solid var(--focus, #000); outline-offset: 2px; }
.strip { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); border-radius: 8px; overflow: hidden; border: 1px solid var(--line, #ddd); }
.chip { padding: 12px 8px; min-height: 64px; display: grid; align-content: end; font: 12px/16px var(--font-mono, ui-monospace, monospace); }
table { width: 100%; border-collapse: collapse; font-size: 14px; line-height: 20px; }
caption { text-align: left; font-weight: 600; padding: 0 0 8px; }
th, td { text-align: left; padding: 8px; border-bottom: 1px solid var(--line, #ddd); vertical-align: top; }
th { color: var(--ink-muted, #555); font-weight: 600; font-size: 12px; }
td.num { font-family: var(--font-mono, ui-monospace, monospace); white-space: nowrap; }
td code { white-space: nowrap; }
a { color: var(--link, var(--ink, inherit)); text-underline-offset: 3px; }
a:focus-visible { outline: 2px solid var(--focus, currentColor); outline-offset: 2px; }
.sw { display: inline-block; width: 40px; height: 24px; border-radius: 4px; border: 1px solid rgba(128,128,128,.4); vertical-align: middle; margin-right: 8px; }
.ok { font-weight: 600; } .ko { font-weight: 700; text-decoration: underline; }
.type-row { display: grid; grid-template-columns: 160px 1fr; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--line, #ddd); align-items: baseline; }
.type-row > div { min-width: 0; overflow-wrap: anywhere; }
.scale-row { display: grid; grid-template-columns: 160px 1fr; gap: 16px; align-items: center; padding: 6px 0; }
.space { height: 16px; background: var(--accent, #333); border-radius: 2px; }
.shapes { display: flex; flex-wrap: wrap; gap: 24px; }
.shape { width: 120px; height: 80px; border: 1px solid var(--line-strong, #888); background: var(--surface-raised, #fff); display: grid; place-items: end start; padding: 8px; box-sizing: border-box; font: 12px/16px var(--font-mono, monospace); }
.wrap { overflow-x: auto; }
`;

export function specimenHtml(sys, { cssName }) {
  const T = sys.tokens, ths = themes(sys), prim = primitives(sys), sem = semantics(sys);
  const families = {};
  for (const [n, p] of Object.entries(prim)) (families[n.replace(/-\d+$/, '')] ||= []).push([n, p.value]);
  const primHtml = Object.entries(families).map(([f, list]) => `<h3>${esc(f)}</h3><div class="strip">${list.map(([n, v]) => `<div class="chip" style="background:${v};color:${textOn(v)}">${esc(n.replace(f + '-', '') || n)}<br>${v}</div>`).join('')}</div>`).join('');
  const semRows = Object.entries(sem).map(([n, s]) => `<tr><td><code>${esc(n)}</code></td>${ths.map((t) => { const v = resolveColor(sys, n, t); return `<td class="num"><span class="sw" style="background:${esc(v)}"></span>${esc(s[t] ?? s[ths[0]])}</td>`; }).join('')}<td>${esc(s.usage)}</td></tr>`).join('');
  const pairRows = (T.contrast || []).flatMap((rule) => [].concat(rule.fg).flatMap((fg) => [].concat(rule.bg).map((bg) => {
    const cells = ths.map((t) => {
      const f = resolveColor(sys, fg, t), b = resolveColor(sys, bg, t), r = contrast(f, b), pass = r + 1e-9 >= rule.min;
      // text pairs show text; non-text pairs (borders, rings, below 4.5:1) show a ring, as they are used
      const sample = rule.min >= 4.5
        ? `<span class="sw" style="background:${b};color:${f};text-align:center;font-weight:700">Aa</span>`
        : `<span class="sw" style="background:${b};box-shadow:inset 0 0 0 3px ${f}" aria-hidden="true"></span>`;
      return `<td class="num">${sample}<span class="${pass ? 'ok' : 'ko'}">${r.toFixed(2)}:1 ${pass ? '✓' : '✗ sotto'}</span></td>`;
    });
    return `<tr><td><code>${esc(fg)}</code> su <code>${esc(bg)}</code></td><td class="num">${rule.min}:1</td>${cells.join('')}</tr>`;
  }))).join('');
  const typeRows = T.type.styles.map((s) => `<div class="type-row"><div class="meta">${esc(s.name)}<br>${s.fluid ? `${s.fluid.size}→${s.size}` : s.size}/${s.fluid ? `${s.fluid.lineHeight}→` : ''}${s.lineHeight} · ${s.weight}</div><div style="font: var(--type-${s.name}); letter-spacing: var(--tracking-${s.name})">${esc(s.sample || s.name)}</div></div>`).join('');
  const flat = Object.fromEntries(flatFamilies(sys));
  const spaceRows = (flat.spacing?.tokens || []).map((t) => `<div class="scale-row"><div class="meta">${esc(t.name)} · ${esc(t.value)}</div><div><div class="space" style="width:var(--${t.name})"></div></div></div>`).join('');
  const shapes = [...(flat.radius?.tokens || []).map((t) => `<div class="shape" style="border-radius:min(var(--${t.name}), 40px)">${esc(t.name)}</div>`), ...(T.elevation?.tokens || []).map((t) => `<div class="shape" style="border-color:transparent;box-shadow:var(--${t.name})">${esc(t.name)}</div>`)].join('');
  return `<!doctype html>
<html lang="${esc(sys.meta.language || 'it')}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(sys.meta.name)} ${esc(sys.meta.version)} · specimen</title>
<link rel="stylesheet" href="package/tokens.css">
<link rel="stylesheet" href="package/${esc(cssName)}">
<style>${STYLE}</style>
</head>
<body>
<main>
<header>
  <p class="meta">design-systems / ${esc(sys.id)} · versione ${esc(sys.meta.version)}</p>
  <h1>${esc(sys.meta.name)}</h1>
  <p>${esc(sys.meta.description)}</p>
  <div class="bar">${ths.map((t) => `<button type="button" data-theme-set="${esc(t)}">Tema ${esc(t)}</button>`).join('')}<a href="gallery/index.html">Componenti</a><a href="../index.html">Tutti i sistemi</a></div>
</header>
<section aria-labelledby="sem"><h2 id="sem">Colori semantici</h2><div class="wrap"><table><thead><tr><th>Token</th>${ths.map((t) => `<th>${esc(t)}</th>`).join('')}<th>Uso</th></tr></thead><tbody>${semRows}</tbody></table></div></section>
<section aria-labelledby="pairs"><h2 id="pairs">Contrasto delle coppie dichiarate</h2><div class="wrap"><table><thead><tr><th>Coppia</th><th>Minimo</th>${ths.map((t) => `<th>${esc(t)}</th>`).join('')}</tr></thead><tbody>${pairRows}</tbody></table></div></section>
<section aria-labelledby="prim"><h2 id="prim">Primitivi</h2>${primHtml}</section>
<section aria-labelledby="type"><h2 id="type">Tipografia</h2>${typeRows}</section>
${spaceRows ? `<section aria-labelledby="space"><h2 id="space">Spazi</h2>${spaceRows}</section>` : ''}
${shapes ? `<section aria-labelledby="shape"><h2 id="shape">Raggi ed elevazione</h2><div class="shapes">${shapes}</div></section>` : ''}
</main>
<script>document.querySelectorAll('[data-theme-set]').forEach(function (b) { b.addEventListener('click', function () { document.documentElement.dataset.theme = b.dataset.themeSet; }); });</script>
</body>
</html>
`;
}

export function indexHtml(systems) {
  const cards = systems.map((sys) => {
    const first = themes(sys)[0];
    const sw = ['surface', 'ink', 'accent', 'accent-text', 'line'].map((n) => resolveColor(sys, n, first)).filter(Boolean);
    return `<li><a href="${esc(sys.id)}/specimen.html"><span class="sw">${sw.map((c) => `<span style="background:${esc(c)}"></span>`).join('')}</span><strong>${esc(sys.meta.name)}</strong> <span class="v">${esc(sys.meta.version)}</span><br><span class="d">${esc(sys.meta.description)}</span></a></li>`;
  }).join('');
  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Design systems</title>
<style>
:root { color-scheme: light dark; --bg: #FAFAF9; --fg: #1C1C19; --mut: #55554F; --line: #E2E2DF; }
@media (prefers-color-scheme: dark) { :root { --bg: #121210; --fg: #F4F4F1; --mut: #B5B5AE; --line: #2A2A26; } }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/24px ui-sans-serif, system-ui, sans-serif; }
main { max-width: 880px; margin: 0 auto; padding: 48px 24px; }
h1 { font-size: 40px; line-height: 48px; margin: 0 0 8px; } p { color: var(--mut); margin: 0 0 32px; }
ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 16px; }
a { display: block; padding: 20px; border: 1px solid var(--line); border-radius: 12px; color: inherit; text-decoration: none; }
a:hover, a:focus-visible { border-color: var(--fg); outline: none; }
.sw { display: flex; height: 32px; border-radius: 6px; overflow: hidden; margin-bottom: 12px; border: 1px solid var(--line); }
.sw span { flex: 1; } .v, .d { color: var(--mut); font-size: 14px; }
</style></head>
<body><main><h1>Design systems</h1><p>${systems.length} ${systems.length === 1 ? 'sistema' : 'sistemi'}, ciascuno con il suo specimen e la galleria dei componenti.</p><ul>${cards}</ul></main></body></html>
`;
}
