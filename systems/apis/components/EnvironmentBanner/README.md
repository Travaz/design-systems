# EnvironmentBanner

**Classes:** `ap-envbar` > `ap-envbar__label`; attention divider `ap-stripe`

Purpose: tell someone using a travaz.dev tool that they are in a non-production environment, so they do not treat test data as real (and vice versa).

It is the only component that uses the yellow and black stripe: in nature it is the "caution" signal, and here it means the same thing. The stripe stays yellow on black in both themes.

**The consumer provides:** `env` (`development`, `staging`, `preview`) or a free-form `label`. It goes at the top of the page, above the header, full width.

- Don't: show it in production; don't: use the stripe as decoration elsewhere (for an attention divider there is the `ap-stripe` class).
