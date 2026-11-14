---
name: apis-design-system
description: Apis, a design system drawn from the nature of honeybees: pollen yellow, carapace black, wax white, the natural colours of the meadow and the order of the hive, with tokens, components, motion presets and a SwiftUI mapping. Use it when you design, build, restyle or review a UI in HTML, CSS, Tailwind, React or SwiftUI, or design its motion, for any project that uses Apis or that the user wants built with it: today travaz.dev and the Gym Harness iPhone app, and any new site or app that adopts it. Use it when the user mentions "Apis", "palette dell'ape", the bee or honeycomb style, "travaz.dev", "il mio sito", "Gym Harness" or classes `ap-`, whether the request is in Italian or in English. If a project already follows another design system (its own tokens or another design-system skill), use that one instead; if a new project has none, propose Apis and ask before applying it.
---

# Apis — a design system drawn from the nature of honeybees

Apis is a general design system for sites and apps. It is used today by the travaz.dev site and the Gym Harness iPhone app, and any new project can adopt it. A project that already follows another design system keeps that one; for a new project without one, propose Apis and ask before applying it. Colours come from the bee (yellow `accent`, black `carapace`, wax white `surface`), order comes from the hive (8pt grid, a few shapes repeated well), principles come from designsystems.com.

Version {{version}}. Published design system (visual reference with live previews): {{artifactUrl}}

Single source: `{{sourceDir}}`. This skill is generated from there: do not edit it by hand.

## What this skill contains

| File | When to read it |
|---|---|
| `references/brand-book.md` | **Always, before writing UI.** Colour, type, space, shapes, states, icons, tone of voice, accessibility. |
| `references/tokens.md` | When you need an exact token value or name. |
| `references/components.md` | When you use or create a component: purpose, classes, props, text rules, do and don't. |
| `references/principles.md` | When a situation is not covered: the principles from designsystems.com, with the numeric rules. |
| `references/governance.md` | When you add or change a token or a component: definition of ready, checklists, versions. |
| `assets/tokens.css` | CSS variables (primitives + semantic tokens, light and dark) and `@font-face`. Copy it into the project together with `assets/fonts/`. |
| `assets/fonts/` | The three typefaces in WOFF2 (Latin and Latin Extended) with their OFL licences. |
| `assets/apis.css` | Component classes `ap-*` + component-level tokens. Requires `tokens.css`. |
| `assets/tailwind.css` | Mapping for Tailwind v4 (`bg-surface`, `text-ink`, `p-4`, `text-body`…). |
| `assets/apis-react.js` + `.d.ts` | React components (`window.Apis`) and types. |
| `assets/apis-motion.js` | Motion patterns: reveal on scroll, sequences, theme switch. Goes in `<head>` without `defer`. |
| `assets/apis-motion-tokens.js` | Motion tokens as an ES module for JavaScript: durations in seconds, easings as arrays. Generated from `tokens.json`. |
| `assets/apis-motion-presets.js` | Ready-made presets for Motion (motion.dev): props for `motion/react` (`press`, `enter`, `overlay`, `reveal`, `sequence`, `swap`, `indicator`, `spring`) and helpers for vanilla `motion` (`revealOnScroll`, `pressFeedback`). No dependency of its own; imports `apis-motion-tokens.js`. |
| `assets/tokens.json` | Tokens in W3C DTCG format (Style Dictionary, Figma variables, Tokens Studio). |
| `assets/logo/` | `apis-mark.svg` (colour) and `apis-mark-mono.svg` (one ink). |
| `assets/templates/` | `website.html` (site treatment) and `app-shell.html` (tool treatment). They expect `tokens.css`, `apis.css` and `apis-mark.svg` next to them. |

## Workflow

1. **Understand the context.** Does the project use Apis, or has the user asked for it? If the project follows another design system, use that one; if it has none, propose Apis and ask first. In Gym Harness (SwiftUI) the "Native app" treatment of the brand book applies (SF Pro with Dynamic Type, Bricolage only for display titles, SF Symbols, `app-ground` background, cards without borders, capsule buttons, one question per screen); the tokens already arrive as `ApisColor`, `ApisSpace`, `ApisFont`, `ApisMotion`. Steps 2–3 below are about the web. If it is: a site page or a tool? The two treatments are described in `brand-book.md` → "Site and tools". Look at the project stack (Tailwind? React? server-side templates?).
2. **Check whether Apis is already installed** in the project (look for `--accent`, `ap-btn`, `tokens.css`). If it is, use what is there and do not duplicate it.
3. **Install the tokens if they are missing.** Copy `assets/tokens.css` and `assets/apis.css` into the styles folder; also copy the `assets/fonts/` folder next to `tokens.css` (the fonts are included: do not add links to Google Fonts). With Tailwind v4, also add `assets/tailwind.css` after `tokens.css`. With React you can use the components in `assets/apis-react.js` or rewrite them as modules with the same classes.
4. **Build only with semantic tokens** (`surface`, `ink`, `accent`, `line`, `space-*`, `radius-*`…). Never hand-written hex or pixel values, never primitives (`pollen-400`, `comb-200`) in a component. If a token is missing, follow `governance.md`.
5. **Start from the existing components** before inventing one. If the purpose is new, write the purpose statement and the component sheet (see `governance.md`).
6. **Write copy in the Apis tone** (the "Content and tone" section of the brand book): in the product's language, informal address ("tu" in Italian, "you" in English), sentence case, verb + object on buttons, errors that say how to fix the problem.
7. **Apply the "Craft" section of the brand book**: start from the subject, spend boldness once, plain specific copy, nothing invented, hover only on linked cards, look at 1440, 768 and 390px before you finish.
8. **Check against the checklist below** before you say you are done.

