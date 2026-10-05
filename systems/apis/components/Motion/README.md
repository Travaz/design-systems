# Motion

**Classi:** `[data-ap-reveal]` (+ `--ap-i` per l'ordine), `ap-rise`, `ap-cell-in`, `ap-cell-open`, `ap-cell`; script `apis-motion.js` (`Apis.motion.reveal()`, `Apis.motion.toggleTheme(button)`)

Scopo: dare orientamento e ritmo a una pagina con pochi movimenti riconoscibili, sempre gli stessi, senza mai impedire la lettura.

**Pattern**
- **Reveal** (`data-ap-reveal`): i blocchi entrano dal basso di 24px quando arrivano nello schermo, in `duration-reveal` con `ease-standard`. Fratelli in sequenza a passi di `duration-stagger`, al massimo 5 passi.
- **Rise** (`ap-rise` + `style="--ap-i: n"`): l'ingresso al caricamento, solo nell'hero. Curva `ease-emphasis`.
- **Cell-in** (`ap-cell-in`): le celle del favo che si assemblano attorno al ritratto. Solo nell'hero.
- **Cell-open** (`ap-cell-open` su un `ap-cell`): il ritratto che si apre come una cella. Una volta per sito.
- **Theme reveal**: il cambio tema si allarga a cerchio dal bottone (`Apis.motion.toggleTheme(this)`).

**Regole**
- Un solo momento orchestrato per pagina (l'ingresso dell'hero). Tutto il resto è reveal discreto.
- Il contenuto è visibile anche senza JavaScript: lo script aggiunge `.ap-motion` a `<html>` e solo allora gli elementi partono nascosti.
- Con `prefers-reduced-motion` lo script non attiva nulla e le durate dei token vanno a zero.
- Hover e pressione restano in `duration-fast`; aperture di menu e dialoghi in `duration-slow`.

- Don't: animare testo lungo parola per parola, parallax sullo scroll, movimenti in loop vicino al testo (il ticker si ferma al passaggio del mouse).
