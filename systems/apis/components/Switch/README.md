# Switch

**Classi:** `button.ap-switch[role=switch][aria-checked]` > `ap-switch__track` > `ap-switch__thumb`

Scopo: attivare o disattivare un'impostazione con effetto immediato, senza bottone "Salva".

**Chi lo usa fornisce:** `label`, `checked` + `onChange` (controllato) oppure `defaultChecked`, opzionale `disabled`. Si attiva con clic o Spazio; ha `role="switch"`.

**Testo:** il nome dell'impostazione, non un'azione: "Modalità manutenzione", non "Attiva la manutenzione". Non cambiare l'etichetta tra acceso e spento.

- Don't: usarlo dentro un modulo che si salva con un bottone; lì serve `Checkbox`.