## Golden rules (the most often broken)

- The yellow `accent` is a **fill**, never a text colour or a link. Text on yellow is always `on-accent` (black), never white. Yellow fills on a light ground have an `accent-edge` border.
- **One primary button per view.**
- Spacing only from the `space-*` tokens (multiples of 8; 4 only for details). Line heights in multiples of 4.
- Bricolage Grotesque only for `display`/`headline`/`title`. Everything else in Instrument Sans. Numbers in tables and KPIs in JetBrains Mono with `tabular-nums`.
- States always have **icon + word + colour**, never colour alone.
- Focus is always visible: `outline: 2px solid var(--focus); outline-offset: 2px`.
- The yellow and black stripe is the attention signal: only `EnvironmentBanner` and `ap-stripe`. Non-production tools always show `EnvironmentBanner`.
- Both themes, always: no colours that exist only in light or only in dark; `body` has `background: var(--surface)`.
- Lucide icons (24px, 2px stroke, rounded), one colour with `currentColor`; an icon without text needs an `aria-label`.
- No emoji in the interface, no exclamation marks, no purple-to-blue gradients, no cards with a coloured left border.
- **Dosage**: the hexagon only for the logo, the main portrait, the hero comb and empty states (never for lists, timelines, chips). Yellow either in one large field per page or in single details, not scattered.
- Titles use the fluid styles (`ap-display-xl`, `ap-display`, `ap-headline`, `ap-title` or `var(--type-…)`): no hand-written sizes and no media queries for titles.
- In React apps and richer web interactions, motion uses Motion (motion.dev) with the presets in `assets/apis-motion-presets.js`, inside a MotionConfig with reducedMotion "user"; never hand-typed durations or curves.
- Motion only with the patterns in `apis-motion.js` (`data-ap-reveal`, `ap-rise`, `ap-cell-in`, `Apis.motion.toggleTheme`) on the web and with `ApisMotion` in the apps: one orchestrated moment per page or flow. Press at `motion-press-scale`, entrances never from scale 0, no bounces and no curves that start slow, under 300ms except reveals and the orchestrated moment; less motion for what people see often (brand book → "Motion").

## Checklist before delivering

- [ ] Only semantic or component tokens; no raw values, no primitives in components
- [ ] Spacing and sizes on the 8pt grid, line heights in multiples of 4
- [ ] One primary per view; yellow used as a fill, not as text
- [ ] Contrast: text 4.5:1 (3:1 above 24px or 19px bold), control borders, focus and icons 3:1, **in light and in dark**
- [ ] Keyboard: everything reachable with Tab, logical order, visible focus, Esc closes overlays
- [ ] Every field has a `label`; hints and errors linked with `aria-describedby`; one `h1`, headings in order
- [ ] Copy: sentence case, glossary verbs, errors and empty states following the templates, CHF format `12'480.00` and dates `1 ott 2026`
- [ ] Layout works from 360px to 1440px, no horizontal page scroll
- [ ] `prefers-reduced-motion` (web) or `accessibilityReduceMotion` (apps) respected: the final state stays, opacity only
- [ ] If you added a token or a component: sheet written, published design system updated, line in the changelog

## When the user asks to change Apis

Apis is alive, but this folder is **generated**. Every change goes in the source `{{sourceDir}}` (tokens in `tokens.json`, classes in `css/`, components in `components/`, rules in `docs/brand-book.md`), then from the root of the collection:

1. `npm run check -- apis`: contrast, grid, token names and usage. It must pass.
2. Update `version` in `system.json` and add a line to `CHANGELOG.md`.
3. `npm run release -- apis`: rebuilds, reinstalls this skill and updates the copies in the sites that use Apis.
4. Publish `dist/apis/artifact/` to the design system at the same link.

The user's requests always win over this skill.

## Changelog

{{changelog}}
