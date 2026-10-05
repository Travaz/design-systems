// Turns one system's sources into every output format. Pure functions: no file access.
import { themes, primitives, semantics, isPrimitiveRef, flatFamilies, typeSize } from './system.mjs';

const px = (n) => `${n}px`;
const rem = (n) => `${+(n / 16).toFixed(4)}rem`;

export function stamp(sys) {
  return `${sys.meta.name} ${sys.meta.version} · generato da design-systems/systems/${sys.id} · non modificare a mano`;
}

function semVar(sys, v) { return isPrimitiveRef(sys, v) ? `var(--${v})` : v; }
function elevationValue(t, theme, first) { return typeof t.value === 'string' ? t.value : (t.value[theme] ?? t.value[first]); }

/* ---------- tokens.css ---------- */
export function tokensCss(sys) {
  const T = sys.tokens, ths = themes(sys), first = ths[0];
  const scheme = (id) => (id === 'dark' ? 'dark' : 'light');
  const out = [];
  out.push(`/* ${stamp(sys)}`);
  if (T.type.fonts?.length) out.push('   Font: inclusi nella cartella fonts/ accanto a questo file (nessuna richiesta a servizi esterni).');
  out.push(`   Tema: "${first}" di default; ${ths.slice(1).map((t) => `"${t}"`).join(', ') || 'nessun altro tema'}${ths.includes('dark') ? ' segue il sistema operativo' : ''}, oppure <html data-theme="…"> lo forza. */`);
  for (const f of T.type.fonts || []) {
    out.push(`@font-face { font-family: "${f.family}"; src: url("${f.file}") format("woff2"); font-weight: ${f.weight}; font-style: ${f.style || 'normal'}; font-display: swap;${f.unicodeRange ? ` unicode-range: ${f.unicodeRange};` : ''} }`);
  }
  out.push(':root {', '  /* livello 1 — primitivi (mai usati direttamente nei componenti) */');
  for (const [n, p] of Object.entries(primitives(sys))) out.push(`  --${n}: ${p.value};`);
  out.push('', `  /* livello 2 — semantici, tema ${first} */`);
  for (const [n, s] of Object.entries(semantics(sys))) out.push(`  --${n}: ${semVar(sys, s[first])};`);
  for (const t of T.elevation?.tokens || []) out.push(`  --${t.name}: ${elevationValue(t, first, first)};`);
  out.push('', '  /* tipografia */');
  for (const [k, v] of Object.entries(T.type.families)) out.push(`  --font-${k}: ${v};`);
  for (const s of T.type.styles) { const z = typeSize(sys, s); out.push(`  --type-${s.name}: ${s.weight} ${z.size}/${z.lineHeight} var(--font-${s.family}); --tracking-${s.name}: ${s.tracking};`); }
  out.push('', '  /* spazi, raggi, dimensioni, livelli, movimento */');
  for (const [k, fam] of flatFamilies(sys)) if (k !== 'breakpoint') for (const t of fam.tokens) out.push(`  --${t.name}: ${t.value};`);
  out.push(`  color-scheme: ${scheme(first)};`, '}');
  for (const th of ths.slice(1)) {
    const body = [
      ...Object.entries(semantics(sys)).map(([n, s]) => `--${n}: ${semVar(sys, s[th] ?? s[first])};`),
      ...(T.elevation?.tokens || []).map((t) => `--${t.name}: ${elevationValue(t, th, first)};`),
      `color-scheme: ${scheme(th)};`,
    ];
    if (th === 'dark') out.push(`@media (prefers-color-scheme: dark) {\n  :root:not([data-theme="${first}"]) {\n${body.map((l) => '    ' + l).join('\n')}\n  }\n}`);
    out.push(`:root[data-theme="${th}"] {\n${body.map((l) => '  ' + l).join('\n')}\n}`);
  }
  if (T.breakpoint) out.push('/* breakpoint (le variabili CSS non funzionano nelle media query: usa questi valori)\n' + T.breakpoint.tokens.map((t) => `   ${t.name}: ${t.value} — ${t.usage}`).join('\n') + ' */');
  const durations = (T.motion?.tokens || []).filter((t) => /^\d+(\.\d+)?m?s$/.test(t.value));
  if (durations.length) out.push(`@media (prefers-reduced-motion: reduce) { :root { ${durations.map((t) => `--${t.name}: 0ms;`).join(' ')} } }`);
  return out.join('\n') + '\n';
}

