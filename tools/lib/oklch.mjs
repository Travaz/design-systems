// OKLCH colour scales (Björn Ottosson's OKLab), mapped into the sRGB gamut by reducing chroma.
import { parseColor, contrast } from './color.mjs';

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToOklch(hex) {
  const { r, g, b } = parseColor(hex);
  const [R, G, B] = [r, g, b].map((v) => toLinear(v / 255));
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bb);
  const H = C < 1e-6 ? 0 : ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { L, C, H };
}

function oklchToLinear({ L, C, H }) {
  const a = C * Math.cos((H * Math.PI) / 180), b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb) => rgb.every((v) => v >= -1e-5 && v <= 1 + 1e-5);

/** OKLCH → hex, lowering chroma (never lightness or hue) until the colour fits sRGB. */
export function oklchToHex(c) {
  let lo = 0, hi = c.C, rgb = oklchToLinear(c);
  if (!inGamut(rgb)) {
    for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (inGamut(oklchToLinear({ ...c, C: mid }))) lo = mid; else hi = mid; }
    rgb = oklchToLinear({ ...c, C: lo });
  }
  return '#' + rgb.map((v) => Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, v))))) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
// Lightness ladder in OKLCH L: even perceptual steps, bent so the seed lands exactly on its step.
const LADDER = [0.975, 0.945, 0.89, 0.82, 0.74, 0.66, 0.57, 0.48, 0.39, 0.3, 0.22];

/**
 * A scale of 11 steps from one seed colour. The seed is kept exactly at `at` (default: the step whose
 * lightness is closest). `hueShift` turns the hue by that many degrees toward the darkest step
 * (negative for yellows going amber, as in nature).
 */
export function scale(seedHex, { at, hueShift = 0 } = {}) {
  const seed = hexToOklch(seedHex);
  const k = at !== undefined ? STEPS.indexOf(+at) : LADDER.reduce((best, l, i) => (Math.abs(l - seed.L) < Math.abs(LADDER[best] - seed.L) ? i : best), 0);
  if (k < 0) throw new Error(`step "${at}" non valido: usa uno tra ${STEPS.join(', ')}`);
  const top = Math.max(LADDER[0], seed.L + 0.01), bottom = Math.min(LADDER[LADDER.length - 1], seed.L - 0.01);
  const Ls = LADDER.map((l, i) => {
    if (i === k) return seed.L;
    if (i < k) return top + ((seed.L - top) * (LADDER[0] - l)) / (LADDER[0] - LADDER[k] || 1);
    return seed.L + ((bottom - seed.L) * (LADDER[k] - l)) / (LADDER[k] - LADDER[LADDER.length - 1] || 1);
  });
  return STEPS.map((step, i) => {
    if (i === k) return { step, hex: seedHex.toUpperCase(), ...seed, seed: true };
    const L = Ls[i];
    const span = i < k ? top - seed.L : seed.L - bottom;
    const d = Math.min(1, Math.abs(L - seed.L) / (span || 1));
    const C = seed.C * (1 - 0.75 * d * d);                       // chroma eases off toward the ends
    const H = (seed.H + (i > k ? hueShift * d : 0) + 360) % 360;  // hue turns only on the dark side
    const hex = oklchToHex({ L, C, H });
    return { step, hex, ...hexToOklch(hex) };
  });
}

/** What each step can do on the given light and dark grounds (WCAG 2). */
export function roles(hex, { light = '#FFFFFF', dark = '#121212' } = {}) {
  const onLight = contrast(hex, light), onDark = contrast(hex, dark);
  const blackOn = contrast('#000000', hex), whiteOn = contrast('#FFFFFF', hex);
  const r = [];
  if (onLight >= 4.5) r.push('testo su chiaro'); else if (onLight >= 3) r.push('bordo su chiaro');
  if (onDark >= 4.5) r.push('testo su scuro'); else if (onDark >= 3) r.push('bordo su scuro');
  if (Math.max(blackOn, whiteOn) >= 4.5) r.push(`fondo per testo ${blackOn >= whiteOn ? 'scuro' : 'bianco'}`);
  return { onLight, onDark, roles: r };
}
