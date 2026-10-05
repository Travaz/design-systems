// Documentation that cannot lie: measured values are computed at build time, names are checked against the system.
import fs from 'node:fs';
import path from 'node:path';
import { themes, resolveColor, definedVars, primitives } from './system.mjs';
import { contrast } from './color.mjs';

/* ---------- {{contrast <fg>[,<fg>…] on <bg>[,<bg>…] [<theme>]}} → the lowest ratio, floored to 0.1 ---------- */
const CLAIM = /\{\{\s*contrast\s+([\w.,-]+)\s+on\s+([\w.,-]+)(?:\s+(\w+))?\s*\}\}/g;

export function renderClaims(sys, text, where = '') {
  const errors = [];
  const out = String(text).replace(CLAIM, (m, fgs, bgs, theme) => {
    const ths = theme ? [theme] : themes(sys);
    if (theme && !themes(sys).includes(theme)) { errors.push(`${where}: tema sconosciuto "${theme}" in ${m}`); return m; }
    let min = Infinity;
    for (const t of ths) for (const fg of fgs.split(',')) for (const bg of bgs.split(',')) {
      const a = resolveColor(sys, fg, t), b = resolveColor(sys, bg, t);
      if (!a || !b) { errors.push(`${where}: token sconosciuto in ${m}`); return m; }
      min = Math.min(min, contrast(a, b));
    }
    return `${(Math.floor(min * 10) / 10).toFixed(1)}:1`;
  });
  return { text: out, errors };
}

/** A copy of the system whose token usage notes have their claims rendered. */
export function renderedSystem(sys) {
  const tokens = structuredClone(sys.tokens);
  const visit = (o) => {
    if (Array.isArray(o)) o.forEach(visit);
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) {
      if (k === 'usage' || k === 'note') o[k] = renderClaims(sys, v).text; else visit(v);
    }
  };
  visit(tokens);
  return { ...sys, tokens };
}

/** Every piece of prose a system ships: [label, text]. */
export function proseSources(sys) {
  const out = [];
  const add = (rel) => { const p = sys.file(rel); if (fs.existsSync(p)) out.push([rel, fs.readFileSync(p, 'utf8')]); };
  add(sys.meta.files.brandBook);
  if (sys.meta.skill?.template) add(sys.meta.skill.template);
  const comps = sys.file('components');
  if (fs.existsSync(comps)) for (const c of fs.readdirSync(comps).sort()) add(`components/${c}/README.md`);
  for (const g of Object.values(sys.meta.artifact?.assetGroups || {})) if (g.readme) add(g.readme);
  const notes = [];
  const visit = (o, at) => {
    if (Array.isArray(o)) o.forEach((x, i) => visit(x, `${at}[${x?.name ?? i}]`));
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) {
      if ((k === 'usage' || k === 'note') && typeof v === 'string') notes.push([`tokens.json ${at}`, v]); else visit(v, at ? `${at}.${k}` : k);
    }
  };
  visit(sys.tokens, '');
  return [...out, ...notes];
}

