// Pure functions: contrast maths, fluid type, generated CSS.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrast, parseColor } from '../../tools/lib/color.mjs';
import { fluid, typeSize, loadSystem, listSystems, semantics, themes } from '../../tools/lib/system.mjs';
import { tokensCss, dtcg, artifactTokens, tailwind } from '../../tools/lib/emit.mjs';
import { renderClaims } from '../../tools/lib/docs.mjs';
import { hexToOklch, oklchToHex, scale, roles, STEPS } from '../../tools/lib/oklch.mjs';

test('contrast: WCAG reference values', () => {
  assert.equal(contrast('#000000', '#FFFFFF').toFixed(2), '21.00');
  assert.equal(contrast('#777', '#777'), 1);
  assert.equal(contrast('#767676', '#FFFFFF').toFixed(2), '4.54'); // the classic AA threshold grey
  assert.equal(contrast('#FFF', '#000'), contrast('#000', '#FFF'));
});

test('contrast: translucent colours are composited, unknown colours return null', () => {
  const half = contrast('rgba(0, 0, 0, 0.5)', '#FFFFFF');
  assert.ok(half > 3 && half < 5, `got ${half}`);
  assert.equal(contrast('var(--x)', '#FFF'), null);
  assert.deepEqual(parseColor('#abc'), { r: 170, g: 187, b: 204, a: 1 });
});

test('fluid: clamp hits both ends of the range', () => {
  const sys = { tokens: { type: { fluidRange: { min: 360, max: 1280 } } } };
  const css = fluid(sys, 48, 88);
  const [, min, intercept, slope, max] = css.match(/clamp\(([\d.]+)rem, ([-\d.]+)rem \+ ([\d.]+)vw, ([\d.]+)rem\)/).map(Number);
  const px = (vw) => Math.min(max * 16, Math.max(min * 16, intercept * 16 + (slope * vw) / 100));
  assert.equal(min * 16, 48);
  assert.equal(max * 16, 88);
  assert.ok(Math.abs(px(360) - 48) < 0.01, `360px → ${px(360)}`);
  assert.ok(Math.abs(px(1280) - 88) < 0.01, `1280px → ${px(1280)}`);
  assert.ok(px(800) > 48 && px(800) < 88);
  assert.deepEqual(typeSize(sys, { size: 16, lineHeight: 24 }), { size: '1rem', lineHeight: '1.5rem' });
});

test('renderClaims: lowest ratio across pairs and themes, floored, never rounded up', () => {
  const sys = { tokens: { themes: [{ id: 'light' }, { id: 'dark' }], color: {
    primitive: { black: { value: '#000000' }, white: { value: '#FFFFFF' }, grey: { value: '#767676' } },
    semantic: { ink: { light: 'black', dark: 'white' }, bg: { light: 'white', dark: 'grey' } } } } };
  assert.equal(renderClaims(sys, '{{contrast ink on bg light}}').text, '21.0:1');
  assert.equal(renderClaims(sys, '{{contrast ink on bg}}').text, '4.5:1'); // dark: white on #767676 = 4.54
  assert.equal(renderClaims(sys, 'x {{contrast ink on nope}}').errors.length, 1);
});

test('oklch: hex round-trips and known values', () => {
  for (const h of ['#F7BE16', '#1A1612', '#2F55A4', '#FFFFFF', '#000000', '#7A5BA6']) assert.equal(oklchToHex(hexToOklch(h)), h);
  const white = hexToOklch('#FFFFFF');
  assert.ok(Math.abs(white.L - 1) < 1e-3 && white.C < 1e-3);
});

test('palette: 11 valid steps, lightness strictly decreasing, seed kept exactly', () => {
  for (const [seed, at] of [['#F7BE16', 400], ['#2F55A4', undefined], ['#3D6B1F', 600], ['#EEEEEE', undefined]]) {
    const s = scale(seed, { at, hueShift: -20 });
    assert.deepEqual(s.map((x) => x.step), STEPS);
    s.forEach((x) => assert.match(x.hex, /^#[0-9A-F]{6}$/));
    for (let i = 1; i < s.length; i++) assert.ok(s[i].L < s[i - 1].L, `${seed}: step ${s[i].step} not darker than ${s[i - 1].step}`);
    assert.ok(s.some((x) => x.seed && x.hex === seed.toUpperCase()), `${seed} kept`);
    if (at) assert.equal(s.find((x) => x.seed).step, at);
  }
  assert.throws(() => scale('#F7BE16', { at: 450 }));
});

test('palette: roles follow WCAG thresholds', () => {
  assert.deepEqual(roles('#000000').roles, ['testo su chiaro', 'fondo per testo bianco']); // 1.1:1 on #121212: not even a border
  assert.deepEqual(roles('#FFFFFF').roles, ['testo su scuro', 'fondo per testo scuro']);
  assert.ok(roles('#767676').roles.includes('testo su chiaro'));
  assert.ok(!roles('#777777').roles.includes('testo su chiaro'));
});

for (const id of listSystems()) {
  const sys = loadSystem(id);

  test(`${id}: tokens.css defines every semantic token in every theme`, () => {
    const css = tokensCss(sys);
    for (const name of Object.keys(semantics(sys))) {
      const count = css.split(`--${name}:`).length - 1;
      const expected = 1 + (themes(sys).length - 1) * (themes(sys).includes('dark') ? 2 : 1);
      assert.equal(count, expected, `--${name} appears ${count} times, expected ${expected}`);
    }
    assert.equal((css.match(/{/g) || []).length, (css.match(/}/g) || []).length, 'balanced braces');
  });

  test(`${id}: fonts are self-hosted, one @font-face per declared file`, () => {
    const css = tokensCss(sys), fonts = sys.tokens.type.fonts || [];
    assert.equal((css.match(/@font-face/g) || []).length, fonts.length);
    for (const f of fonts) assert.ok(css.includes(`url("${f.file}")`), f.file);
    assert.doesNotMatch(css, /googleapis|gstatic/);
  });

  test(`${id}: every output parses and keeps unique names`, () => {
    const d = JSON.parse(dtcg(sys));
    assert.ok(d.primitive.color && d.semantic[themes(sys)[0]]);
    const a = JSON.parse(artifactTokens(sys));
    const names = a.color.tokens.map((t) => t.name);
    assert.equal(new Set(names).size, names.length);
    assert.match(tailwind(sys), /@theme inline \{[\s\S]*\}\n$/);
  });
}
