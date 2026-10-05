# DataTable

**Classi:** `ap-table-wrap` > `table.ap-table` (+ `ap-table--compact`); numeric cells `is-num`

Scopo: mostrare molti record con gli stessi campi, da scorrere, confrontare e ordinare.

**Spaziatura guidata dal contenuto:** il padding delle celle è fisso, l'altezza delle righe segue il testo. `density="compact"` per le app molto dense.

**Chi lo usa fornisce:** `columns` (`[{key, label, numeric?, render?}]`), `rows` (oggetti con un `id`), opzionali `caption`, `density`, `scrollable` (rende il contenitore focalizzabile per lo scorrimento da tastiera).

**Regole:** numeri allineati a destra in `data` con cifre tabulari; testo a sinistra; intestazioni in `ink-muted`, maiuscola iniziale; stato con `Badge`, mai con il solo colore del testo. La tabella scorre in orizzontale nel suo contenitore, mai la pagina.

- Do: una `caption` che dice cosa contiene la tabella.
- Don't: righe a colori alterni; il bordo `line` e l'hover bastano.
