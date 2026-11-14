Apis is the design system of travaz.dev: the homepage, the personal pages and the tools published on the same domain, such as the Wishlist, use the same tokens, the same rules and the same components. Other apps each have their own design system. Apis takes its colours from the bee and its world: the yellow of pollen, the black of the carapace, the white of wax, and then the flowers and resins the bee visits. It takes its order from the hive: a regular grid, a few shapes repeated well, every cell with a purpose.

## Principles

These principles come from designsystems.com (Figma) and are the basis of every decision below. When a rule does not cover a case, go back to them.

1. **Everything on the 8 grid.** Spacing, control sizes and icons are multiples of 8px. The 4px half step is only for small details (icon to label, badge padding). Line heights are always multiples of 4 (baseline grid). No odd values.
2. **Three levels of tokens, with aliases.** Primitive (`pollen-400`) → semantic, named by intent (`accent`) → component (`button-primary-background`). Components never use a primitive.
3. **Few primitives.** Six colour families, three type families, a small number of weights. To create hierarchy, increase size first, then weight.
4. **Modes, not copies.** Light/dark and languages are modes of the same tokens, never duplicated components.
5. **Purpose before name.** Every component starts from a purpose statement ("Purpose: tell the user they are in a test environment"). A new purpose means a new component, not one more variant.
6. **One style per family.** Icons have a single stroke, a single type of corner and terminal; buttons are primary, secondary and tertiary on every platform.
7. **Name things for what they are, not for their value.** Tokens by intent (`danger`, not `red`), icons by what they show (`hexagon-plus`, not `add-project`).
8. **Text is part of the specification.** Writing rules, glossary and message templates live in the documentation of each component.
9. **Accessible by default.** Colour pairs tested in both themes, full keyboard support, labels on every control, correct heading order. Fix it in the system, so the fix reaches everywhere.
10. **Ready before it is published.** A component enters the system only when its anatomy, tokens, states, variants and responsive behaviour are defined, and code, design and documentation match.
11. **Layered, adoptable in pieces.** Tokens → CSS classes → React components. Each layer works on its own; you can drop down a layer when needed, but the right path must be the easiest one.
12. **Tailored, not copied.** Apis takes ideas from open source systems but reflects this brand. Trends pass; decisions stay written here.

## Craft

Taste is a set of decisions you can check. These rules come from Taste Skill (tasteskill.dev) and Claude's frontend-design skill, adapted to Apis. Where a source disagrees with Apis, the Apis rule wins and the reason is written here.

- **Start from the subject.** Layout, images and copy come from what the page is about: its materials, its numbers, its words. If a choice would fit any similar page, revise it.
- **Spend boldness once.** One memorable element per view (on the site, the hero); everything around it stays quiet. Before shipping, remove one decoration.
- **Structure carries information.** Numbered markers only for a real sequence. Dividers, borders and labels must say something. At most two boxes deep: never text in a box inside a box.
- **One recipe per thing.** One card recipe, one link style, one primary and secondary button pair per view, one size for each kind of element across a page.
- **Mostly neutral.** A screen is mostly `surface`, `ink` and `line`. Yellow follows "Brand dosage". Emphasise with size, weight and contrast before colour.
- **Readable text.** Running text at least `body` (16px) with a line height of 1.5 or more, lines no wider than `size-prose`, nothing under 12px. Body text aims for 7:1 where the palette allows it; 4.5:1 is the floor.
- **Monospace on purpose.** JetBrains Mono only for code and for numbers that must line up (tables, KPIs, dates in a timeline). Never for sentences, labels or decoration. Taste Skill counts mono labels as an AI tell; in Apis mono is a deliberate data voice, so keep it to data.
- **Quiet labels.** At most one `overline` per screen, and it is the only all-caps text. No eyebrow above every heading, no single coloured word in a headline, no gradient text, no emoji that carries meaning.
- **Plain, specific copy.** The h1 names the thing. The first screen carries one hard fact: a number, a place, a date. Every heading contains a noun. No hype words ("seamless", "elevate", "unlock") and no questions as section titles; the closing invitation to get in touch is the only exception.
- **Buttons say what happens.** Verb plus object, and the same name through the flow ("Publish", then "Published"). Never "Learn more" or "Discover", and no arrow on every button.
- **Nothing invented.** No made-up reviews, logos, statistics or placeholder text in anything that ships. If a number is unknown, remove the sentence.
- **Avoid the AI defaults.** Cream with a serif and terracotta; near-black with an acid accent; rows of identical rounded cards with the same soft shadow; purple gradients and glass cards. Apis has its own palette: use it.
- **Hover with restraint.** Hover effects only under (hover: hover) and (pointer: fine). Only cards that are links react: they lift 2px; an image may zoom to 1.03 inside its frame. Cards that are not links do not move. This settles a disagreement between the sources: Taste Skill asks for a lift on linked cards, frontend-design calls hover on every card a tell.
- **Quality floor.** Works from 320px, focus ring always visible and never animated, touch targets of 44px, visible labels, headings one level at a time, equal left and right edges.
- **Look before you ship.** Check every page at 1440, 768 and 390px in both themes: uneven margins, text touching an edge, empty gaps, single words left alone on the last line of a title.