/* ---------- W3C DTCG tokens.json ---------- */
export function dtcg(sys) {
  const T = sys.tokens, ths = themes(sys);
  const split = (n) => { const i = n.indexOf('-'); return i < 0 ? [n, 'base'] : [n.slice(0, i), n.slice(i + 1)]; };
  const ref = (v) => (isPrimitiveRef(sys, v) ? `{primitive.color.${split(v).join('.')}}` : v);
  const out = { $description: `${sys.meta.name} ${sys.meta.version} (W3C DTCG). Livello 1 primitive -> livello 2 semantic (un modo per tema). Il livello 3 (componenti) vive nel CSS dei componenti.`, primitive: { color: {} }, semantic: {} };
  for (const [n, p] of Object.entries(primitives(sys))) { const [f, k] = split(n); (out.primitive.color[f] ||= {})[k] = { $type: 'color', $value: p.value, $description: p.usage }; }
  for (const th of ths) {
    out.semantic[th] = { color: {} };
    for (const [n, s] of Object.entries(semantics(sys))) out.semantic[th].color[n] = { $type: 'color', $value: ref(s[th] ?? s[ths[0]]), $description: s.usage };
  }
  out.dimension = {};
  for (const k of ['spacing', 'radius', 'size', 'breakpoint']) if (T[k]) out.dimension[k] = Object.fromEntries(T[k].tokens.map((t) => [t.name, { $type: 'dimension', $value: t.value, $description: t.usage }]));
  if (T.aspect) out.aspect = Object.fromEntries(T.aspect.tokens.map((t) => [t.name, { $type: 'string', $value: t.value, $description: t.usage }]));
  if (T.zIndex) out.zIndex = Object.fromEntries(T.zIndex.tokens.map((t) => [t.name, { $type: 'number', $value: +t.value, $description: t.usage }]));
  if (T.motion) out.motion = Object.fromEntries(T.motion.tokens.map((t) => {
    const bez = t.value.match(/cubic-bezier\(([^)]+)\)/);
    return [t.name, bez ? { $type: 'cubicBezier', $value: bez[1].split(',').map(Number), $description: t.usage } : { $type: 'duration', $value: t.value, $description: t.usage }];
  }));
  out.fontFamily = Object.fromEntries(Object.entries(T.type.families).map(([k, v]) => [k, { $type: 'fontFamily', $value: v }]));
  out.typography = Object.fromEntries(T.type.styles.map((s) => [s.name, { $type: 'typography', $value: { fontFamily: `{fontFamily.${s.family}}`, fontSize: px(s.size), lineHeight: px(s.lineHeight), fontWeight: s.weight, letterSpacing: s.tracking }, $description: s.usage, ...(s.fluid ? { $extensions: { fluid: { minViewport: px((T.type.fluidRange || {}).min || 360), maxViewport: px((T.type.fluidRange || {}).max || 1280), fontSize: px(s.fluid.size), lineHeight: px(s.fluid.lineHeight) } } } : {}) }]));
  if (T.elevation) {
    out.shadow = {};
    for (const th of ths) out.shadow[th] = Object.fromEntries(T.elevation.tokens.map((t) => [t.name, { $type: 'shadow', $value: elevationValue(t, th, ths[0]), $description: t.usage }]));
  }
  return JSON.stringify(out, null, 2) + '\n';
}

