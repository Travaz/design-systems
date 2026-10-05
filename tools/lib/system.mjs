// Loading systems and resolving their tokens. Shared by build, check and release.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
// DS_SYSTEMS_DIR / DS_DIST_DIR let tests run the tools on throwaway systems.
export const SYSTEMS_DIR = process.env.DS_SYSTEMS_DIR || path.join(ROOT, 'systems');
export const DIST_DIR = process.env.DS_DIST_DIR || path.join(ROOT, 'dist');
export const SHARED_DOCS = path.join(ROOT, 'shared/docs');
export const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;

export function listSystems() {
  if (!fs.existsSync(SYSTEMS_DIR)) return [];
  return fs.readdirSync(SYSTEMS_DIR).filter((d) => fs.existsSync(path.join(SYSTEMS_DIR, d, 'system.json'))).sort();
}

/** Systems named on the command line, or all of them. Unknown ids stop the run. */
export function pickSystems(args) {
  const all = listSystems();
  const ids = args.filter((a) => !a.startsWith('-'));
  if (!ids.length) return all;
  const unknown = ids.filter((id) => !all.includes(id));
  if (unknown.length) fail(`Sistema sconosciuto: ${unknown.join(', ')}. Disponibili: ${all.join(', ') || 'nessuno'}.`);
  return ids;
}

export function loadSystem(id) {
  const dir = path.join(SYSTEMS_DIR, id);
  const meta = readJson(path.join(dir, 'system.json'));
  const tokens = readJson(path.join(dir, 'tokens.json'));
  const changelog = readIf(path.join(dir, 'CHANGELOG.md'));
  return { id, dir, meta, tokens, changelog, file: (rel) => path.join(dir, rel) };
}

export function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { fail(`Non riesco a leggere ${rel(p)}: ${e.message}`); }
}
export function readIf(p) { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''; }
export function rel(p) { return path.relative(ROOT, p) || '.'; }
export function tilde(p) { return p.startsWith(os.homedir()) ? '~' + p.slice(os.homedir().length) : p; }
export function fail(msg) { console.error(`\n✖ ${msg}\n`); process.exit(1); }

export function writeFile(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}
export function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, dest, { recursive: true, filter: (s) => !path.basename(s).startsWith('.') });
}

/* ---------- token resolution ---------- */

export function themes(sys) { return sys.tokens.themes.map((t) => t.id); }
export function primitives(sys) { return sys.tokens.color.primitive; }
export function semantics(sys) { return sys.tokens.color.semantic; }

/** A semantic value is a primitive name or a literal colour. */
export function isPrimitiveRef(sys, v) { return Object.prototype.hasOwnProperty.call(primitives(sys), v); }

/** Resolve a semantic or primitive colour name to a literal for one theme. */
export function resolveColor(sys, name, theme) {
  const prim = primitives(sys), sem = semantics(sys);
  if (prim[name]) return prim[name].value;
  const s = sem[name];
  if (!s) return null;
  const v = s[theme] ?? s[themes(sys)[0]];
  return isPrimitiveRef(sys, v) ? prim[v].value : v;
}

/** Every flat (non-colour, non-type) family: [familyKey, {note, tokens:[{name,value,usage}]}]. */
export function flatFamilies(sys) {
  return ['spacing', 'radius', 'size', 'aspect', 'breakpoint', 'zIndex', 'motion']
    .filter((k) => sys.tokens[k]).map((k) => [k, sys.tokens[k]]);
}

/** All CSS custom-property names a system defines (without the leading --). */
export function definedVars(sys) {
  const names = new Set([...Object.keys(primitives(sys)), ...Object.keys(semantics(sys))]);
  for (const [, fam] of flatFamilies(sys)) fam.tokens.forEach((t) => names.add(t.name));
  (sys.tokens.elevation?.tokens || []).forEach((t) => names.add(t.name));
  Object.keys(sys.tokens.type.families).forEach((k) => names.add('font-' + k));
  sys.tokens.type.styles.forEach((s) => { names.add('type-' + s.name); names.add('tracking-' + s.name); });
  return names;
}

export function changelogEntries(sys) {
  return sys.changelog.split('\n').filter((l) => l.startsWith('- ')).join('\n');
}

/** Fluid value between the system's fluid range: clamp(min, intercept + slope·vw, max), in rem. */
export function fluid(sys, minPx, maxPx) {
  const r = sys.tokens.type.fluidRange || { min: 360, max: 1280 };
  const slope = (maxPx - minPx) / (r.max - r.min), intercept = minPx - slope * r.min;
  const rem = (n) => `${+(n / 16).toFixed(4)}rem`;
  return `clamp(${rem(minPx)}, ${rem(intercept)} + ${+(slope * 100).toFixed(4)}vw, ${rem(maxPx)})`;
}
/** CSS size and line-height for a type style, fluid when it declares one. */
export function typeSize(sys, s) {
  const rem = (n) => `${+(n / 16).toFixed(4)}rem`;
  if (!s.fluid) return { size: rem(s.size), lineHeight: rem(s.lineHeight) };
  return { size: fluid(sys, s.fluid.size, s.size), lineHeight: fluid(sys, s.fluid.lineHeight, s.lineHeight) };
}

/** Every file under a path (the path itself when it is a file), relative to it. */
export function filesUnder(p) {
  if (!fs.existsSync(p)) return [];
  if (!fs.statSync(p).isDirectory()) return [''];
  return fs.readdirSync(p, { recursive: true }).filter((f) => fs.statSync(path.join(p, f)).isFile() && !path.basename(f).startsWith('.'));
}
