# Badge

**Classes:** `ap-badge ap-badge--neutral|accent|success|warning|danger|info`

Purpose: label the status or category of an object with one or two words.

**Tones:** `neutral` (default), `accent` (new, highlighted: one per list), `success`, `warning`, `danger`, `info`. With `icon`, the status tones show their icon: use it when the badge is the only signal of the status.

**The consumer provides:** `children` (one or two words), `tone`, optional `icon`.

**Text:** a noun or participle, capitalised first letter: "Paid", "Overdue", "Draft". Not sentences.

- Don't: clickable badges. To filter, use a `tertiary` button.
