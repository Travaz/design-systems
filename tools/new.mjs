// npm run new -- <id> "<Name>"  → systems/<id>/ from templates/system, ready to pass `npm run check`.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SYSTEMS_DIR, fail, rel } from './lib/system.mjs';

const [id, ...nameParts] = process.argv.slice(2);
const Name = nameParts.join(' ').trim() || (id ? id[0].toUpperCase() + id.slice(1) : '');
if (!id || !/^[a-z][a-z0-9-]{1,31}$/.test(id)) fail('Uso: npm run new -- <id> "<Nome>"   (id: minuscole, cifre e trattini, es. "tundra")');
const dest = path.join(SYSTEMS_DIR, id);
if (fs.existsSync(dest)) fail(`${rel(dest)} esiste già.`);

const vars = {
  id, Name,
  Namespace: Name.replace(/[^A-Za-z0-9]+(.)?/g, (m, c) => (c ? c.toUpperCase() : '')).replace(/^./, (c) => c.toUpperCase()),
  prefix: id.slice(0, 2) + '-',
  date: new Date().toISOString().slice(0, 10),
};
const fill = (s) => s.replace(/\{\{(id|Name|Namespace|prefix|date)\}\}/g, (m, k) => vars[k]);

fs.cpSync(path.join(ROOT, 'templates/system'), dest, { recursive: true });
fs.renameSync(path.join(dest, 'css/system.css'), path.join(dest, `css/${id}.css`));
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(json|md|css|html|js)$/.test(f)) fs.writeFileSync(p, fill(fs.readFileSync(p, 'utf8')));
  }
})(dest);

console.log(`\n✔ Creato ${Name} in ${rel(dest)}
  Prossimi passi:
  1. Scegli la palette in tokens.json (gli "accent" sono segnaposto) e i caratteri.
  2. Scrivi docs/brand-book.md e aggiorna la descrizione in skill/SKILL.md.
  3. npm run check -- ${id}
  4. npm run release -- ${id}   (installa la skill ${id}-design-system)\n`);
