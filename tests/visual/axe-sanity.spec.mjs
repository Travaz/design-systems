// Proves the accessibility audit is wired up: a page with known problems must fail it.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('axe reports known violations', async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="it"><body>
    <button></button>
    <p style="color:#bbb;background:#fff">Testo poco leggibile</p>
    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=">
  </body></html>`);
  const ids = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()).violations.map((v) => v.id);
  expect(ids).toEqual(expect.arrayContaining(['button-name', 'color-contrast', 'image-alt']));
});
