// Every component preview of every system: screenshots in each theme at phone and desktop width, plus an axe audit.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { listSystems, loadSystem, themes, SYSTEMS_DIR, DIST_DIR } from '../../tools/lib/system.mjs';

const WIDTHS = [375, 1280];
// Previews are fragments, not pages: landmark and page-level rules do not apply to them.
const FRAGMENT_RULES = ['region', 'landmark-one-main', 'page-has-heading-one'];

async function open(page, id, comp, theme, width) {
  await page.setViewportSize({ width, height: 800 });
  await page.emulateMedia({ colorScheme: theme === 'dark' ? 'dark' : 'light', reducedMotion: 'reduce' });
  await page.goto(pathToFileURL(path.join(DIST_DIR, id, 'gallery', `${comp}.html`)).href, { waitUntil: 'networkidle' });
  await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
  await page.evaluate(() => document.fonts.ready);
  // a preview that failed to render (React or the bundle not loaded) must not pass as an empty page
  await page.waitForFunction(() => document.body.innerText.trim().length > 0 || document.querySelector('body svg, body img'), null, { timeout: 5000 });
}

for (const id of listSystems()) {
  const sys = loadSystem(id);
  const compDir = path.join(SYSTEMS_DIR, id, 'components');
  const comps = fs.existsSync(compDir) ? fs.readdirSync(compDir).filter((c) => fs.existsSync(path.join(compDir, c, 'preview.html'))).sort() : [];

  test.describe(sys.meta.name, () => {
    for (const comp of comps) {
      for (const theme of themes(sys)) {
        for (const width of WIDTHS) {
          test(`${comp} · ${theme} · ${width}px`, async ({ page }) => {
            await open(page, id, comp, theme, width);
            await expect(page).toHaveScreenshot([id, `${comp}-${theme}-${width}.png`], { fullPage: true });
          });
        }
        test(`${comp} · ${theme} · accessibilità`, async ({ page }) => {
          await open(page, id, comp, theme, 1280);
          const { violations } = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .disableRules(FRAGMENT_RULES)
            .analyze();
          const report = violations.map((v) => `${v.id} (${v.impact}): ${v.help}\n    ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join('\n    ')}`);
          expect(report, report.join('\n')).toEqual([]);
        });
      }
    }
  });
}