/* ---------- Tailwind v4 ---------- */
export function tailwind(sys) {
  const T = sys.tokens;
  const spacing = (T.spacing?.tokens || []).map((t) => parseFloat(t.value)).filter((n) => n > 0);
  const base = spacing.length ? Math.min(...spacing) : 4;
  const L = [`/* ${stamp(sys)}`,
    `   Tailwind CSS v4. Importa DOPO tokens.css:  @import "tailwindcss"; @import "./tokens.css"; @import "./tailwind.css";`,
    '   Le utility leggono le variabili semantiche: il tema scuro funziona senza varianti dark:. */', '@theme inline {', '  --color-*: initial;'];
  for (const n of Object.keys(semantics(sys))) L.push(`  --color-${n}: var(--${n});`);
  L.push(`  --spacing: ${base}px; /* p-4 = ${4 * base}px */`);
  for (const [k, v] of Object.entries(T.type.families)) L.push(`  --font-${k}: ${v};`);
  for (const t of T.radius?.tokens || []) L.push(`  --radius-${t.name.replace(/^radius-/, '')}: ${t.value};`);
  for (const t of T.elevation?.tokens || []) L.push(`  --shadow-${t.name.replace(/^elevation-/, '')}: var(--${t.name});`);
  for (const t of T.breakpoint?.tokens || []) L.push(`  --breakpoint-${t.name.replace(/^bp-/, '')}: ${t.value};`);
  for (const s of T.type.styles) { const z = typeSize(sys, s); L.push(`  --text-${s.name}: ${z.size}; --text-${s.name}--line-height: ${z.lineHeight}; --text-${s.name}--letter-spacing: ${s.tracking}; --text-${s.name}--font-weight: ${s.weight};`); }
  for (const t of T.motion?.tokens || []) if (t.name.startsWith('ease-')) L.push(`  --${t.name}: ${t.value};`);
  L.push('}');
  return L.join('\n') + '\n';
}

/* ---------- references/tokens.md ---------- */
export function tokensMd(sys) {
  const T = sys.tokens, ths = themes(sys), prim = primitives(sys);
  const show = (v) => (prim[v] ? `${v} (${prim[v].value})` : v);
  const L = [`# Token ${sys.meta.name}`, '', `Versione ${sys.meta.version}. Tre livelli: **primitivi** (solo per definire i semantici) → **semantici** (quelli da usare) → **componente** (nel CSS dei componenti). In CSS ogni token è \`var(--nome)\`.`, '',
    '## Colori semantici (usa questi)', '', `| Token | ${ths.join(' | ')} | Uso |`, `|---|${ths.map(() => '---|').join('')}---|`];
  for (const [n, s] of Object.entries(semantics(sys))) L.push(`| \`${n}\` | ${ths.map((t) => show(s[t] ?? s[ths[0]])).join(' | ')} | ${s.usage} |`);
  L.push('', '## Primitivi (non usarli nei componenti)', '', '| Token | Valore | Nota |', '|---|---|---|');
  for (const [n, p] of Object.entries(prim)) L.push(`| \`${n}\` | ${p.value} | ${p.usage} |`);
  L.push('', '## Tipografia', '', ...(T.type.fonts?.length ? [`I caratteri sono inclusi (\`assets/fonts/\`, licenza OFL) e dichiarati in \`tokens.css\` con \`@font-face\`: copia la cartella \`fonts/\` accanto a \`tokens.css\`. Nessun link a servizi esterni.`, ''] : []), '| Famiglia | Stack |', '|---|---|');
  for (const [k, v] of Object.entries(T.type.families)) L.push(`| \`--font-${k}\` | ${v} |`);
  L.push('', '| Stile | Famiglia | Size/Line | Peso | Tracking | Uso |', '|---|---|---|---|---|---|');
  for (const s of T.type.styles) L.push(`| \`${s.name}\` | ${s.family} | ${s.fluid ? `${s.fluid.size}/${s.fluid.lineHeight} → ` : ''}${s.size}/${s.lineHeight} | ${s.weight} | ${s.tracking} | ${s.usage} |`);
  const fr = T.type.fluidRange; L.push('', 'In CSS: `font: var(--type-body); letter-spacing: var(--tracking-body);` oppure, con Tailwind, `text-body font-sans`.', ...(fr ? [`Gli stili con la freccia sono fluidi: crescono linearmente da ${fr.min}px a ${fr.max}px di larghezza dello schermo (\`clamp()\`), con entrambi gli estremi sulla griglia da 4.`] : []), '');
  const titles = { spacing: 'Spazi', radius: 'Raggi', size: 'Dimensioni', aspect: 'Proporzioni', breakpoint: 'Breakpoint', zIndex: 'Z-index', motion: 'Movimento' };
  for (const [k, fam] of flatFamilies(sys)) {
    L.push(`## ${titles[k]}`, '', ...(fam.note ? [fam.note, ''] : []), '| Token | Valore | Uso |', '|---|---|---|', ...fam.tokens.map((t) => `| \`${t.name}\` | ${t.value} | ${t.usage} |`), '');
  }
  if (T.elevation) {
    L.push('## Elevazione', '', `| Token | ${ths.join(' | ')} | Uso |`, `|---|${ths.map(() => '---|').join('')}---|`);
    for (const t of T.elevation.tokens) L.push(`| \`${t.name}\` | ${ths.map((th) => '`' + elevationValue(t, th, ths[0]) + '`').join(' | ')} | ${t.usage} |`);
  }
  return L.join('\n') + '\n';
}

