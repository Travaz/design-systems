# Checkbox

**Classes:** `label.ap-check` > `input[type=checkbox]` + `ap-check__text` + `ap-check__hint`

Purpose: turn an independent option on or off, or choose more than one from a list. The effect happens when the form is saved; for an immediate effect use `Switch`.

**The consumer provides:** `label`, optional `hint`, and the attributes of `<input type="checkbox">` (`checked`, `defaultChecked`, `onChange`, `disabled`, `name`).

**Text:** the label describes the on state in positive terms: "Send a weekly summary", not "Don't send emails".

- Do: in a group, use a `<fieldset>` with a `<legend>`.
