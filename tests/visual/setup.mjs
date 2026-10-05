// Build every system before the visual tests, so the gallery reflects the current sources.
import { listSystems } from '../../tools/lib/system.mjs';
import { build } from '../../tools/build.mjs';

export default function setup() {
  for (const id of listSystems()) build(id, { quiet: true });
}
