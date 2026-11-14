# Switch

**Classes:** `button.ap-switch[role=switch][aria-checked]` > `ap-switch__track` > `ap-switch__thumb`

Purpose: turn a setting on or off with immediate effect, without a "Save" button.

**The consumer provides:** `label`, `checked` + `onChange` (controlled) or `defaultChecked`, optional `disabled`. It toggles with a click or Space; it has `role="switch"`.

**Text:** the name of the setting, not an action: "Maintenance mode", not "Turn on maintenance". Do not change the label between on and off.

- Don't: use it inside a form that is saved with a button; there you need `Checkbox`.
