# TextField

**Classi:** `ap-field` > `ap-label` + `ap-hint` + `ap-input` (`aria-invalid="true"`) + `ap-error-text`

Scopo: far inserire all'utente un testo breve o, con `multiline`, un testo lungo.

**Anatomia:** etichetta (sempre visibile) · aiuto opzionale · campo · messaggio d'errore. Aiuto ed errore sono collegati al campo con `aria-describedby`.

**Chi lo usa fornisce:** `label`, opzionali `hint`, `error`, `required`, `multiline`, e qualsiasi attributo di `<input>` (`type`, `value`, `onChange`, `placeholder`, `autoComplete`).

**Stati:** riposo (bordo `line-strong`), hover, focus (anello `focus`), errore (bordo `danger` da 2px + messaggio con icona), disabilitato.

**Testo**
- Etichetta: sostantivo, senza due punti: "Email di fatturazione".
- Aiuto: cosa serve sapere prima di scrivere: "La ricevi ogni mese".
- Errore: cosa correggere: "Inserisci un'email con la @, per esempio nome@azienda.ch".
- Il segnaposto è solo un esempio di formato, mai l'etichetta.

- Do: valida all'uscita dal campo, non a ogni tasto.
- Don't: segnare con l'asterisco i campi facoltativi; segna gli obbligatori, o scrivi "(facoltativo)" se sono la minoranza.
