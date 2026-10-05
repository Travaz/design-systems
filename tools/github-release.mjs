// node tools/github-release.mjs [--dry-run]   (CI, with GH_TOKEN)
// A GitHub Release for every <id>@<version> tag that has none yet, built from the tagged commit itself:
// the package and the skill as zips, plus the specimen when that version had one.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { ROOT, listSystems, loadSystem } from './lib/system.mjs';
import { planTags } from './tag.mjs';

const dry = process.argv.includes('--dry-run');
const sh = (cmd, args, cwd = ROOT) => execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }).trim();
const hasRelease = (tag) => spawnSync('gh', ['release', 'view', tag], { cwd: ROOT, stdio: 'ignore' }).status === 0;

for (const id of listSystems()) {
  const sys = loadSystem(id);
  for (const t of planTags(id).filter((x) => x.status === 'esiste')) {
    if (!dry && hasRelease(t.tag)) continue;
    const work = fs.mkdtempSync(path.join(os.tmpdir(), `release-${id}-`));
    sh('git', ['worktree', 'add', '--detach', work, t.tag]);
    try {
      sh(process.execPath, ['tools/build.mjs', id], work);
      const dist = path.join(work, 'dist', id), assets = [];
      sh('zip', ['-rqX', path.join(work, `${id}-${t.version}-package.zip`), 'package'], dist); assets.push(path.join(work, `${id}-${t.version}-package.zip`));
      const skillZip = fs.readdirSync(path.join(dist, 'skill')).find((f) => f.endsWith('.zip'));
      if (skillZip) { const to = path.join(work, `${skillZip.replace(/\.zip$/, '')}-${t.version}.zip`); fs.copyFileSync(path.join(dist, 'skill', skillZip), to); assets.push(to); }
      if (fs.existsSync(path.join(dist, 'specimen.html'))) { const to = path.join(work, `${id}-${t.version}-specimen.html`); fs.copyFileSync(path.join(dist, 'specimen.html'), to); assets.push(to); }
      const title = `${sys.meta.name} ${t.version}`;
      const notes = `${t.text}\n\n_${t.date}_ · tag \`${t.tag}\``;
      if (dry) console.log(`[dry-run] ${t.tag}: "${title}" con ${assets.map((a) => path.basename(a)).join(', ')}`);
      else { sh('gh', ['release', 'create', t.tag, '--title', title, '--notes', notes, '--verify-tag', ...assets]); console.log(`✔ release ${t.tag}`); }
    } finally {
      sh('git', ['worktree', 'remove', '--force', work]);
    }
  }
}
