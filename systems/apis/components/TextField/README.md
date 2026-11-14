# TextField

**Classes:** `ap-field` > `ap-label` + `ap-hint` + `ap-input` (`aria-invalid="true"`) + `ap-error-text`

Purpose: let the user enter a short text or, with `multiline`, a long text.

**Anatomy:** label (always visible) · optional hint · field · error message. Hint and error are linked to the field with `aria-describedby`.

**The consumer provides:** `label`, optional `hint`, `error`, `required`, `multiline`, and any `<input>` attribute (`type`, `value`, `onChange`, `placeholder`, `autoComplete`).

**States:** rest (`line-strong` border), hover, focus (`focus` ring), error (2px `danger` border + message with icon), disabled.

**Text**
- Label: a noun, no colon: "Billing email".
- Hint: what you need to know before typing: "You receive it every month".
- Error: what to fix: "Enter an email with an @, for example name@company.ch".
- The placeholder is only a format example, never the label.

- Do: validate when leaving the field, not on every keystroke.
- Don't: mark optional fields with an asterisk; mark the required ones, or write "(optional)" if they are the minority.
