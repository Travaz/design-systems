// npm run check [-- <id> ...]  → builds, then verifies tokens, contrast, grid, CSS usage, components and consumers.
import fs from 'node:fs';
import path from 'node:path';
import { filesUnder, pickSystems, NAME_RE, themes, primitives, semantics, isPrimitiveRef, resolveColor, flatFamilies, definedVars, rel } from './lib/system.mjs';
import { parseColor, contrast } from './lib/color.mjs';
import { build, components } from './build.mjs';
import { proseSources, renderClaims, lintReferences, lintProps } from './lib/docs.mjs';

export function check(id) {
  const { sys, pkg } = build(id, { quiet: true });
  const errors = [], warnings = [];
  const E = (where, msg) => errors.push(`${where}: ${msg}`);
  const W = (where, msg) => warnings.push(`${where}: ${msg}`);
  const T = sys.tokens, ths = themes(sys), prim = primitives(sys), sem = semantics(sys);
  const vars = definedVars(sys);
  let pairsChecked = 0;

  /* 1. names, values, usage notes */
  const seen = new Map();
  const claim = (name, fam) => {
    if (!NAME_RE.test(name)) E(`tokens.json ${fam}`, `nome non valido "${name}"`);
    if (seen.has(name)) E(`tokens.json ${fam}`, `"${name}" esiste già in ${seen.get(name)}`);
    seen.set(name, fam);
  };
  for (const [n, p] of Object.entries(prim)) {
    claim(n, 'primitive');
    if (!parseColor(p.value)) E('tokens.json primitive', `${n}: "${p.value}" non è un colore hex o rgb()`);
    if (!p.usage) W('tokens.json primitive', `${n} senza nota d'uso`);
  }
  for (const [n, s] of Object.entries(sem)) {
    claim(n, 'semantic');
    if (!s.usage) E('tokens.json semantic', `${n} senza nota d'uso`);
    for (const t of ths) {
      const v = s[t];
      if (v === undefined) { E('tokens.json semantic', `${n} non ha un valore per il tema "${t}"`); continue; }
      if (!isPrimitiveRef(sys, v) && !parseColor(v)) E('tokens.json semantic', `${n} (${t}): "${v}" non è un primitivo né un colore`);
    }
  }
  for (const [k, fam] of flatFamilies(sys)) for (const t of fam.tokens) { claim(t.name, k); if (!t.usage) W(`tokens.json ${k}`, `${t.name} senza nota d'uso`); }
  for (const t of T.elevation?.tokens || []) claim(t.name, 'elevation');
  const unusedPrim = Object.keys(prim).filter((p) => !Object.values(sem).some((s) => ths.some((t) => s[t] === p)));
  if (unusedPrim.length) W('tokens.json primitive', `non usati da nessun semantico: ${unusedPrim.join(', ')}`);

  /* 2. contrast, every declared pair in every theme */
  for (const rule of T.contrast || []) {
    for (const t of ths) for (const fg of [].concat(rule.fg)) for (const bg of [].concat(rule.bg)) {
      const a = resolveColor(sys, fg, t), b = resolveColor(sys, bg, t);
      if (!a || !b) { E('tokens.json contrast', `coppia ${fg} su ${bg}: token sconosciuto`); continue; }
      const r = contrast(a, b); pairsChecked++;
      if (r === null) W('tokens.json contrast', `${fg} su ${bg} (${t}): colore non misurabile`);
      else if (r + 1e-9 < rule.min) E('contrasto', `${fg} su ${bg} (${t}) = ${r.toFixed(2)}:1, serve ${rule.min}:1`);
    }
  }

  /* 3. grid: line-heights on the 4pt baseline, spacing on the 4pt/8pt grid */
  for (const s of T.type.styles) {
    if (s.lineHeight % 4) E('tokens.json type', `${s.name}: interlinea ${s.lineHeight}px non è multipla di 4`);
    if (s.fluid) {
      if (s.fluid.lineHeight % 4) E('tokens.json type', `${s.name}: interlinea fluida minima ${s.fluid.lineHeight}px non è multipla di 4`);
      if (s.fluid.size >= s.size) E('tokens.json type', `${s.name}: la dimensione fluida minima (${s.fluid.size}) deve essere minore di quella massima (${s.size})`);
      if (s.fluid.lineHeight < s.fluid.size) W('tokens.json type', `${s.name}: interlinea minore della dimensione a ${s.fluid.size}px`);
    }
    if (!vars.has('font-' + s.family) && !T.type.families[s.family]) E('tokens.json type', `${s.name}: famiglia "${s.family}" non definita`);
  }
  for (const t of T.spacing?.tokens || []) { const v = parseFloat(t.value); if (/px$/.test(t.value) && v % 4) E('tokens.json spacing', `${t.name} = ${t.value} non è sulla griglia da 4`); }
  for (const t of T.size?.tokens || []) { const v = parseFloat(t.value); if (/px$/.test(t.value) && v % 4) W('tokens.json size', `${t.name} = ${t.value} non è sulla griglia da 4`); }

  /* 3b. fonts: every declared file exists; nothing loads from a remote font service */
  for (const f of T.type.fonts || []) if (!fs.existsSync(sys.file(f.file))) E('tokens.json type.fonts', `${f.family}: file mancante ${f.file}`);
  if ((T.type.fonts || []).length && sys.meta.files.fonts && !fs.readdirSync(sys.file(sys.meta.files.fonts)).some((f) => /^OFL|LICEN[CS]E/i.test(f))) W('fonts', 'nessun file di licenza accanto ai caratteri');

  /* 4. component CSS: only defined tokens, never primitives, no literal colours */
  const cssPath = sys.file(sys.meta.files.componentCss);
  lintCss(fs.readFileSync(cssPath, 'utf8'), rel(cssPath), { vars, prim, strict: true }, E, W);
  if (/fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit/.test(fs.readFileSync(cssPath, 'utf8'))) E(rel(cssPath), 'carica caratteri da un servizio esterno: includili in fonts/');

  /* 5. components: docs and previews present, bundle header matches folders */
  const comps = components(sys);
  for (const c of comps) {
    if (!fs.existsSync(path.join(c.dir, 'preview.html'))) W(`components/${c.name}`, 'manca preview.html');
    if (!/^# /.test(c.readme)) W(`components/${c.name}/README.md`, 'deve iniziare con "# Nome"');
    if (!/Scopo/.test(c.readme)) W(`components/${c.name}/README.md`, 'manca la frase di scopo');
  }
  const bundle = sys.meta.files.bundle ? fs.readFileSync(sys.file(sys.meta.files.bundle), 'utf8') : '';
  const header = bundle.match(/@ds-bundle:\s*(\{.*?\})\s*\*\//);
  if (header) for (const c of JSON.parse(header[1]).components) if (!comps.some((x) => x.name === c.name)) W('components/bundle.js', `${c.name} non ha una cartella con README`);
  if (/<\/script|<!--/.test(bundle)) E('components/bundle.js', 'contiene "</script" o "<!--": rompe chi lo incorpora inline');
  if (!fs.existsSync(sys.file('components/Cover/preview.html')) && sys.meta.artifact) W('components/Cover', 'manca la copertina del design system');

  /* 6. release hygiene */
  const firstEntry = (sys.changelog.match(/^- .*?· ([\d.]+) ·/m) || [])[1];
  if (firstEntry !== sys.meta.version) W('CHANGELOG.md', `la prima voce è ${firstEntry || 'assente'}, ma system.json dice ${sys.meta.version}`);

  /* 7. documentation: computed claims resolve, named tokens and classes exist, props agree */
  for (const [label, text] of proseSources(sys)) {
    renderClaims(sys, text, label).errors.forEach((e) => E('documentazione', e));
    lintReferences(sys, label, text).forEach((p) => E('documentazione', p));
    const hand = [...text.matchAll(/(?<![\d.])(\d{1,2}(?:\.\d+)?):1\b/g)].map((x) => +x[1]).filter((n) => ![3, 4.5, 7].includes(n));
    if (hand.length) W('documentazione', `${label}: rapporti di contrasto scritti a mano (${hand.map((n) => n + ':1').join(', ')}); usa {{contrast fg on bg}}`);
  }
  lintProps(sys, Object.fromEntries(comps.map((c) => [c.name, c.readme]))).forEach((p) => E('componenti', p));

  /* 8. consumers: copies in sync with this build, their CSS uses only real tokens */
  for (const c of sys.meta.consumers || []) {
    const dir = path.resolve(sys.dir, c.dir);
    if (!fs.existsSync(dir)) { W(`consumer ${c.name}`, `cartella non trovata: ${dir}`); continue; }
    for (const [dest, src] of Object.entries(c.copy || {})) {
      for (const f of filesUnder(path.join(pkg, src))) {
        const d = path.join(dir, dest, f), s = path.join(pkg, src, f), name = path.join(dest, f);
        if (!fs.existsSync(d)) W(`consumer ${c.name}`, `${name} manca: esegui npm run release -- ${sys.id}`);
        else if (!fs.readFileSync(d).equals(fs.readFileSync(s))) W(`consumer ${c.name}`, `${name} non è allineato a ${sys.meta.version}: esegui npm run release -- ${sys.id}`);
      }
    }
    for (const f of c.lint || []) {
      const p = path.join(dir, f);
      if (fs.existsSync(p)) lintCss(fs.readFileSync(p, 'utf8'), `${c.name} › ${f}`, { vars, prim, strict: false }, E, W);
    }
  }
  return { sys, errors, warnings, pairsChecked };
}

/** strict = the system's own component CSS. Consumers may use literals and primitives sparingly, but never unknown tokens. */
function lintCss(css, where, { vars, prim, strict }, E, W) {
  // brace balance: a stray } makes browsers drop the next rule silently
  let depth = 0;
  css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, '""').split('\n').forEach((line, i) => {
    for (const ch of line) {
      if (ch === '{') depth++;
      else if (ch === '}' && --depth < 0) { E(`${where}:${i + 1}`, 'parentesi graffa chiusa in più: il browser ignorerà la regola successiva'); depth = 0; }
    }
  });
  if (depth > 0) E(where, `${depth} parentesi graffe non chiuse`);
  const declared = new Set([...css.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)].map((m) => m[1].slice(2)));
  const allowed = new Set((css.match(/ds-lint allow:([^*]*)\*\//) || ['', ''])[1].trim().split(/\s+/).filter(Boolean).map((v) => v.replace(/^--/, '')));
  css.split('\n').forEach((line, i) => {
    const at = `${where}:${i + 1}`;
    for (const m of line.matchAll(/var\(\s*--([A-Za-z0-9_.-]+)\s*(,)?/g)) {
      const name = m[1], hasFallback = !!m[2];
      if (prim[name] && strict) E(at, `--${name} è un primitivo: usa un token semantico o di componente`);
      if (vars.has(name) || declared.has(name) || allowed.has(name)) continue;
      if (hasFallback) W(at, `--${name} non esiste nel sistema (vale solo il fallback)`);
      else E(at, `--${name} non esiste nel sistema`);
    }
    if (strict && !/lint-allow-literal|@import/.test(line)) {
      const code = line.replace(/\/\*.*?\*\//g, '');
      const lit = code.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/);
      if (lit) E(at, `colore scritto a mano "${lit[0]}…": usa un token`);
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let failed = false;
  for (const id of pickSystems(process.argv.slice(2))) {
    const { sys, errors, warnings, pairsChecked } = check(id);
    console.log(`\n${errors.length ? '✖' : '✔'} ${sys.meta.name} ${sys.meta.version} — ${pairsChecked} coppie di contrasto verificate, ${errors.length} errori, ${warnings.length} avvisi`);
    errors.forEach((e) => console.log(`  ✖ ${e}`));
    warnings.forEach((w) => console.log(`  ! ${w}`));
    failed ||= errors.length > 0;
  }
  console.log('');
  process.exit(failed ? 1 : 0);
}
