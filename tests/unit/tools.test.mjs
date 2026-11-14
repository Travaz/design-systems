// The command-line tools, end to end, on throwaway systems in a temp folder.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
let tmp, env;

function run(tool, ...args) {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'tools', tool), ...args], { env, encoding: 'utf8' });
  return { code: r.status, out: r.stdout + r.stderr };
}
function edit(id, file, fn) {
  const p = path.join(tmp, 'systems', id, file);
  fs.writeFileSync(p, fn(fs.readFileSync(p, 'utf8')));
}
function fresh(id) {
  fs.rmSync(path.join(tmp, 'systems', id), { recursive: true, force: true });
  const r = run('new.mjs', id, 'Fixture');
  assert.equal(r.code, 0, r.out);
}

before(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-test-'));
  env = { ...process.env, DS_SYSTEMS_DIR: path.join(tmp, 'systems'), DS_DIST_DIR: path.join(tmp, 'dist'), DS_SKILLS_DIR: path.join(tmp, 'skills') };
  fs.mkdirSync(env.DS_SYSTEMS_DIR);
});
after(() => fs.rmSync(tmp, { recursive: true, force: true }));

test('a system made from the template passes check', () => {
  fresh('fixture');
  const r = run('check.mjs', 'fixture');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /0 errori/);
});

test('build writes package, skill and artifact with no placeholders left', () => {
  fresh('fixture');
  assert.equal(run('build.mjs', 'fixture').code, 0);
  const d = path.join(tmp, 'dist', 'fixture');
  for (const f of ['package/tokens.css', 'package/tokens.json', 'package/tailwind.css', 'package/fixture.css', 'skill/fixture-design-system/SKILL.md', 'skill/fixture-design-system.zip', 'artifact/project/tokens.json', 'artifact/project/design-system.json']) {
    assert.ok(fs.existsSync(path.join(d, f)), `missing ${f}`);
  }
  assert.doesNotMatch(fs.readFileSync(path.join(d, 'skill/fixture-design-system/SKILL.md'), 'utf8'), /\{\{\w+\}\}/);
});

const breakages = [
  ['a stray closing brace', 'css/{id}.css', (s) => s + '\n}\n', /graffa chiusa in più/],
  ['an unknown token', 'css/{id}.css', (s) => s + '\n.fx-x { color: var(--does-not-exist); }\n', /--does-not-exist non esiste/],
  ['a primitive in component CSS', 'css/{id}.css', (s) => s + '\n.fx-x { color: var(--neutral-500); }\n', /è un primitivo/],
  ['a hand-written colour', 'css/{id}.css', (s) => s + '\n.fx-x { color: #ff0000; }\n', /colore scritto a mano/],
  ['text that fails contrast', 'tokens.json', (s) => s.replace('"ink": { "light": "neutral-900"', '"ink": { "light": "neutral-200"'), /contrasto: ink su surface \(light\)/],
  ['a line-height off the 4pt grid', 'tokens.json', (s) => s.replace('"lineHeight": 24', '"lineHeight": 23'), /non è multipla di 4/],
  ['a computed claim with an unknown token', 'docs/brand-book.md', (s) => s + '\nText reaches {{contrast ink on nowhere}}.\n', /token sconosciuto in \{\{contrast ink on nowhere\}\}/],
  ['a doc naming a token that does not exist', 'docs/brand-book.md', (s) => s + '\nUse `accent-glow` for borders.\n', /`accent-glow` sembra un token ma non esiste/],
  ['a doc naming a class that does not exist', 'docs/brand-book.md', (s) => s + '\nUse the `{id}-nope` class.\n', /non è una classe/],
];
for (const [what, file, mutate, expected] of breakages) {
  test(`check fails on ${what}`, () => {
    fresh('broken');
    edit('broken', file.replace('{id}', 'broken'), (t) => mutate(t).replaceAll('{id}', 'br'));
    const r = run('check.mjs', 'broken');
    assert.equal(r.code, 1, `expected failure, got:\n${r.out}`);
    assert.match(r.out, expected);
  });
}

test('release refuses a failing system and installs nothing', () => {
  fresh('broken');
  edit('broken', 'css/broken.css', (s) => s + '\n}\n');
  const r = run('release.mjs', 'broken');
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /rilascio annullato/);
});

test('release installs the skill into the configured skills folder', () => {
  fresh('fixture');
  const r = run('release.mjs', 'fixture');
  assert.equal(r.code, 0, r.out);
  assert.ok(fs.existsSync(path.join(tmp, 'skills', 'fixture-design-system', 'SKILL.md')));
});

test('new refuses an invalid id and an existing system', () => {
  assert.notEqual(run('new.mjs', 'Bad Id').code, 0);
  fresh('fixture');
  assert.notEqual(run('new.mjs', 'fixture').code, 0);
});

