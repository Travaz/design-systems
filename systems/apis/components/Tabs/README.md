# Tabs

**Classi:** `ap-tabs[role=tablist]` > `button.ap-tab[role=tab][aria-selected]`; panel `ap-tabpanel`

Scopo: passare tra viste parallele dello stesso oggetto senza lasciare la pagina.

**Chi lo usa fornisce:** `items` (`[{id, label, content}]`), `label` (nome accessibile della lista), `value` + `onChange` oppure `defaultValue`.

**Tastiera:** frecce sinistra/destra spostano la selezione, Home e Fine vanno agli estremi, Tab entra nel pannello.

**Selezione:** testo `ink` in grassetto e barra `accent` da 3px. Il giallo non è l'unico segnale (cambiano anche colore e peso del testo).

**Testo:** una o due parole, sostantivi: "Panoramica", "Fatture", "Attività".

- Don't: più di 6 tab; don't: tab per passi in sequenza (quello è uno stepper).