## Colour

The system is yellow, black and white. The other natural colours (meadow, borage, nectar, propolis, heather) are only for states and charts.

- The page is `surface` (wax white in light, hive black in dark). Cards sit on `surface-raised`; wells, code and table headers on `surface-sunken`.
- Text is `ink`; secondary text is `ink-muted`. Both reach at least {{contrast ink,ink-muted on surface,surface-raised,surface-sunken}} on all three surfaces, in both themes.
- `accent` is the bee's yellow. Use it as a **fill**, never as text: primary button, selected tab, switch on, one highlight per view. On yellow, text is always `on-accent` (carapace black, {{contrast on-accent on accent}}), never white.
- On a light background the yellow has a contrast of {{contrast accent on surface light}}, so every `accent` fill carries a 1px border in `accent-edge` to stay visible.
- When you need a yellow that is readable as text (eyebrows, labels), use `accent-text` on `surface` or on `accent-soft`.
- Links are `link` (borage blue), underlined at rest. Yellow is never a link.
- States use fixed pairs: `success` on `success-soft`, `warning` on `warning-soft`, `danger` on `danger-soft`, `info` on `info-soft`. Every state always has an icon and a word as well, never colour alone. `success` (meadow green) and `danger` (propolis red) also differ in lightness.
- Black and yellow side by side in stripes are the system's warning signal (as in nature): only `EnvironmentBanner` and the `ap-stripe` divider use them. Do not use them as decoration.
- `surface-inverse` is a dark band in **both** themes (bee black in light, one step above the page in dark), with `ink-inverse` text. Footers, tickers and tooltips never turn white in the dark theme.
- Charts: categorical series in the fixed order `viz-1` … `viz-6`. The first series is always yellow. Beyond six series, group the rest into "Other".
- Primitive tokens (`pollen-*`, `comb-*`, `meadow-*`, `borage-*`, `nectar-*`, `propolis-*`, `heather-*`) exist only to define the semantic ones. If you need a primitive in a component, a semantic token is missing: add it.

## Typography

Three open source families (OFL licence), **bundled with the system** in `fonts/` and declared in `tokens.css`: no requests to Google or other services, so no visitor IP addresses go to third parties and the fonts are available immediately. Each one has a role:

- **Bricolage Grotesque** (`display`): only `display-xl`, `display`, `headline`, `title`. Organic, with small irregularities, like something made by hand.
- **Instrument Sans** (`sans`): everything else, from the interface to long-form text.
- **JetBrains Mono** (`mono`): `code` and `data`. Numbers in tables and KPIs use `data` with tabular figures.

Rules:

