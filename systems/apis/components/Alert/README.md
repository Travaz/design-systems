# Alert

**Classi:** `ap-alert ap-alert--{tone}` > `ap-alert__icon`, `ap-alert__title`, `ap-alert__body`, `ap-alert__action`

Scopo: comunicare un messaggio che riguarda tutta la pagina o una sezione, e che resta finché la situazione non cambia.

**Toni:** `info`, `success`, `warning`, `danger`. Ogni tono ha la sua icona e un nome accessibile ("Errore", "Attenzione"…): il colore non è mai l'unico segnale. `warning` e `danger` sono annunciati subito (`role="alert"`), gli altri educatamente (`role="status"`).

**Chi lo usa fornisce:** `tone`, `title` (una frase), opzionali `children` (dettaglio) e `action` (un `Button` `sm`).

**Testo:** il titolo dice cosa è successo; il dettaglio dice cosa fare. "La sincronizzazione si è fermata alle 14:30." + "Controlla le credenziali di SAP e riprova."

- Don't: alert per conferme passeggere ("Salvato"): quelle sono un toast.
- Don't: più di un alert dello stesso tono uno sopra l'altro; uniscili.
