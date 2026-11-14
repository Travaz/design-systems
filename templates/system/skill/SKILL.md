---
name: {{id}}-design-system
description: {{Name}}, a design system by Daniel Travaglia. Use it when you design, build or review a UI that must follow {{Name}}, or when the user names "{{Name}}" or `{{prefix}}` classes. UPDATE this description with the exact contexts where it applies.
---

# {{Name}}

Version {{version}}. Published design system: {{artifactUrl}}

Single source: `{{sourceDir}}`. This skill is generated from there: do not edit it by hand.

## What is in this skill

| File | When to read it |
|---|---|
| `references/brand-book.md` | Always, before writing UI. |
| `references/tokens.md` | For exact token names and values. |
| `references/principles.md` | When a case is not covered. |
| `references/governance.md` | When you add or change tokens and components. |
| `assets/tokens.css`, `assets/{{id}}.css`, `assets/tailwind.css`, `assets/tokens.json` | To use in the project. |

## Rules

- Only semantic tokens (`surface`, `ink`, `accent`, `space-*`…), never hand-written values or primitives.
- AA contrast in every theme, focus always visible.

## When the user asks to change {{Name}}

Edit the source in `{{sourceDir}}`, then from the root of the collection: `npm run check -- {{id}}`, update the version and `CHANGELOG.md`, `npm run release -- {{id}}`.

## Changelog

{{changelog}}