- The default text is `body` (16/24). In dense apps, drop to `body-sm` (14/20), never below 12px.
- `display-xl` is the single phrase of a landing page (a name, a product): once per site, never in apps. `display` at most once per page. Apps start from `heading` as the page title.
- All line heights are multiples of 4. Lines of long-form text do not exceed `size-prose` (70 characters).
- Headings have `text-wrap: balance`. `overline` text is uppercase with 0.08em letter spacing and no more than three words; at most one per screen, and only when it gives context the heading does not: above every card it becomes noise.
- Monospace is for code and numbers in columns, never for sentences or labels.
- In native apps the typefaces change roles: see "Native app".
- The four display styles are **fluid**: they grow continuously from 360px to 1280px of width (`display-xl` 48/52 → 88/88, `display` 40/44 → 56/60, `headline` 32/40 → 40/48, `title` 28/36 → 32/40). Both ends sit on the 4 grid. Use the classes `ap-display-xl`, `ap-display`, `ap-headline`, `ap-title` or `font: var(--type-…)`, never hand-written sizes or media queries for headings.

## Space, grid and layout

- Use only the `space-*` tokens. The number in the name is a multiple of 4px: `space-4` = 16px, `space-6` = 24px.
- Fixed-size components (buttons, inputs): the height comes from `size-control-*`, the padding adapts. Content-driven components (tables, cards): the padding is fixed, the height follows the content.
- Borders are included in the measurements (`box-sizing: border-box`).
- Site: 12-column grid, maximum content width `size-content` (1200px). Side margins `space-4` on mobile, `space-6` on tablet, `space-8` on desktop. Between sections `space-16` (mobile `space-12`).
- Tools: fluid layout, sidebar plus work area; between groups `space-8`, between sections `space-12`. Dense tables may scroll horizontally inside their container, never the page.
- Breakpoints: `bp-sm` 640, `bp-md` 768, `bp-lg` 1024, `bp-xl` 1280. Design mobile-first.

## Shapes and elevation

- Corners are restrained, like the cells of a honeycomb: `radius-sm` for buttons, inputs, badges and tabs; `radius-md` for cards, alerts and menus; `radius-lg` only for dialogs and large site panels; `radius-full` for switches, pills and avatars. Tables and full-width bands stay at `radius-none`.
- The hexagon is the brand motif and has limited uses: see "Brand dosage".
- Three levels of warm shadow: `elevation-1` cards at rest, `elevation-2` menus and cards on hover, `elevation-3` dialogs only. Inside dense apps, prefer a `line` border to a shadow.

## States and focus

- Focus is always visible: a solid 2px ring in `focus`, offset 2px from the control. The offset means the ring always touches a surface and never the fill (not even the yellow): it reaches at least {{contrast focus on surface,surface-raised,surface-sunken}} on all surfaces, in both themes. Never remove `outline-offset`.
- Hover: `surface-hover` for neutral elements, `accent-hover` for the primary. Pressed: `accent-pressed` and 1px down.
- Disabled: `disabled` fill, `ink-muted` text, `not-allowed` cursor, and a reason explained next to the control when it is not obvious.

## Motion

Apis moves like a bee landing: it sets off decisively and settles calmly. Motion serves to orient (what is new, what has changed) and to give rhythm, never to decorate.

