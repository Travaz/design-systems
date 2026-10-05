// npm run build [-- <id> ...]  → dist/<id>/{package, skill, artifact}
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { ROOT, listSystems, pickSystems, loadSystem, DIST_DIR, SHARED_DOCS, writeFile, copyDir, readIf, changelogEntries, tilde, rel } from './lib/system.mjs';
import * as E from './lib/emit.mjs';
import { renderClaims, renderedSystem } from './lib/docs.mjs';
import { specimenHtml, indexHtml } from './lib/specimen.mjs';

// The gallery is offline: React 18 UMD comes from node_modules (npm install) and is copied next to it.
const REACT_UMD = ['react/umd/react.production.min.js', 'react-dom/umd/react-dom.production.min.js'];
function vendorReact(dest) {
  const found = REACT_UMD.map((f) => path.join(ROOT, 'node_modules', f));
  if (!found.every((f) => fs.existsSync(f))) return null; // no dev dependencies installed: no gallery scripts
  fs.mkdirSync(path.join(dest, 'vendor'), { recursive: true });
  return found.map((f) => { fs.copyFileSync(f, path.join(dest, 'vendor', path.basename(f))); return `<script src="vendor/${path.basename(f)}"></script>`; });
}

export function components(sys) {
  const dir = sys.file('components');
  if (!fs.existsSync(dir)) return [];
  const bundle = readIf(sys.file(sys.meta.files?.bundle || 'components/bundle.js'));
  const header = bundle.match(/@ds-bundle:\s*(\{.*?\})\s*\*\//);
  const order = header ? JSON.parse(header[1]).components.map((c) => c.name) : [];
  const names = fs.readdirSync(dir).filter((n) => n !== 'Cover' && fs.existsSync(path.join(dir, n, 'README.md')));
  names.sort((a, b) => ((order.indexOf(a) + 1 || 999) - (order.indexOf(b) + 1 || 999)) || a.localeCompare(b));
  return names.map((name) => ({ name, dir: path.join(dir, name), readme: fs.readFileSync(path.join(dir, name, 'README.md'), 'utf8') }));
}

export function build(id, { quiet = false } = {}) {
  const raw = loadSystem(id);
  const sys = renderedSystem(raw); // token notes with {{contrast …}} computed
  const prose = (text) => renderClaims(raw, text).text;
  const read = (rel) => prose(fs.readFileSync(sys.file(rel), 'utf8'));
  const m = sys.meta, out = path.join(DIST_DIR, id);
  fs.rmSync(out, { recursive: true, force: true });
  const stampCss = `/* ${E.stamp(sys)} */\n`;
  const cssName = E.baseName(m.files.componentCss);
  const comps = components(sys).map((c) => ({ ...c, readme: prose(c.readme) }));

  // 1. package: what sites and apps consume
  const pkg = path.join(out, 'package');
  const files = {
    'tokens.css': E.tokensCss(sys),
    'tokens.json': E.dtcg(sys),
    'tailwind.css': E.tailwind(sys),
    [cssName]: stampCss + fs.readFileSync(sys.file(m.files.componentCss), 'utf8'),
  };
  if (m.files.bundle) files[`${id}-react.js`] = fs.readFileSync(sys.file(m.files.bundle), 'utf8');
  if (m.files.types) files[`${id}-react.d.ts`] = fs.readFileSync(sys.file(m.files.types), 'utf8');
  if (m.files.motion) files[`${id}-motion.js`] = fs.readFileSync(sys.file(m.files.motion), 'utf8');
  for (const [n, c] of Object.entries(files)) writeFile(path.join(pkg, n), c);
  if (m.skill?.assets?.logo) copyDir(sys.file(m.skill.assets.logo), path.join(pkg, 'logo'));
  if (m.files.fonts) copyDir(sys.file(m.files.fonts), path.join(pkg, 'fonts'));
  writeFile(path.join(pkg, 'package.json'), JSON.stringify({ name: `@travaz/${id}`, version: m.version, description: m.description, files: ['*'], style: cssName }, null, 2) + '\n');

  // 2. skill: the folder Claude reads
  if (m.skill) {
    const sk = path.join(out, 'skill', m.skill.name);
    writeFile(path.join(sk, 'SKILL.md'), E.renderTemplate(read(m.skill.template), {
      version: m.version, artifactUrl: m.artifact?.url || '(non pubblicato)', sourceDir: tilde(sys.dir), changelog: changelogEntries(sys),
    }));
    writeFile(path.join(sk, 'references/brand-book.md'), read(m.files.brandBook));
    writeFile(path.join(sk, 'references/tokens.md'), E.tokensMd(sys));
    if (comps.length) writeFile(path.join(sk, 'references/components.md'), E.componentsMd(sys, comps));
    for (const d of m.skill.sharedDocs || []) writeFile(path.join(sk, 'references', d), fs.readFileSync(path.join(SHARED_DOCS, d), 'utf8'));
    for (const [n, c] of Object.entries(files)) writeFile(path.join(sk, 'assets', n), c);
    for (const [k, src] of Object.entries(m.skill.assets || {})) copyDir(sys.file(src), path.join(sk, 'assets', k));
    if (m.files.fonts) copyDir(sys.file(m.files.fonts), path.join(sk, 'assets', 'fonts'));
    execFileSync('zip', ['-rqX', path.join(out, 'skill', `${m.skill.name}.zip`), m.skill.name, '-x', '*.DS_Store'], { cwd: path.join(out, 'skill') });
  }

  // 3. artifact: the files of the published Design System page
  const art = path.join(out, 'artifact', 'project');
  const artFiles = {
    'README.md': read(m.files.brandBook),
    'tokens.json': E.artifactTokens(sys),
    'components/bundle.css': stampCss + fs.readFileSync(sys.file(m.files.componentCss), 'utf8'),
  };
  if (m.files.bundle) artFiles['components/bundle.js'] = fs.readFileSync(sys.file(m.files.bundle), 'utf8');
  if (m.files.types) artFiles['components/index.d.ts'] = fs.readFileSync(sys.file(m.files.types), 'utf8');
  const compDir = sys.file('components');
  if (fs.existsSync(compDir)) for (const c of fs.readdirSync(compDir)) {
    for (const f of ['README.md', 'preview.html']) { const p = path.join(compDir, c, f); if (fs.existsSync(p)) artFiles[`components/${c}/${f}`] = f === 'README.md' ? prose(fs.readFileSync(p, 'utf8')) : fs.readFileSync(p, 'utf8'); }
  }
  for (const [g, v] of Object.entries(m.artifact?.assetGroups || {})) if (v.readme) artFiles[`assets/${g}/README.md`] = read(v.readme);
  for (const [n, c] of Object.entries(artFiles)) writeFile(path.join(art, n), c);
  if (m.files.fonts) {
    // only the files the page declares (see artifactTokens): latin subsets
    const fontFiles = JSON.parse(artFiles['tokens.json']).type.fonts.map((f) => path.basename(f.file));
    fs.mkdirSync(path.join(art, 'fonts'), { recursive: true });
    for (const f of fontFiles) fs.copyFileSync(path.join(sys.file(m.files.fonts), f), path.join(art, 'fonts', f));
  }
  writeFile(path.join(art, 'design-system.json'), E.artifactIndex(sys, new Date().toISOString().replace(/\.\d+Z$/, 'Z')));

  // 4. gallery: one page per component preview, wired to the package, for visual tests and manual review
  const gallery = path.join(out, 'gallery');
  const pages = [];
  if (fs.existsSync(compDir)) {
    const head = [
      `<link rel="stylesheet" href="../package/tokens.css">`,
      `<link rel="stylesheet" href="../package/${cssName}">`,
      ...(files[`${id}-react.js`] ? [...(vendorReact(gallery) || []), `<script src="../package/${id}-react.js"></script>`] : []),
    ].join('\n');
    for (const c of fs.readdirSync(compDir).sort()) {
      const p = path.join(compDir, c, 'preview.html');
      if (!fs.existsSync(p)) continue;
      const html = fs.readFileSync(p, 'utf8');
      if (!/<head>/i.test(html)) continue;
      writeFile(path.join(gallery, `${c}.html`), html.replace(/<head>/i, `<head>\n${head}`));
      pages.push(c);
    }
    writeFile(path.join(gallery, 'index.html'), `<!doctype html><meta charset="utf-8"><title>${m.name} ${m.version}</title><link rel="stylesheet" href="../package/tokens.css"><body style="font-family:var(--font-sans);background:var(--surface);color:var(--ink);padding:24px"><h1>${m.name} ${m.version}</h1><ul>${pages.map((c) => `<li><a href="${c}.html">${c}</a></li>`).join('')}</ul>`);
    writeFile(path.join(gallery, 'pages.json'), JSON.stringify(pages) + '\n');
  }

  // 5. specimen: colours, contrast, type, space and shape on one page
  writeFile(path.join(out, 'specimen.html'), specimenHtml(sys, { cssName }));

  if (!quiet) {
    console.log(`✔ ${m.name} ${m.version}`);
    console.log(`  package   ${rel(pkg)}  (${Object.keys(files).length} file${m.skill?.assets?.logo ? ' + logo' : ''})`);
    if (m.skill) console.log(`  skill     ${rel(path.join(out, 'skill', m.skill.name))}  + .zip`);
    console.log(`  artifact  ${rel(art)}  (${Object.keys(artFiles).length + 1} file)`);
    if (pages.length) console.log(`  gallery   ${rel(gallery)}  (${pages.length} pagine)`);
    console.log(`  specimen  ${rel(path.join(out, 'specimen.html'))}`);
  }
  return { sys: raw, rendered: sys, out, pkg }; // raw: the sources as written, for checks
}

/** dist/index.html: every system of the collection with its colours and links. */
export function buildIndex() {
  writeFile(path.join(DIST_DIR, 'index.html'), indexHtml(listSystems().map((id) => renderedSystem(loadSystem(id)))));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const id of pickSystems(process.argv.slice(2))) build(id);
  buildIndex();
  console.log(`  indice    ${rel(path.join(DIST_DIR, 'index.html'))}`);
}
