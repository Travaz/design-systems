# Card

**Classi:** `ap-card` (+ `ap-card--interactive` on `<a>`) > `ap-card__eyebrow`, `ap-card__title`, `ap-card__body`, `ap-card__footer`

Scopo: raggruppare le informazioni su un solo oggetto (un progetto, un articolo, un cliente) in un blocco che si può scorrere e confrontare.

**Anatomia:** occhiello opzionale (`accent-text`, maiuscolo) · titolo · corpo · piè di pagina opzionale con azioni o metadati.

**Chi lo usa fornisce:** `title`, opzionali `eyebrow`, `children`, `footer`, `href` (rende tutta la card un link, con hover in `elevation-2`), `titleAs` per il livello del titolo corretto nella pagina, `as` per cambiare l'elemento contenitore (predefinito `article`).

- Do: card della stessa riga con la stessa struttura e altezze guidate dal contenuto.
- Don't: card dentro card. Don't: più di un link o bottone dentro una card con `href`.