| Pattern | Where | Duration and curve |
|---|---|---|
| Hover, press, focus | Every control | `duration-fast` (120ms), `ease-standard` |
| Toggles, tabs, small expansions | Switches, tabs, accordions | `duration-base` (200ms), `ease-standard` |
| Menus, dialogs, drawers | Overlay layers | `duration-slow` (320ms), enter `ease-standard`, exit `ease-exit` |
| Reveal on scroll (`data-ap-reveal`) | Content blocks | `duration-reveal` (700ms), `ease-standard`, siblings in steps of `duration-stagger` (90ms), at most 5 steps |
| Rise on entry (`ap-rise`) | The hero only | `duration-reveal`, `ease-emphasis` |
| Cell-in, cell-open | Hero honeycomb and portrait only | `duration-reveal` / 1000ms, `ease-emphasis` |
| Theme change | The theme button | 600ms, circle from the button, `ease-emphasis` |
| Press | Buttons, choice cards, tappable rows | scale `motion-press-scale` (0.97) in `duration-fast`, `ease-standard`; returns to 1 on release |
| Element entry | Popovers, cards, selection marks | from `motion-enter-scale` (0.96) and opacity 0, never from scale 0; `duration-base`, `ease-standard` |
| Screen sequence | Title, text, controls of a step | rise by `motion-rise` (16px) with opacity, in reading order, in steps of `duration-stagger`, at most 5 |
| In-place change | A number, a label, an image that changes | crossfade, `motion-blur` (2px) on what leaves, `duration-base` |

- **One orchestrated moment per page**: the hero entry. Everything else is a subtle reveal or feedback.
- Content is readable without JavaScript: `apis-motion.js` adds `.ap-motion` to `<html>`, and only then do elements start hidden.
- With `prefers-reduced-motion` the script activates nothing and the token durations go to zero.
- No parallax on scroll, no text animated word by word, no loops near text that do not stop on hover.
- **Frequency decides.** What is seen many times a day (lists, tabs, repeated actions, keyboard shortcuts) moves little or not at all. Rare moments (a welcome, the end of a journey, the first entry) can take `duration-reveal`.
- **Fast.** The interface stays under 300ms; only reveals and the orchestrated moment reach `duration-reveal`.
- **Leaving costs less than entering.** What leaves the screen for good exits in about 70% of the entry duration, with `ease-exit`. Never a curve that starts slow (ease-in) for something the user is waiting to see.
- **No bounces.** No elastic curves or overshoot, even with springs (bounce 0): the bee settles, it does not bounce.
- **Interruptible.** A tap or gesture during an animation picks it up from where it is; it does not restart it from the beginning.
- **From the origin.** Menus and popovers open from the point that opened them, not from the centre.
- **Reduced motion:** the final state remains. No movement, scaling or blur, only opacity.

### With Motion (motion.dev)

On travaz.dev, CSS and `apis-motion.js` cover every pattern without third-party code. For React apps and richer interactions use Motion: the package motion for plain JavaScript, motion/react for React (version 14). Take every value from `apis-motion-presets.js`, which reads the tokens through `apis-motion-tokens.js`: code never repeats a duration or a curve.

| Need | Preset or helper |
|---|---|
| Press on a button, choice card or row | press (React), pressFeedback (vanilla) |
| A popover, card or selection mark appears | enter, inside AnimatePresence |
| Menu, dialog, drawer | overlay, with the transform origin on the control that opened it |
| A block reaches the screen | reveal (React), revealOnScroll (vanilla) |
| Title, text and controls of a step | sequence: parent plus child with custom set to the index |
| A number or label changes in place | swap, inside AnimatePresence with mode popLayout and a key per value |
| Selected tab bar, reordering | indicator (layout animation on a spring), layoutId for a shared indicator |
| Gestures and interruptible state | spring: visual duration `duration-slow`, bounce 0 |

- **Reduced motion.** In React wrap the app in MotionConfig with reducedMotion set to "user": transforms and layout animations stop, opacity stays, which is the Apis rule. Vanilla Motion does not read the setting by itself: the helpers check it, and any other call must check it too.
- **Seconds, not milliseconds.** Motion counts in seconds. The presets already convert; never type 0.2 by hand.
- **Springs never bounce.** Bounce 0 in every spring, as in SwiftUI.
- **Only cheap properties.** Animate transform and opacity (filter for the swap blur). Never width, height, padding, box-shadow or a CSS variable.
- **Exits.** Keep AnimatePresence mounted and put the condition inside it; children have stable keys, never array indexes. Exits use `ease-exit` at 70% of the entry duration.
- **Loading.** With a bundler, import from the package. Without one, pin the version on jsDelivr (motion@14 with +esm). Never "latest".

