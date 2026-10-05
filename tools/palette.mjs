// npm run palette -- <#hex> [--name pollen] [--at 400] [--hue-shift -20] [--light #FFFDF8] [--dark #14110D] [--into <id>]
// Prints an 11-step OKLCH scale with what each step can do on your grounds; --into writes it as primitives of a system.
import fs from 'node:fs';
import path from 'node:path';
import { SYSTEMS_DIR, fail, rel } from './lib/system.mjs';
import { scale, roles } from './lib/oklch.mjs';
import { parseColor } from './lib/color.mjs';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const seed = args.find((a) => /^#?[0-9a-f]{3,6}$/i.test(a));
if (!seed) fail('Uso: npm run palette -- "#F7BE16" [--name pollen] [--at 400] [--hue-shift -20] [--light #FFFDF8] [--dark #14110D] [--into apis]');
const hex = seed.startsWith('#') ? seed : `#${seed}`;
if (!parseColor(hex)) fail(`"${seed}" non è un colore esadecimale`);
const name = opt('name', 'color'), light = opt('light', '#FFFFFF'), dark = opt('dark', '#121212');
const steps = scale(hex, { at: opt('at'), hueShift: +opt('hue-shift', 0) });

console.log(`\n${name} da ${hex.toUpperCase()}  (fondo chiaro ${light}, fondo scuro ${dark})\n`);
console.log('  step  hex       L     C     H     su chiaro  su scuro   può fare');
for (const s of steps) {
  const r = roles(s.hex, { light, dark });
  const sw = (() => { const { r: R, g, b } = parseColor(s.hex); return `\x1b[48;2;${R};${g};${b}m    \x1b[0m`; })();
  console.log(`  ${String(s.step).padStart(4)}  ${s.hex}  ${s.L.toFixed(2)}  ${s.C.toFixed(2)}  ${String(Math.round(s.H)).padStart(3)}  ${r.onLight.toFixed(2).padStart(6)}:1  ${r.onDark.toFixed(2).padStart(6)}:1  ${sw} ${r.roles.join(', ')}${s.seed ? '  ← seme' : ''}`);
}

const primitives = Object.fromEntries(steps.map((s) => [`${name}-${s.step}`, {
  value: s.hex,
  usage: `${s.seed ? 'Seed' : 'Generated'} step of ${name} (OKLCH ${s.L.toFixed(3)} ${s.C.toFixed(3)} ${Math.round(s.H)}). ${roles(s.hex, { light, dark }).roles.join(', ') || 'decorative only'}.`,
}]));

const into = opt('into');
if (into) {
  const p = path.join(SYSTEMS_DIR, into, 'tokens.json');
  if (!fs.existsSync(p)) fail(`sistema "${into}" non trovato`);
  const t = JSON.parse(fs.readFileSync(p, 'utf8'));
  const kept = Object.fromEntries(Object.entries(t.color.primitive).filter(([n]) => !n.startsWith(`${name}-`)));
  const replaced = Object.keys(t.color.primitive).filter((n) => n.startsWith(`${name}-`));
  t.color.primitive = { ...kept, ...primitives };
  fs.writeFileSync(p, JSON.stringify(t, null, 2) + '\n');
  if (replaced.length) console.log(`\n! Sostituiti ${replaced.length} primitivi esistenti (${replaced.join(', ')}): i semantici che li usano cambiano colore. Controlla con npm run check -- ${into}.`);
  console.log(`\n✔ ${steps.length} primitivi "${name}-*" scritti in ${rel(p)}. Collega i semantici e lancia npm run check -- ${into}.\n`);
} else {
  console.log(`\nPrimitivi per tokens.json (oppure aggiungi --into <id>):\n${JSON.stringify(primitives, null, 2)}\n`);
}
