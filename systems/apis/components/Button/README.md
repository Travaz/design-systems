# Button

**Classi:** `ap-btn ap-btn--primary|secondary|tertiary|danger` + `ap-btn--sm|lg`

Scopo: avviare un'azione. Un bottone fa qualcosa; un link porta da qualche parte (per la navigazione usa `href`, che rende un `<a>`).

**Varianti**
- `primary`: giallo `accent` con testo `on-accent`. Al massimo **uno per vista**, per l'azione per cui la vista esiste.
- `secondary` (predefinito): fondo `surface-raised`, bordo `line-strong`. Azioni alternative.
- `tertiary`: senza fondo né bordo. Azioni a bassa enfasi, barre degli strumenti, "Annulla".
- `danger`: riempimento `danger`. Solo per l'azione che distrugge qualcosa, di solito dentro una conferma.

**Dimensioni:** `sm` (32px, tabelle e toolbar delle app), `md` (40px, predefinito), `lg` (48px, sito e mobile).

**Chi lo usa fornisce:** `children` (l'etichetta), `onClick` oppure `href`, opzionali `iconStart`/`iconEnd` (nome di `Icon`), `loading`, `disabled`.

**Testo:** verbo + oggetto, maiuscola solo iniziale: "Crea progetto", "Scarica fattura". Mai "OK", "Sì", "Clicca qui".

**Do / Don't**
- Do: un primario a destra nei dialoghi, a sinistra nei moduli a pagina intera.
- Do: `loading` mentre l'azione è in corso; il bottone resta largo uguale.
- Don't: due primari affiancati, o un primario per "Annulla".
- Don't: bottoni con solo icona senza `aria-label`.
