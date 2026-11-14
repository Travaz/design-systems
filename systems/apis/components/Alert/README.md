# Alert

**Classes:** `ap-alert ap-alert--{tone}` > `ap-alert__icon`, `ap-alert__title`, `ap-alert__body`, `ap-alert__action`

Purpose: communicate a message that concerns the whole page or a section, and that stays until the situation changes.

**Tones:** `info`, `success`, `warning`, `danger`. Each tone has its own icon and an accessible name ("Error", "Warning"…): colour is never the only signal. `warning` and `danger` are announced immediately (`role="alert"`), the others politely (`role="status"`).

**The consumer provides:** `tone`, `title` (one sentence), optional `children` (detail) and `action` (a `Button` `sm`).

**Text:** the title says what happened; the detail says what to do. "Sync stopped at 14:30." + "Check the SAP credentials and try again."

- Don't: alerts for passing confirmations ("Saved"): those are a toast.
- Don't: more than one alert of the same tone stacked on top of each other; merge them.
