# Motion

**Classes:** `[data-ap-reveal]` (+ `--ap-i` for the order), `ap-rise`, `ap-cell-in`, `ap-cell-open`, `ap-cell`; script `apis-motion.js` (`Apis.motion.reveal()`, `Apis.motion.toggleTheme(button)`)

Purpose: give a page orientation and rhythm with a few recognisable movements, always the same ones, without ever getting in the way of reading.

**Patterns**
- **Reveal** (`data-ap-reveal`): blocks enter from 24px below when they reach the screen, in `duration-reveal` with `ease-standard`. Siblings follow in sequence at `duration-stagger` steps, at most 5 steps.
- **Rise** (`ap-rise` + `style="--ap-i: n"`): the entrance on load, only in the hero. Curve `ease-emphasis`.
- **Cell-in** (`ap-cell-in`): the honeycomb cells that assemble around the portrait. Only in the hero.
- **Cell-open** (`ap-cell-open` on an `ap-cell`): the portrait opening like a cell. Once per site.
- **Theme reveal**: the theme change expands in a circle from the button (`Apis.motion.toggleTheme(this)`).

**Rules**
- Only one orchestrated moment per page (the hero entrance). Everything else is a discreet reveal.
- Content is visible even without JavaScript: the script adds `.ap-motion` to `<html>` and only then do elements start hidden.
- With `prefers-reduced-motion` the script activates nothing and the token durations go to zero.
- Hover and press stay in `duration-fast`; menu and dialog openings in `duration-slow`.

- With Motion (motion.dev) in React or plain JavaScript, use the presets in `apis-motion-presets.js`: see the brand book, "With Motion (motion.dev)".

- Don't: animate long text word by word, parallax on scroll, looping movement near text (the ticker stops on mouse hover).
