# Tabs

**Classes:** `ap-tabs[role=tablist]` > `button.ap-tab[role=tab][aria-selected]`; panel `ap-tabpanel`

Purpose: switch between parallel views of the same object without leaving the page.

**The consumer provides:** `items` (`[{id, label, content}]`), `label` (accessible name of the list), `value` + `onChange` or `defaultValue`.

**Keyboard:** left/right arrows move the selection, Home and End go to the ends, Tab moves into the panel.

**Selection:** bold `ink` text and a 3px `accent` bar. Yellow is not the only signal (the text colour and weight change too).

**Text:** one or two words, nouns: "Overview", "Invoices", "Activity".

- Don't: more than 6 tabs; don't: tabs for steps in a sequence (that is a stepper).
