# Icon

**Classes:** inline `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`

Purpose: draw an icon from the Apis built-in set, in the same style as Lucide (24px grid, 2px stroke, rounded ends).

**The consumer provides:** `name` (`circle-info`, `circle-check`, `triangle-alert`, `octagon-x`, `hexagon`, `hexagon-plus`, `arrow-right`, `plus`, `search`, `download`), optional `size` (16, 24, 32) and `label`. Without `label` the icon is decorative and hidden from screen readers. The colour comes from `currentColor`.

For all other icons use Lucide with `strokeWidth={2}` and the same sizes.
