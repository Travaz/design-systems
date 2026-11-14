// Turns one system's sources into every output format. Pure functions: no file access.
import { themes, primitives, semantics, isPrimitiveRef, flatFamilies, typeSize } from './system.mjs';

const px = (n) => `${n}px`;
const rem = (n) => `${+(n / 16).toFixed(4)}rem`;

export function stamp(sys) {
  return `${sys.meta.name} ${sys.meta.version} · generated from design-systems/systems/${sys.id} · do not edit by hand`;
}

function semVar(sys, v) { return isPrimitiveRef(sys, v) ? `var(--${v})` : v; }
function elevationValue(t, theme, first) { return typeof t.value === 'string' ? t.value : (t.value[theme] ?? t.value[first]); }

/* ---------- tokens.css ---------- */
export function tokensCss(sys) {
  const T = sys.tokens, ths = themes(sys), first = ths[0];
  const scheme = (id) => (id === 'dark' ? 'dark' : 'light');
  const out = [];
  out.push(`/* ${stamp(sys)}`);
  if (T.type.fonts?.length) out.push('   Fonts: bundled in the fonts/ folder next to this file (no requests to external services).');
  out.push(`   Theme: "${first}" by default; ${ths.slice(1).map((t) => `"${t}"`).join(', ') || 'no other theme'}${ths.includes('dark') ? ' follows the operating system' : ''}, or <html data-theme="…"> forces one. */`);
  for (const f of T.type.fonts || []) {
    out.push(`@font-face { font-family: "${f.family}"; src: url("${f.file}") format("woff2"); font-weight: ${f.weight}; font-style: ${f.style || 'normal'}; font-display: swap;${f.unicodeRange ? ` unicode-range: ${f.unicodeRange};` : ''} }`);
  }
  out.push(':root {', '  /* tier 1 — primitives (never used directly in components) */');
  for (const [n, p] of Object.entries(primitives(sys))) out.push(`  --${n}: ${p.value};`);
  out.push('', `  /* tier 2 — semantic, ${first} theme */`);
  for (const [n, s] of Object.entries(semantics(sys))) out.push(`  --${n}: ${semVar(sys, s[first])};`);
  for (const t of T.elevation?.tokens || []) out.push(`  --${t.name}: ${elevationValue(t, first, first)};`);
  out.push('', '  /* typography */');
  for (const [k, v] of Object.entries(T.type.families)) out.push(`  --font-${k}: ${v};`);
  for (const s of T.type.styles) { const z = typeSize(sys, s); out.push(`  --type-${s.name}: ${s.weight} ${z.size}/${z.lineHeight} var(--font-${s.family}); --tracking-${s.name}: ${s.tracking};`); }
  out.push('', '  /* spacing, radius, sizes, layers, motion */');
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
  if (T.breakpoint) out.push('/* breakpoints (CSS variables do not work in media queries: use these values)\n' + T.breakpoint.tokens.map((t) => `   ${t.name}: ${t.value} — ${t.usage}`).join('\n') + ' */');
  const durations = (T.motion?.tokens || []).filter((t) => /^\d+(\.\d+)?m?s$/.test(t.value));
  if (durations.length) out.push(`@media (prefers-reduced-motion: reduce) { :root { ${durations.map((t) => `--${t.name}: 0ms;`).join(' ')} } }`);
  return out.join('\n') + '\n';
}

/* ---------- motion tokens for JavaScript (motion.dev, motion/react) ---------- */
export function motionTokensJs(sys) {
  const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
  const duration = {}, ease = {}, value = {};
  for (const t of sys.tokens.motion?.tokens || []) {
    const bez = t.value.match(/cubic-bezier\(([^)]+)\)/), time = t.value.match(/^(\d+(?:\.\d+)?)(m?s)$/);
    if (bez) ease[camel(t.name.replace(/^ease-/, ''))] = bez[1].split(',').map(Number);
    else if (time) duration[camel(t.name.replace(/^duration-/, ''))] = +(time[2] === 'ms' ? time[1] / 1000 : +time[1]).toFixed(4);
    else value[camel(t.name.replace(/^motion-/, ''))] = parseFloat(t.value);
  }
  return [`/* ${stamp(sys)}`,
    '   Motion tokens for JavaScript (Motion: motion and motion/react). Durations in seconds, easings as cubic-bezier arrays, lengths in px. */',
    `export const duration = ${JSON.stringify(duration)};`,
    `export const ease = ${JSON.stringify(ease)};`,
    `export const value = ${JSON.stringify(value)};`, ''].join('\n');
}

