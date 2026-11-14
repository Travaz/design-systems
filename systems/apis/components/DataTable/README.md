# DataTable

**Classes:** `ap-table-wrap` > `table.ap-table` (+ `ap-table--compact`); numeric cells `is-num`, cells that never wrap `is-nowrap`

Purpose: show many records with the same fields, to scan, compare and sort.

**Content-driven spacing:** cell padding is fixed, row height follows the text. `density="compact"` for very dense apps.

**The consumer provides:** `columns` (`[{key, label, numeric?, nowrap?, render?}]`), `rows` (objects with an `id`), optional `caption`, `density`, `scrollable` (makes the container focusable for keyboard scrolling).

**Rules:** identifiers, dates, codes and amounts never wrap: `numeric` for numbers (right-aligned, tabular figures), `nowrap` for document numbers, dates and codes. On a phone the table scrolls horizontally inside its container. Numbers right-aligned in `data` with tabular figures; text on the left; headers in `ink-muted`, sentence case; status with `Badge`, never with text colour alone. The table scrolls horizontally inside its container, never the page.

- Do: a `caption` that says what the table contains.
- Don't: zebra-striped rows; the `line` border and the hover are enough.
