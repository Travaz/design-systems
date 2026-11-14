# Card

**Classes:** `ap-card` (+ `ap-card--interactive` on `<a>`) > `ap-card__eyebrow`, `ap-card__title`, `ap-card__body`, `ap-card__footer`

Purpose: group the information about a single object (a project, an article, a client) in a block that can be scanned and compared.

**Anatomy:** optional eyebrow (`accent-text`, uppercase) · title · body · optional footer with actions or metadata.

**The consumer provides:** `title`, optional `eyebrow`, `children`, `footer`, `href` (makes the whole card a link, with hover in `elevation-2`), `titleAs` for the correct heading level in the page, `as` to change the container element (default `article`).

- Do: cards in the same row with the same structure and content-driven heights.
- Don't: cards inside cards. Don't: more than one link or button inside a card with `href`.