/* ---------- W3C DTCG tokens.json ---------- */
export function dtcg(sys) {
  const T = sys.tokens, ths = themes(sys);
  const split = (n) => { const i = n.indexOf('-'); return i < 0 ? [n, 'base'] : [n.slice(0, i), n.slice(i + 1)]; };
  const ref = (v) => (isPrimitiveRef(sys, v) ? `{primitive.color.${split(v).join('.')}}` : v);
  const out = { $description: `${sys.meta.name} ${sys.meta.version} (W3C DTCG). Tier 1 primitive -> tier 2 semantic (one mode per theme). Tier 3 (components) lives in the component CSS.`, primitive: { color: {} }, semantic: {} };
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
    if (bez) return [t.name, { $type: 'cubicBezier', $value: bez[1].split(',').map(Number), $description: t.usage }];
    if (/^\d+(\.\d+)?m?s$/.test(t.value)) return [t.name, { $type: 'duration', $value: t.value, $description: t.usage }];
    if (/^-?\d+(\.\d+)?px$/.test(t.value)) return [t.name, { $type: 'dimension', $value: t.value, $description: t.usage }];
    return [t.name, { $type: 'number', $value: +t.value, $description: t.usage }];
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
    `   Tailwind CSS v4. Import AFTER tokens.css:  @import "tailwindcss"; @import "./tokens.css"; @import "./tailwind.css";`,
    '   Utilities read the semantic variables: the dark theme works without dark: variants. */', '@theme inline {', '  --color-*: initial;'];
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
  const L = [`# ${sys.meta.name} tokens`, '', `Version ${sys.meta.version}. Three tiers: **primitives** (only to define the semantic tokens) → **semantic** (the ones to use) → **component** (in the component CSS). In CSS every token is \`var(--name)\`.`, '',
    '## Semantic colours (use these)', '', `| Token | ${ths.join(' | ')} | Usage |`, `|---|${ths.map(() => '---|').join('')}---|`];
  for (const [n, s] of Object.entries(semantics(sys))) L.push(`| \`${n}\` | ${ths.map((t) => show(s[t] ?? s[ths[0]])).join(' | ')} | ${s.usage} |`);
  L.push('', '## Primitives (do not use them in components)', '', '| Token | Value | Note |', '|---|---|---|');
  for (const [n, p] of Object.entries(prim)) L.push(`| \`${n}\` | ${p.value} | ${p.usage} |`);
  L.push('', '## Typography', '', ...(T.type.fonts?.length ? [`The fonts are bundled (\`assets/fonts/\`, OFL licence) and declared in \`tokens.css\` with \`@font-face\`: copy the \`fonts/\` folder next to \`tokens.css\`. No links to external services.`, ''] : []), '| Family | Stack |', '|---|---|');
  for (const [k, v] of Object.entries(T.type.families)) L.push(`| \`--font-${k}\` | ${v} |`);
  L.push('', '| Style | Family | Size/Line | Weight | Tracking | Usage |', '|---|---|---|---|---|---|');
  for (const s of T.type.styles) L.push(`| \`${s.name}\` | ${s.family} | ${s.fluid ? `${s.fluid.size}/${s.fluid.lineHeight} → ` : ''}${s.size}/${s.lineHeight} | ${s.weight} | ${s.tracking} | ${s.usage} |`);
  const fr = T.type.fluidRange; L.push('', 'In CSS: `font: var(--type-body); letter-spacing: var(--tracking-body);` or, with Tailwind, `text-body font-sans`.', ...(fr ? [`Styles with an arrow are fluid: they grow linearly from ${fr.min}px to ${fr.max}px of screen width (\`clamp()\`), with both ends on the 4px grid.`] : []), '');
  const titles = { spacing: 'Spacing', radius: 'Radius', size: 'Sizes', aspect: 'Aspect ratios', breakpoint: 'Breakpoints', zIndex: 'Z-index', motion: 'Motion' };
  for (const [k, fam] of flatFamilies(sys)) {
    L.push(`## ${titles[k]}`, '', ...(fam.note ? [fam.note, ''] : []), '| Token | Value | Usage |', '|---|---|---|', ...fam.tokens.map((t) => `| \`${t.name}\` | ${t.value} | ${t.usage} |`), '');
  }
  if (T.elevation) {
    L.push('## Elevation', '', `| Token | ${ths.join(' | ')} | Usage |`, `|---|${ths.map(() => '---|').join('')}---|`);
    for (const t of T.elevation.tokens) L.push(`| \`${t.name}\` | ${ths.map((th) => '`' + elevationValue(t, th, ths[0]) + '`').join(' | ')} | ${t.usage} |`);
  }
  return L.join('\n') + '\n';
}

/* ---------- references/components.md ---------- */
export function componentsMd(sys, components) {
  const L = [`# ${sys.meta.name} components`, '',
    `Every component exists in two layers: CSS classes \`${sys.meta.classPrefix}*\` (in \`assets/${baseName(sys.meta.files.componentCss)}\`, for any stack) and a React component (\`assets/${sys.id}-react.js\`, \`window.${sys.meta.namespace}\`; types in \`assets/${sys.id}-react.d.ts\`). With another framework, recreate the markup with the same classes and ARIA attributes.`, ''];
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
