// npm run export [-- <id> ...] [--out <dir>]  → check, then save each skill as <skill>-<version>.zip, ready to import elsewhere.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pickSystems, DIST_DIR, tilde } from './lib/system.mjs';
import { check } from './check.mjs';

const args = process.argv.slice(2);
const at = args.indexOf('--out');
const outDir = path.resolve(at >= 0 ? args.splice(at, 2)[1] || '.' : path.join(os.homedir(), 'Downloads'));

for (const id of pickSystems(args)) {
  const { sys, errors } = check(id);
  const m = sys.meta;
  if (!m.skill) { console.log(`- ${m.name}: nessuna skill da esportare`); continue; }
  if (errors.length) {
    console.log(`✖ ${m.name}: ${errors.length} errori, export annullato. Dettagli: npm run check -- ${id}`);
    process.exitCode = 1;
    continue;
  }
  const dir = path.join(DIST_DIR, id, 'skill', m.skill.name);
  const zip = `${dir}.zip`;
  if (!fs.existsSync(zip)) {
    console.log(`✖ ${m.name}: zip non creato (serve il comando zip)`);
    process.exitCode = 1;
    continue;
  }
  const dest = path.join(outDir, `${m.skill.name}-${m.version}.zip`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(zip, dest);
  console.log(`✔ ${m.name} ${m.version}  ${tilde(dest)}  (${Math.round(fs.statSync(dest).size / 1024)} KB)`);
}