React:

```jsx
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { press, enter, reveal } from "./apis-motion-presets.js";

<MotionConfig reducedMotion="user">
  <motion.button className="ap-btn ap-btn--primary" {...press}>Save changes</motion.button>
  <AnimatePresence>{open && <motion.div key="menu" {...enter} />}</AnimatePresence>
  <motion.section {...reveal}>…</motion.section>
</MotionConfig>
```

Plain JavaScript:

```js
import { animate, inView, press } from "motion";
import { revealOnScroll, pressFeedback } from "./apis-motion-presets.js";

revealOnScroll({ animate, inView }, "[data-reveal]");
pressFeedback({ animate, press }, ".ap-btn");
```

### In native apps (SwiftUI)

Same tokens, same rules. iOS apps generate the values from `tokens.json` (in Gym Harness: `tools/gen_apis_tokens.py` → `ApisMotion`).

| Token or rule | SwiftUI |
|---|---|
| `ease-standard`, `ease-emphasis`, `ease-exit` with a duration | `.timingCurve(0.2, 0, 0, 1, duration:)`, `.timingCurve(0.16, 1, 0.3, 1, duration:)`, `.timingCurve(0.4, 0, 1, 1, duration:)` |
| Gestures (dragging, dismissing a sheet) | `.spring(duration: 0.32, bounce: 0)`: inherits the finger's velocity and stays interruptible |
| `motion-press-scale` | a `ButtonStyle` with `scaleEffect(configuration.isPressed ? 0.97 : 1)` |
| `motion-rise` + `duration-stagger` | `offset(y:)` and `opacity` with a delay of `index × 0.09`, at most 5 steps |
| In-place change of a number | `.contentTransition(.numericText())` |
| Confirmed choice | `.sensoryFeedback(.selection, trigger:)`; `.impact` only for actions that save something |
| Reduced motion | `@Environment(\.accessibilityReduceMotion)`: opacity only |

On iOS 26, bars, tab bars and navigation controls use system Liquid Glass; content, cards and sheets stay on Apis colours.

## Brand dosage

Yellow, black and the hexagon are recognisable precisely because they are few. Used everywhere, they turn into a construction site.

- **Hexagon**: only in the logo, in the main portrait (`ap-cell`, once per site), in the decorative hero honeycomb (once per page) and in the `EmptyState` icon. Do not use it for bullet lists, timeline markers, chips, dividers or card frames.
- **Yellow**: either **one large field** per page (the contact band, the cover), or **single details** (the primary button, the selected tab bar, an underline). Not both in the same narrow view, and never scattered across many small decorative elements.
- **Black and yellow side by side at large scale**: only in the logo and in the warning stripe. Do not place a large black block next to a large yellow block.
- For lists and dividers, use neutral shapes: a `radius-full` dot in `ink-muted`, a `line` rule.

## Images

- **Real photographs**, in natural colours and warm light: people, workplaces, products. No generic stock photos and no illustrations.
- **Aspect ratios** from the tokens: `aspect-portrait` (4:5) for people, `aspect-cover` (16:10) for projects and articles, `aspect-square` for logos and avatars, `aspect-cell` only for the main portrait. Always `object-fit: cover`.
- **Portrait**: eyes on the upper third (`object-position: 50% 30%`), plain background, no filters.
- **Screenshots**: inside a `radius-md` frame with a `line` border, never tilted or with fake device shadows.
- **Weight**: at most 2400px on the long side, in WebP or AVIF, `loading="lazy"` below the first screen, `width` and `height` always declared.
- **Alternative text**: describes what you need to know ("Ritratto di Daniel Travaglia" (Portrait of Daniel Travaglia)), `alt=""` for decorative images.

## Logo

