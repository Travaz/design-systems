# Button

**Classes:** `ap-btn ap-btn--primary|secondary|tertiary|danger` + `ap-btn--sm|lg`

Purpose: start an action. A button does something; a link takes you somewhere (for navigation use `href`, which renders an `<a>`).

**Variants** (`variant`)
- `primary`: yellow `accent` with `on-accent` text. At most **one per view**, for the action the view exists for.
- `secondary` (default): `surface-raised` background, `line-strong` border. Alternative actions.
- `tertiary`: no background or border. Low-emphasis actions, toolbars, "Cancel".
- `danger`: `danger` fill. Only for the action that destroys something, usually inside a confirmation.

**Sizes** (`size`): `sm` (32px, tables and app toolbars), `md` (40px, default), `lg` (48px, website and mobile).

**The consumer provides:** `children` (the label), `onClick` or `href`, optional `iconStart`/`iconEnd` (an `Icon` name), `loading`, `disabled`.

**Text:** verb + object, sentence case: "Create project", "Download invoice". Never "OK", "Yes", "Click here".

**Do / Don't**
- Do: one primary on the right in dialogs, on the left in full-page forms.
- Do: `loading` while the action is in progress; the button keeps the same width.
- Don't: two primaries side by side, or a primary for "Cancel".
- Don't: icon-only buttons without `aria-label`.