test('build computes contrast claims; a hand-written ratio is flagged', () => {
  fresh('fixture');
  edit('fixture', 'docs/brand-book.md', (s) => s + '\nText reaches {{contrast ink on surface}} and the border 3.2:1.\n');
  const r = run('check.mjs', 'fixture');
  assert.equal(r.code, 0, r.out);
  assert.match(r.out, /scritti a mano \(3\.2:1\)/);
  const book = fs.readFileSync(path.join(tmp, 'dist', 'fixture', 'skill', 'fixture-design-system', 'references', 'brand-book.md'), 'utf8');
  assert.match(book, /Text reaches \d+\.\d:1/);
  assert.doesNotMatch(book, /\{\{contrast/);
});

test('check fails when a component uses a prop its types do not declare', () => {
  fs.rmSync(path.join(tmp, 'systems', 'copy'), { recursive: true, force: true });
  fs.cpSync(path.join(ROOT, 'systems', 'apis'), path.join(tmp, 'systems', 'copy'), { recursive: true });
  edit('copy', 'components/bundle.js', (s) => s.replace("var tone = p.tone || 'neutral';", "var tone = p.tone || p.ghost || 'neutral';"));
  const r = run('check.mjs', 'copy');
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /la prop `ghost` è usata dal componente ma manca nei tipi/);
});

test('palette --into writes primitives that pass check and can be wired to semantics', () => {
  fresh('fixture');
  const r = run('palette.mjs', '#7A5BA6', '--name', 'brand', '--into', 'fixture');
  assert.equal(r.code, 0, r.out);
  const t = JSON.parse(fs.readFileSync(path.join(tmp, 'systems', 'fixture', 'tokens.json'), 'utf8'));
  assert.equal(Object.keys(t.color.primitive).filter((n) => n.startsWith('brand-')).length, 11);
  const c = run('check.mjs', 'fixture');
  assert.equal(c.code, 0, c.out);
  assert.match(c.out, /non usati da nessun semantico: brand-50/); // generated, not yet wired

  // reusing an existing name replaces those primitives and says so
  const again = run('palette.mjs', '#2F5BD3', '--name', 'accent', '--into', 'fixture');
  assert.match(again.out, /Sostituiti 2 primitivi esistenti \(accent-300, accent-600\)/);
});

test('build still produces gallery and artifact where zip is not installed (the Playwright image)', () => {
  fresh('fixture');
  const bin = path.join(tmp, 'bin-nozip');
  fs.mkdirSync(bin, { recursive: true });
  for (const tool of ['git']) { const p = spawnSync('which', [tool], { encoding: 'utf8' }).stdout.trim(); if (p) fs.symlinkSync(p, path.join(bin, tool)); }
  const r = spawnSync(process.execPath, [path.join(ROOT, 'tools', 'build.mjs'), 'fixture'], { env: { ...env, PATH: bin }, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stderr, /zip non disponibile/);
  assert.ok(fs.existsSync(path.join(tmp, 'dist', 'fixture', 'artifact', 'project', 'tokens.json')));
  assert.ok(fs.existsSync(path.join(tmp, 'dist', 'fixture', 'specimen.html')));
});

test('check fails on a skill that would not import (description over 1024 characters, reserved name)', () => {
  fresh('broken');
  edit('broken', 'skill/SKILL.md', (s) => s.replace('UPDATE', 'x'.repeat(1100) + ' UPDATE'));
  let r = run('check.mjs', 'broken');
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /skill: description di \d+ caratteri \(massimo 1024\)/);

  fresh('broken');
  edit('broken', 'system.json', (s) => s.replace('"broken-design-system"', '"claude-broken"'));
  edit('broken', 'skill/SKILL.md', (s) => s.replace(/^name: .*$/m, 'name: claude-broken'));
  r = run('check.mjs', 'broken');
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /parola riservata/);
});

test('export saves <skill>-<version>.zip with the skill folder at its root', () => {
  fresh('fixture');
  const out = path.join(tmp, 'exported');
  const r = run('export.mjs', 'fixture', '--out', out);
  assert.equal(r.code, 0, r.out);
  const version = JSON.parse(fs.readFileSync(path.join(tmp, 'systems', 'fixture', 'system.json'), 'utf8')).version;
  const zip = path.join(out, `fixture-design-system-${version}.zip`);
  assert.ok(fs.existsSync(zip), r.out);
  const list = spawnSync('unzip', ['-Z1', zip], { encoding: 'utf8' }).stdout.split('\n');
  assert.ok(list.includes('fixture-design-system/SKILL.md'), list.join('\n'));
  assert.ok(list.every((f) => !f || f.startsWith('fixture-design-system/')));
});

test('export refuses a failing system and writes nothing', () => {
  fresh('broken');
  edit('broken', 'css/broken.css', (s) => s + '\n}\n');
  const out = path.join(tmp, 'exported-broken');
  const r = run('export.mjs', 'broken', '--out', out);
  assert.equal(r.code, 1, r.out);
  assert.match(r.out, /export annullato/);
  assert.ok(!fs.existsSync(out));
});

test('motion presets import cleanly and take their numbers from the tokens', async () => {
  fs.rmSync(path.join(tmp, 'systems', 'copy'), { recursive: true, force: true });
  fs.cpSync(path.join(ROOT, 'systems', 'apis'), path.join(tmp, 'systems', 'copy'), { recursive: true });
  const r = run('build.mjs', 'copy');
  assert.equal(r.code, 0, r.out);
  const pkg = path.join(tmp, 'dist', 'copy', 'package');
  const tokens = await import(path.join(pkg, 'copy-motion-tokens.js'));
  assert.equal(tokens.duration.fast, 0.12);
  assert.deepEqual(tokens.ease.standard, [0.2, 0, 0, 1]);
  // the presets file imports the tokens module by the name it has in the package
  fs.copyFileSync(path.join(pkg, 'copy-motion-tokens.js'), path.join(pkg, 'apis-motion-tokens.js'));
  const p = await import(path.join(pkg, 'copy-motion-presets.js'));
  assert.equal(p.press.whileTap.scale, tokens.value.pressScale);
  assert.equal(p.spring.bounce, 0);
  assert.equal(p.staggerDelay(9), p.staggerDelay(4), 'at most 5 steps');
  assert.ok(p.exitTransition(0.2).duration < 0.2, 'exits are shorter than entries');
  assert.ok(fs.existsSync(path.join(tmp, 'dist', 'copy', 'skill', 'apis-design-system', 'assets', 'copy-motion-presets.js')));
});