/* ---------- references/components.md ---------- */
export function componentsMd(sys, components) {
  const L = [`# Componenti ${sys.meta.name}`, '',
    `Ogni componente esiste in due strati: classi CSS \`${sys.meta.classPrefix}*\` (in \`assets/${baseName(sys.meta.files.componentCss)}\`, per qualsiasi stack) e componente React (\`assets/${sys.id}-react.js\`, \`window.${sys.meta.namespace}\`; tipi in \`assets/${sys.id}-react.d.ts\`). Con un altro framework ricrea il markup con le stesse classi e gli stessi attributi ARIA.`, ''];
  for (const c of components) L.push(`## ${c.name}`, '', c.readme.replace(new RegExp(`^# ${c.name}\\n+`), '').trim(), '');
  return L.join('\n');
}

/* ---------- Design System artifact: tokens.json in the page's list format ---------- */
export function artifactTokens(sys) {
  const T = sys.tokens, ths = themes(sys);
  const color = { themes: T.themes, tokens: [] };
  for (const [n, p] of Object.entries(primitives(sys))) color.tokens.push({ name: n, value: p.value, usage: p.usage });
  for (const [n, s] of Object.entries(semantics(sys))) {
    const value = Object.fromEntries(ths.map((t) => { const v = s[t] ?? s[ths[0]]; return [t, isPrimitiveRef(sys, v) ? `{${v}}` : v]; }));
    color.tokens.push({ name: n, value, usage: s.usage });
  }
  const groups = [];
  for (const s of T.type.styles) {
    let g = groups.find((x) => x.name === s.group);
    if (!g) groups.push((g = { name: s.group, family: s.family, styles: [] }));
    g.styles.push({ name: s.name, ...(s.family !== g.family ? { family: s.family } : {}), fontSize: px(s.size), lineHeight: px(s.lineHeight), fontWeight: s.weight, letterSpacing: s.tracking, sample: s.sample, usage: s.usage });
  }
  // the page declares its own @font-face per font, without unicode-range: give it the latin files only
  const fonts = (T.type.fonts || []).filter((f) => !f.subset || f.subset === 'latin').map(({ family, file, weight, style }) => ({ family, file, weight, style }));
  const out = { name: sys.meta.name, version: 1, color, type: { fonts, families: T.type.families, groups } };
  for (const k of ['spacing', 'radius']) if (T[k]) out[k] = T[k];
  if (T.elevation) out.shadow = T.elevation;
  for (const k of ['size', 'aspect', 'breakpoint', 'zIndex']) if (T[k]) out[k] = T[k]; // motion is not a family the page reads
  return JSON.stringify(out, null, 1) + '\n';
}

export function artifactIndex(sys, now) {
  const a = sys.meta.artifact || {};
  const groups = a.assetGroups || {};
  return JSON.stringify({
    v: 3, layout: 'files', ...(a.createdOnFiles ? { createdOnFiles: a.createdOnFiles } : {}),
    title: sys.meta.name, namespace: sys.meta.namespace,
    libraries: sys.meta.files?.bundle ? [{ name: 'react', version: '18' }, { name: 'react-dom', version: '18' }] : [],
    sections: {}, groups: Object.keys(groups),
    assetGroups: Object.fromEntries(Object.entries(groups).map(([g, v]) => [g, { name: g, tile: v.tile || 'm', order: Object.keys(v.files), files: Object.fromEntries(Object.entries(v.files).map(([n, f]) => [n, { name: n, ...f }])) }])),
    blobs: {}, docs: { sections: [] },
    lastChange: { by: sys.meta.author || 'Claude', at: now, via: 'design-systems build', note: `${sys.meta.name} ${sys.meta.version}` },
  }, null, 1) + '\n';
}

export function renderTemplate(text, vars) {
  return text.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}
export function baseName(p) { return p.split('/').pop(); }
