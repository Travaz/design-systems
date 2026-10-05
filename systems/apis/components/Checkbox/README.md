# Checkbox

**Classi:** `label.ap-check` > `input[type=checkbox]` + `ap-check__text` + `ap-check__hint`

Scopo: attivare o disattivare un'opzione indipendente, o sceglierne più di una da una lista. L'effetto avviene al salvataggio del modulo; per un effetto immediato usa `Switch`.

**Chi lo usa fornisce:** `label`, opzionale `hint`, e gli attributi di `<input type="checkbox">` (`checked`, `defaultChecked`, `onChange`, `disabled`, `name`).

**Testo:** l'etichetta descrive lo stato attivo in positivo: "Invia un riepilogo settimanale", non "Non inviare email".

- Do: in un gruppo, usa un `<fieldset>` con `<legend>`.
