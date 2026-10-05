// Visual and accessibility tests on each system's component gallery (dist/<id>/gallery).
// Baselines live in tests/visual/__screenshots__/<platform>/: macOS and Linux render fonts differently.
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/visual',
  globalSetup: './tests/visual/setup.mjs',
  snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { browserName: 'chromium', deviceScaleFactor: 1, reducedMotion: 'reduce' },
  // an absolute budget: a ratio of a full page would hide a small component changing colour
  expect: { toHaveScreenshot: { maxDiffPixels: 100, animations: 'disabled', caret: 'hide' } },
});
