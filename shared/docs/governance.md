# Apis governance

How the system grows without losing consistency. It applies to new components, new tokens and changes to existing ones.

## Before adding something

Answer in writing:

1. What is the real need? Name at least two concrete screens or cases (site or apps).
2. Why does no existing component or token cover it? Try composing the existing ones first.
3. What is the purpose statement? ("Purpose: …")
4. What changes for the other components?

If the answer to 2 is "a variant is enough", check that the variant has the **same purpose**. Different purpose = new component.

## Definition of ready (phase 2)

A component is ready for development when its sheet contains:

- [ ] Purpose statement and a one-line description
- [ ] When to use it and when not to, with precise conditions (no "usually", "sometimes")
- [ ] Alternatives considered and why they were rejected
- [ ] Anatomy: the parts, with the names of the `ap-*` classes
- [ ] Tokens used: only semantic or component tokens, never primitives or raw values
- [ ] Sizes on the 8pt grid (4 only for details), line heights in multiples of 4
- [ ] Spacing strategy: element-first or content-first
- [ ] Variants and sizes (`sm`/`md`/`lg` where relevant)
- [ ] States: rest, hover, focus, pressed, selected, disabled, error, loading (the ones that apply)
- [ ] Behaviour from 360px to 1440px
- [ ] Copy: labels, capitalisation, error and empty-state messages, following the templates
- [ ] Accessibility: ARIA role, accessible name, keyboard (which keys do what), focus, screen reader announcements
- [ ] What the consumer provides (props, content, container)

## Conformance (phase 3)

Before it counts as part of the system:

- [ ] CSS in `apis.css` and React component in `apis-react.js`, types in `apis-react.d.ts`
- [ ] Sheet in `references/components.md` and in the published design system
- [ ] Contrast checked in light **and** dark: text 4.5:1, text ≥24px or bold ≥19px 3:1, control borders, focus and icons 3:1
- [ ] Keyboard navigation actually tried
- [ ] Tried with `prefers-reduced-motion` and at 200% zoom
- [ ] Code, design and documentation say the same thing
- [ ] Changelog entry

## Adding a token

- A new **semantic** token is added when an intent recurs in at least two components. It is declared in both themes, with a usage note that names the surfaces it is legible on, and with its contrast measured.
- A new **primitive** is added only if no existing primitive can serve the new semantic token.
- A **component token** lives in `apis.css` and points only to a semantic token.
- Names: lowercase, hyphens, by intent. Never the value in the name.
- In usage notes and copy, contrast ratios are written as the placeholder `{{contrast fg on bg}}`: the build computes them, so the documentation cannot say something false.

## Versions

Semver on the skill and design system package:

- **Major**: a token renamed or removed, a prop removed, a breaking change in behaviour.
- **Minor**: a new token, component, variant or prop.
- **Patch**: a fix to a value, a contrast or a piece of copy.

Every release has an entry at the top of `CHANGELOG.md` (date · version · what changed), which also ends up at the bottom of `SKILL.md`, and a git tag `<id>@<version>` with a GitHub Release, both created by CI.

## The release flow

Each design system lives in `design-systems/systems/<id>/` and is the **single source**: the skill, the package for the sites, the published design system files and the copies in the projects are generated. Never edit a generated file.

1. Edit the source (`tokens.json`, `css/`, `components/`, `docs/`).
2. `npm run check -- <id>`: contrast of every declared pair in every theme, 4/8 grid, token names and usage notes, component CSS without primitives or hand-written colours, and tokens that exist in the CSS of the sites that use the system. It must finish with 0 errors.
3. Update `version` in `system.json` and add the entry at the top of `CHANGELOG.md`.
4. `npm run release -- <id>`: rebuilds, reinstalls the skill in `~/.claude/skills/` and updates the copies in the sites listed in `consumers`.
5. Publish `dist/<id>/artifact/` to the design system at the same link (Claude does this).