- The logo is a honeycomb cell (pointy-top hexagon) in `accent` with two bands in `carapace`, on a 64 grid: a centred hexagon of radius 30, bands 8 high at y 22 and 38.
- Clear space around it equal to half its width; minimum size 16px.
- Next to the logo, the name is set in Bricolage Grotesque 700.
- **Status: provisional.** It is a starting geometric mark, not a hand-drawn logo. It must be redrawn before it is used outside the personal site.

## Iconography

- On the web, use Lucide icons (open source): 24px grid, 2px stroke, rounded terminals and corners. It is the same style as Apis's internal icons. Native apps use SF Symbols (see "Native app").
- Sizes: `size-icon-sm` (16) in small controls and next to `body-sm`, `size-icon-md` (24) by default, `size-icon-lg` (32) for features and empty states. Do not go below 16px.
- One colour per icon, inherited with `currentColor`. Two colours at most, and only on the site; three or more is an illustration.
- Names describe what is shown, in English and with hyphens: `circle-check`, `hexagon-plus`. Variants use a slash: `hexagon/filled`.
- An icon without text always has an accessible label (`aria-label`) and a tooltip.

## Content and tone

Apis speaks like a skilled craftsperson: direct, calm, precise. Short sentences, active verbs, no exclamation marks, no emoji in the interface.

- **Language.** English is the primary language of the system documentation. Interface copy follows the product's language (Italian and English on travaz.dev), and both follow the same rules. Address the user informally, on the site and in the apps ("tu" in Italian, "you" in English). The system does not speak in the first person ("Non è stato possibile salvare" (Could not save), not "Non siamo riusciti" (We could not)).
- **Capitalisation.** Always sentence case, in English too, including buttons and table headers: "Salva modifiche" (Save changes), "Export report". The only exception: `overline` text, all uppercase.
- **Buttons.** Verb in the infinitive plus object: "Crea progetto" (Create project), "Scarica fattura" (Download invoice). The title of a confirmation uses the same verb as the button that confirms it: "Eliminare il progetto?" (Delete project?) → "Elimina progetto" (Delete project) / "Annulla" (Cancel).
- **Errors.** Say what happened and how to fix it, without apologies: "La data di fine è prima della data di inizio. Scegli una data dopo il 3 ott." (The end date is before the start date. Choose a date after 3 Oct.) Never just "Errore" (Error).
- **Empty states.** Say what will appear here and what the first step is: "Nessun progetto ancora. Crea il primo progetto per iniziare a tracciare le ore." (No projects yet. Create your first project to start tracking hours.)
- **Glossary.** *Elimina* (Delete) = removes permanently; *Rimuovi* (Remove) = takes out of a group, the item still exists; *Archivia* (Archive) = hides, can be restored. *Scarica* (Download) = file on the device; *Esporta* (Export) = conversion to another format; *Condividi* (Share) = access for other people.
- **Numbers and dates.** Swiss-Italian format: `CHF 12'480.00`, `1 ott 2026`, `14:30`. Numbers in tables always in `data` (tabular figures).
- **Translations.** Leave 30% extra space for German. Do not build sentences by joining string fragments. No text inside images or icons.

## Accessibility

- Target WCAG 2.2 AA: text 4.5:1, large text and controls 3:1, in both themes. The pairs declared in the tokens are already verified; if you create a new one, measure it.
- Everything works from the keyboard, in reading order. Tabs: left/right arrows, Home, End. Switches: Space. Dialogs: Esc closes them and focus returns to the control that opened them.
- Every field has a visible `label`; hints and errors are linked with `aria-describedby`. Placeholder text never replaces the label.
- Informative images have alternative text; decorative ones have `alt=""`.
- One `h1` per page, headings in order without skipping levels.
- Minimum touch target 44×44px on mobile (`size-control-lg` for main buttons).
- No accessibility overlays and no automatic fixes: semantic markup and testing with real people.

## Components

Eleven React components in `window.Apis`, plus the `ap-*` classes for those who do not use React. Each component has its own page with its purpose, when to use it, what the user of the component provides, and writing rules.