/* ---------- names in backticks must exist ---------- */
export function knownNames(sys) {
  const vars = definedVars(sys);
  const css = fs.readFileSync(sys.file(sys.meta.files.componentCss), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const classes = new Set([...css.matchAll(/\.([a-z][\w-]*)/g)].map((m) => m[1]));
  const attrs = new Set([...css.matchAll(/\[([a-z][\w-]*)/g)].map((m) => m[1]));
  const componentVars = new Set([...css.matchAll(/--([\w-]+)\s*:/g)].map((m) => m[1]));
  const styles = new Set(sys.tokens.type.styles.map((s) => s.name));
  const names = new Set([...vars, ...componentVars, ...styles]);
  const stems = new Set([...names].filter((n) => n.includes('-')).map((n) => n.split('-')[0]));
  return { names, classes, attrs, stems, prefix: sys.meta.classPrefix || '' };
}

/** Returns problems for backticked identifiers that look like this system's tokens or classes but do not exist.
 *  `pollen-*` and `ap-` are patterns: at least one real name must start with them. `--x` is a CSS variable. */
export function lintReferences(sys, label, text) {
  const k = knownNames(sys), problems = [];
  const css = fs.readFileSync(sys.file(sys.meta.files.componentCss), 'utf8');
  const runtime = new Set((css.match(/ds-lint allow:([^*]*)\*\//) || ['', ''])[1].trim().split(/\s+/).filter(Boolean).map((v) => v.replace(/^--/, '')));
  const all = [...k.names, ...k.classes, ...k.attrs];
  for (const m of String(text).matchAll(/`([^`\s]+)`/g)) {
    const raw = m[1];
    const isVar = raw.startsWith('--');
    let id = raw.replace(/^\.|^--/, '');
    const pattern = /^[a-z][a-z0-9-]*-(\*|…)?$/.test(id) || /\*$/.test(id);
    if (/[{}|<>(),:=]/.test(id)) id = id.split(/[{}|<>(),:=]/)[0];
    id = id.replace(/[*…]+$/, '').replace(/[.;]$/, '');
    if (!/^[a-z][a-z0-9-]*$/.test(id) || !id.includes('-')) continue;
    const ours = (k.prefix && id.startsWith(k.prefix)) || k.stems.has(id.split('-')[0]);
    if (!ours && !isVar) continue;
    if (pattern) { if (!all.some((n) => n.startsWith(id))) problems.push(`${label}: \`${raw}\` non corrisponde a nessun nome di ${sys.meta.name}`); continue; }
    if (isVar) { if (!k.names.has(id) && !runtime.has(id)) problems.push(`${label}: \`${raw}\` non è una variabile di ${sys.meta.name}`); continue; }
    if (k.prefix && id.startsWith(k.prefix)) { if (!k.classes.has(id) && !k.attrs.has(id)) problems.push(`${label}: \`${raw}\` non è una classe di ${sys.meta.name}`); }
    else if (!k.names.has(id)) problems.push(`${label}: \`${raw}\` sembra un token ma non esiste`);
  }
  return problems;
}

/* ---------- component props: types, implementation and docs agree ---------- */
const HTML_PROPS = new Set(['children', 'className', 'id', 'disabled', 'required', 'onChange', 'onClick', 'checked', 'defaultChecked', 'href', 'value', 'type', 'name', 'placeholder']);

export function lintProps(sys, componentReadmes) {
  const problems = [];
  if (!sys.meta.files.types || !sys.meta.files.bundle) return problems;
  const dts = fs.readFileSync(sys.file(sys.meta.files.types), 'utf8');
  const bundle = fs.readFileSync(sys.file(sys.meta.files.bundle), 'utf8');
  const fns = {};
  const re = /function ([A-Z]\w*)\(p\)\s*\{/g;
  let m, last = null;
  while ((m = re.exec(bundle))) { if (last) fns[last.name].end = m.index; last = { name: m[1] }; fns[m[1]] = { start: m.index, end: bundle.length }; }
  for (const im of dts.matchAll(/export interface (\w+)Props(?:<[^>]*>)?(?: extends [^{]+)?\s*\{([^}]*)\}/g)) {
    const comp = im[1];
    if (!fns[comp]) continue;
    const declared = new Set([...im[2].matchAll(/(\w+)\??\s*:/g)].map((x) => x[1]));
    const body = bundle.slice(fns[comp].start, fns[comp].end);
    const used = new Set([...body.matchAll(/\bp\.(\w+)/g)].map((x) => x[1]));
    const omitted = new Set([...(body.match(/omit\(p, \[([^\]]*)\]/)?.[1] || '').matchAll(/'(\w+)'/g)].map((x) => x[1]));
    for (const d of declared) if (!used.has(d) && !omitted.has(d)) problems.push(`${comp}: la prop \`${d}\` è nei tipi ma il componente non la usa`);
    for (const u of new Set([...used, ...omitted])) if (!declared.has(u) && !HTML_PROPS.has(u)) problems.push(`${comp}: la prop \`${u}\` è usata dal componente ma manca nei tipi`);
    const readme = componentReadmes[comp];
    if (readme) for (const d of declared) if (!HTML_PROPS.has(d) && !readme.includes('`' + d + '`')) problems.push(`components/${comp}/README.md: la prop \`${d}\` non è documentata`);
  }
  return problems;
}
