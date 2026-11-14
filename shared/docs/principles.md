# Apis principles (from designsystems.com)

The working rules Apis takes from the designsystems.com guides (Figma's publication on design systems). Each section says what it means in practice inside Apis. When a request is not covered by `brand-book.md` or `components.md`, decide from here.

## 1. Space, grids and layout

- A linear **8pt** scale for sizes and spacing; **4pt** only as a half-step for icons and text adjustments. In Apis: `space-1` (4) and `space-3` (12) are the only values off the 8s, and they are for details only.
- A **4pt baseline grid**: every line height is divisible by 4. All Apis text styles follow it; if you add one, it must too.
- Never odd bases (5pt): centring on odd values splits pixels and blurs, especially on 1.5x screens.
- Choose the strategy per component:
  - **element-first**: the size is fixed (buttons, inputs → `size-control-*`), the padding adapts;
  - **content-first**: the padding is fixed (tables, cards), the size follows the content.
- Decide whether borders sit inside or outside the measurement. In Apis: inside (`box-sizing: border-box`).
- A **12-column** grid by default (it divides by 2, 3, 4, 6). 4 columns on mobile, 8 on tablet.
- State the scaling model: the site is **responsive** (fluid); dense internal apps can be **strict** inside data containers (the table scrolls, the page does not).
- Adopt it from buttons to fields, then everything else. Developers apply the grid in code: no hand-written spacing values.

## 2. Iconography

- Sizes in multiples of 8: **16 / 24 / 32px**. Draw the largest first and simplify going down.
- Product icons: **1 colour**. Marketing: **2 at most**. From 3 colours up it is an illustration.
- Straight lines snapped to the pixel grid; optical padding equal to the stroke width.
- One style per set: all stroked (Apis: 2px stroke), the same corner and cap type (Apis: rounded), gaps between strokes equal to the stroke width.
- Never stroked icons below 10px (Apis: 16px minimum).
- **Name what is shown, not the concept**: `stopwatch`, not `speed`. Hyphens for several words (`chef-hat`), a slash for variants (`hexagon/filled`). Organisation: size > category > name.
- No live text inside icons; merged shapes, no stray paths before export. Export SVG.
- New icons go through a central review before they enter the library. In Apis the library is Lucide plus the internal icons of `Icon`.

## 3. Typography

- Start from the base body size and a line height of about **1.5x** (Apis: 16/24).
- The line height is the baseline grid: every size rests on it.
- The brand typeface goes on display styles; long text needs a legible typeface. Apis: Bricolage Grotesque only for `display`/`headline`/`title`, Instrument Sans for everything else.
- Few weights and styles. **Try a larger size first, then an extra weight.**
- Define how sizes and line heights change per viewport; display styles change the most (see the mobile rules in `brand-book.md`).
- Every value lives in a token, never hand-written; every size is tied to a weight and a style.
- Cover all roles: helper text, label, body, subtitle, title.

## 4. Content strategy

- Writing rules live in each component's documentation, next to the visual specs.
- One position on capitalisation. Apis: **sentence case everywhere**, in Italian and in English (exception: `overline`).
- A **glossary** that settles competing verbs (delete/remove/archive, download/export/share), with right and wrong examples.
- **Empty states** unblock the user: they say what the user needs to know for the feature to become useful.
- **Errors** have a firm tone (Apis: factual, no apologies) and a rule on pronouns (Apis: no first person).
- In **confirmations** the verb in the title is the verb on the button: "Delete the project?" → "Delete project".
- A **template** for each type of message, so anyone writes consistently (see below).
- **Localisation**: room for longer strings (German +30%), no text in images, no sentences assembled from fragments.

Message templates:

| Type | Structure | Example |
|---|---|---|
| Field error | What to fix + example | "Enter an email with an @, for example name@company.ch" |
| System error | What happened + what to do | "Sync stopped at 14:30. Check the SAP credentials and try again." |
| Empty state | What is missing + first step | "No projects yet. Create the first project to start tracking hours." |
| Confirmation | Question with the verb + consequence | "Delete the project? The 48 logged hours will be deleted." → "Delete project" / "Cancel" |
| Success | Object + outcome, in the past tense | "Invoice 2026-118 sent to Rossi SA." |

## 5. The future is semantic

- Tokens are small, reusable, platform-independent decisions: change them once, they update everywhere.
- Name by **intent**, not by value: `accent`, `danger`, `surface-raised`, never `yellow` or `grey-100` in a component.
- Tokens point to other tokens (aliases): `button-primary-background` → `accent` → `pollen-400`.
- **Modes** handle contexts: light and dark (already in `tokens.css`), language, screen size.
- Any reusable decision becomes a variable, even if it is not a classic token (durations, curves, recurring copy).
- Keep primitives to a minimum: Apis has 7 colour families. Before adding one, show that the existing semantic tokens are not enough.

## 6. The future is accessible

- Accessibility is built in from day one, not added later.
- Every component has tested colour pairs (Apis: every pair declared in the tokens passes WCAG AA in both themes).
- Everything works with the keyboard alone, including complex interactions (drag and drop: always offer an alternative with buttons).
- Specs state the accessibility requirements and why, in terms developers can apply.
- Alternative text for every informative image, a label on every button (icon-only too), correct heading order.
- Test with people, not only with tools. A change that makes accessibility worse blocks the release.
- No accessibility overlays and no automatic fixes with AI: semantic markup and clear navigation.
- Fix at system level, so the fix reaches every instance.

## 7. Contributions under control

Three phases for every new or changed component (details in `governance.md`):

1. **Consolidate**: no existing component fits, real use cases, impact on the other components.
2. **Define**: a spec ready for development (anatomy, tokens, states, options, types, behaviour per viewport): the "definition of ready".
3. **Conform**: code, design and documentation match; checklist complete; adoption guide.

A component is accepted only if it is clearly defined and identical in code, design and documentation. A checklist item is postponed only by an explicit decision, written in the changelog.

## 8. Defining components together

- Write the **purpose statement** first ("Purpose: ask the user for a confirmation"). The name and the behaviour follow from it.
- Structure of the sheet: purpose, description, usage, do and don't, rationale, alternatives considered, limits.
- Vague words are banned ("sometimes", "in general", "usually", "in case"): write precise conditions for when to use it and when not to.
- Components that look alike but have different purposes stay **separate**: a dialog that confirms, a message that warns about something irreversible, a popover that shows details anchored to an element.
- A new use case is compared with the purpose: if it does not fit, a new component is created with its own purpose.
- The definition works if it prevents wrong uses and lets you change the component without fear.

## 9. Layered structure (the Thumbtack model)

- **Tokens** (colour, type, radii, spacing, sizes, shadows) → **CSS classes** (`ap-*`) → **components** (React `window.Apis`).
- Token chain: component → semantic → primitive.
- Each layer can be adopted on its own: a Groovy or Razor app can use only `tokens.css` + `apis.css`; a Next.js site also uses the React components.
- Documented escape hatches to the layer below: if a component is not enough, go down to the classes or the tokens, never to raw values.
- "Pit of success": the right thing is the easiest; the wrong thing is awkward but possible.

## 10. Beyond platforms (the Spotify model)

- Concentric layers: shared foundations (tokens, colour, type) → a common layer → subsystems per platform. Change at the centre and the change spreads.
- For each component a **common sheet** with glossary, anatomy, variants, platform notes, accessibility requirements.
- **Primary / secondary / tertiary** buttons with a single sizing system across all platforms; only details such as the focus style change.

## 11. Six myths to let go

1. A small team (or a single person) benefits too.
2. Techniques are chosen for the goals, not for fashion.
3. Do not copy Material: the system reflects its own brand.
4. Start from open source and adapt it (Apis uses Lucide and Google Fonts).
5. A system frees creativity instead of stifling it.
6. Design system work is strategy and adoption, not only components.
