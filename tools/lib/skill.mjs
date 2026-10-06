// Agent Skills format rules, so an exported zip imports cleanly into claude.ai, Claude Code or the API.
import fs from 'node:fs';
import path from 'node:path';

const KEYS = new Set(['name', 'description', 'license', 'allowed-tools', 'metadata', 'compatibility']);
const RESERVED = /anthropic|claude/;

/** Top-level `key: value` pairs of the SKILL.md frontmatter (null when there is none). */
export function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].replace(/^(["'])(.*)\1$/, '$2');
  }
  return out;
}

/** Problems that would make the skill folder fail to import. */
export function lintSkill(dir) {
  const problems = [];
  const file = path.join(dir, 'SKILL.md');
  if (!fs.existsSync(file)) return ['SKILL.md mancante'];
  const fm = frontmatter(fs.readFileSync(file, 'utf8'));
  if (!fm) return ['SKILL.md non inizia con un frontmatter --- … ---'];
  for (const k of Object.keys(fm)) if (!KEYS.has(k)) problems.push(`chiave "${k}" non ammessa nel frontmatter (ammesse: ${[...KEYS].join(', ')})`);
  const { name = '', description = '' } = fm;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) problems.push(`name "${name}": solo minuscole, cifre e trattini, al massimo 64 caratteri`);
  if (RESERVED.test(name)) problems.push(`name "${name}" contiene una parola riservata (anthropic, claude)`);
  if (name !== path.basename(dir)) problems.push(`name "${name}" diverso dal nome della cartella "${path.basename(dir)}"`);
  if (!description.trim()) problems.push('description vuota');
  if (description.length > 1024) problems.push(`description di ${description.length} caratteri (massimo 1024)`);
  if (/[<>]/.test(description)) problems.push('description contiene < o >');
  return problems;
}
