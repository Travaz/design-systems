// npm run release [-- <id> ...]  → check (stops on errors), install the skill, update every consumer's copies.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pickSystems, rel, tilde } from './lib/system.mjs';
import { check } from './check.mjs';

const SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');

for (const id of pickSystems(process.argv.slice(2))) {
  const { sys, errors, warnings } = check(id);
  const m = sys.meta;
  if (errors.length) {
    console.log(`\n✖ ${m.name}: ${errors.length} errori, rilascio annullato. Dettagli: npm run check -- ${id}\n`);
    process.exitCode = 1;
    continue;
  }
  console.log(`\n✔ ${m.name} ${m.version} — controlli superati${warnings.filter((w) => !w.startsWith('consumer')).length ? ' (con avvisi: npm run check -- ' + id + ')' : ''}`);
  const out = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'dist', id);

  if (m.skill) {
    const dest = path.join(SKILLS_DIR, m.skill.name);
    fs.rmSync(dest, { recursive: true, force: true });
    fs.cpSync(path.join(out, 'skill', m.skill.name), dest, { recursive: true });
    console.log(`  skill installata   ${tilde(dest)}`);
  }
  for (const c of m.consumers || []) {
    const dir = path.resolve(sys.dir, c.dir);
    if (!fs.existsSync(dir)) { console.log(`  ! ${c.name}: cartella non trovata (${dir})`); continue; }
    for (const [dest, src] of Object.entries(c.copy || {})) {
      fs.mkdirSync(path.dirname(path.join(dir, dest)), { recursive: true });
      fs.copyFileSync(path.join(out, 'package', src), path.join(dir, dest));
    }
    console.log(`  aggiornato          ${c.name} (${Object.keys(c.copy || {}).length} file)`);
  }
  if (m.artifact?.url) console.log(`  da pubblicare      ${rel(path.join(out, 'artifact'))} → ${m.artifact.url}\n                     (chiedi a Claude: "pubblica ${id} sul design system")`);
}
console.log('');
