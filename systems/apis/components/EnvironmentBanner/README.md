# EnvironmentBanner

**Classi:** `ap-envbar` > `ap-envbar__label`; attention divider `ap-stripe`

Scopo: dire a chi usa un'app interna che si trova in un ambiente non di produzione, così non tratta dati di prova come veri (e viceversa).

È l'unico componente che usa la striscia gialla e nera: in natura è il segnale "attenzione", e qui ha lo stesso significato. La striscia resta gialla su nero in entrambi i temi.

**Chi lo usa fornisce:** `env` (`development`, `staging`, `preview`) oppure un `label` libero. Va in cima alla pagina, sopra l'header, a tutta larghezza.

- Don't: mostrarlo in produzione; don't: usare la striscia come decorazione altrove (per un separatore di attenzione c'è la classe `ap-stripe`).
