// npm run tag [-- <id> ...] [--push]
// One annotated tag per released version, <id>@<version>, on the commit where system.json got that version.
// Versions come from CHANGELOG.md; the tag message is the changelog entry. Existing tags are left alone.
import { execFileSync } from 'node:child_process';
import { ROOT, pickSystems, loadSystem } from './lib/system.mjs';

const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
const ENTRY = /^- (\d{4}-\d{2}-\d{2}) · (\d+\.\d+\.\d+) · (.*)$/;

export function versions(sys) {
  return sys.changelog.split('\n').map((l) => l.match(ENTRY)).filter(Boolean).map(([, date, version, text]) => ({ date, version, text })).reverse();
}

/** The commit where systems/<id>/system.json first carried "version": "<v>", or null. */
export function commitFor(id, v) {
  const out = git('log', '--format=%H', '--reverse', '-S', `"version": "${v}"`, '--', `systems/${id}/system.json`);
  return out.split('\n')[0] || null;
}

export function planTags(id) {
  const sys = loadSystem(id);
  const existing = new Set(git('tag', '--list', `${id}@*`).split('\n').filter(Boolean));
  return versions(sys).map((v) => {
    const tag = `${id}@${v.version}`;
    if (existing.has(tag)) return { ...v, tag, status: 'esiste' };
    const commit = commitFor(id, v.version);
    return { ...v, tag, commit, status: commit ? 'da creare' : 'non in git' };
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const push = process.argv.includes('--push');
  const created = [];
  for (const id of pickSystems(process.argv.slice(2))) {
    const sys = loadSystem(id);
    console.log(`\n${sys.meta.name}`);
    for (const t of planTags(id)) {
      if (t.status === 'da creare') {
        git('tag', '-a', t.tag, t.commit, '-m', `${sys.meta.name} ${t.version} (${t.date})\n\n${t.text}`);
        created.push(t.tag);
        console.log(`  + ${t.tag}  → ${t.commit.slice(0, 7)}`);
      } else console.log(`  ${t.status === 'esiste' ? '=' : '·'} ${t.tag}  ${t.status}`);
    }
    const current = `${id}@${sys.meta.version}`;
    if (!git('tag', '--list', current)) console.log(`  ! ${current}: la versione attuale non è ancora in un commit. Committa, poi rilancia.`);
  }
  if (push && created.length) { git('push', 'origin', ...created); console.log(`\n✔ inviati ${created.length} tag a origin`); }
  else if (created.length) console.log(`\nPer inviarli: git push origin ${created.join(' ')}  (oppure npm run tag -- --push)`);
  console.log('');
}