- Actions: `Button`
- Forms: `TextField`, `Checkbox`, `Switch`
- Feedback: `Alert`, `Badge`, `EmptyState`, `EnvironmentBanner`
- Containers and navigation: `Card`, `Tabs`
- Data: `DataTable`
- Foundations: `Icon`, `Motion` (motion patterns and the `apis-motion.js` script)

### Site and tools

They are the same system with three treatments: site, tools and native app. The **site** can use `display` and `headline`, `body-lg`, spacing of `space-16` and `space-24`, `radius-lg`, and yellow in large fields. **Tools** are dense and quiet: `heading` titles, `body-sm` text in tables, `sm` controls, a single primary button per view, yellow only for the main action and selection. Every non-production tool shows `EnvironmentBanner` at the top.

### Native app

The treatment for iOS apps (currently Gym Harness). On iPhone the platform decides structure, navigation and controls; Apis brings the brand through the tint, the titles and the motion. The rules come from the iOS reference and the native audit of Impeccable, and from the app screens and the "tells" register of Taste Skill: an app that looks like a website ported to iPhone does not inspire trust.

- **Typefaces.** Interface text is SF Pro with the system styles and Dynamic Type (body 17 pt, minimum 11 pt). Bricolage Grotesque only in display moments: large navigation titles, the title of the current step, the hero number (timer, load), always scaled with Dynamic Type. Numbers use SF Pro tabular figures; no JetBrains Mono in the app.
- **Icons.** SF Symbols, aligned with the text and scaled with it.
- **Colour.** `app-ground` background, almost neutral; cards and rows in `app-raised`, one tone above; secondary controls in `app-fill`. The yellow `accent` is the only tint: main action, selection, progress. Text and states are those of Apis.
- **Surfaces.** No borders on cards: the tone separates them. `radius-xl` for cards, like iOS grouped lists; capsules for buttons and pills; concentric radii inside a card. The 1px border remains only where a control needs it to be recognised.
- **Buttons.** Capsules. Primary: `accent` fill, `on-accent` text, no border. Secondary: `app-fill` and `ink` text. Tertiary: text only. At least 44 pt high; actions meant for sweaty hands 56 pt. Pressed: `motion-press-scale`.
- **Labels.** No uppercase labels above cards. A piece of information lives in one place only: the title is not repeated in the text, a number is not repeated in the legend.
- **System controls.** Tab bar for sections, stack for hierarchy, sheets for short tasks; system switches, steppers, pickers, menus and swipe actions; grouped lists for settings and lists; Liquid Glass on bars and navigation controls, content on Apis colours.
- **One question per screen.** Each screen first answers one question ("what do I do today?"): the answer is the largest block, with its action. The data point to notice (a long break, poor sleep, a new phase) is the line under the answer's title, not a separate card. Everything else is a one-line link or lives on another screen.
- **Verification.** Simulator screenshots in light, in dark and with large Dynamic Type: no truncated or overlapping text.

In SwiftUI the apps generate the tokens from `tokens.json` (Gym Harness: `tools/gen_apis_tokens.py`), with `surface`, `surface-raised`, `surface-sunken` and `surface-hover` taken from `app-ground`, `app-raised` and `app-fill`.

### Adding or changing a component

A contribution goes through three phases, and no phase is skipped:

1. **Consolidate.** Show that no existing component covers the case, collect at least two real use cases, assess the impact on the other components. Write the purpose statement.
2. **Define.** A specification ready for development: anatomy, tokens used (semantic or component tokens only), states (rest, hover, focus, pressed, disabled, error, loading), variants, behaviour from mobile to desktop, text rules, accessibility requirements.
3. **Make compliant.** Code, design and documentation match; contrast verified in light and dark; keyboard navigation tested; component page written.

Versions follow semver: a renamed or removed token is a major version, a new token or component is a minor version, a value fix is a patch.
