# Principi di Apis (da designsystems.com)

Le regole operative che Apis eredita dalle guide di designsystems.com (la pubblicazione di Figma sui design system). Ogni sezione dice cosa significa in pratica dentro Apis. Quando una richiesta non è coperta da `brand-book.md` o `components.md`, decidi partendo da qui.

## 1. Spazio, griglie e layout

- Scala lineare da **8pt** per dimensioni e spazi; **4pt** solo come mezzo passo per icone e ritocchi di testo. In Apis: `space-1` (4) e `space-3` (12) sono gli unici valori fuori dagli 8, e servono solo per dettagli.
- **Baseline grid da 4pt**: ogni interlinea è divisibile per 4. Tutti gli stili di testo di Apis lo rispettano; se ne aggiungi uno, anche lui.
- Mai basi dispari (5pt): centrare su valori dispari spezza i pixel e sfoca, soprattutto su schermi 1.5x.
- Scegli la strategia per componente:
  - **element-first**: la dimensione è fissa (bottoni, input → `size-control-*`), il padding si adatta;
  - **content-first**: il padding è fisso (tabelle, card), la dimensione segue il contenuto.
- Decidi se i bordi stanno dentro o fuori la misura. In Apis: dentro (`box-sizing: border-box`).
- Griglia a **12 colonne** di default (si divide per 2, 3, 4, 6). Su mobile 4 colonne, su tablet 8.
- Dichiara il modello di scala: il sito è **responsive** (fluido); le app interne dense possono essere **strict** dentro i contenitori di dati (la tabella scorre, la pagina no).
- Si adotta dai bottoni ai campi, poi al resto. Gli sviluppatori applicano la griglia nel codice: nessun valore di spazio scritto a mano.

## 2. Iconografia

- Dimensioni multiple di 8: **16 / 24 / 32px**. Si disegna prima la più grande e si semplifica scendendo.
- Icone di prodotto: **1 colore**. Marketing: **2 al massimo**. Da 3 colori in su è un'illustrazione.
- Linee dritte agganciate alla griglia dei pixel; padding ottico pari allo spessore del tratto.
- Un solo stile per set: tutte a tratto (Apis: tratto 2px), stesso tipo di angolo e di terminale (Apis: arrotondati), spazi tra i tratti pari allo spessore.
- Mai icone a tratto sotto i 10px (Apis: minimo 16px).
- **Nomi per ciò che si vede, non per il concetto**: `stopwatch`, non `speed`. Trattini per più parole (`chef-hat`), barra per le varianti (`hexagon/filled`). Organizzazione: dimensione > categoria > nome.
- Niente testo vivo dentro le icone; forme unite, nessun tracciato vagante prima dell'esportazione. Esporta SVG.
- Le nuove icone passano da una revisione centrale prima di entrare nella libreria. In Apis la libreria è Lucide più le icone interne di `Icon`.

## 3. Tipografia

- Si parte dal corpo di base e da un'interlinea di circa **1.5x** (Apis: 16/24).
- L'interlinea è la baseline grid: ogni dimensione ci si appoggia.
- Il carattere di marca va sui display; per il testo lungo serve un carattere leggibile. Apis: Bricolage Grotesque solo per `display`/`headline`/`title`, Instrument Sans per tutto il resto.
- Pochi pesi e stili. **Prima prova una dimensione più grande, poi un peso in più.**
- Definisci come dimensioni e interlinee cambiano per viewport; i display cambiano di più (vedi le regole mobile in `brand-book.md`).
- Ogni valore vive in un token, mai scritto a mano; ogni dimensione è legata a un peso e a uno stile.
- Copri tutti i ruoli: testo d'aiuto, etichetta, corpo, sottotitolo, titolo.

## 4. Strategia dei contenuti

- Le regole di scrittura stanno nella documentazione di ogni componente, accanto alle specifiche visive.
- Una sola posizione sulle maiuscole. Apis: **maiuscola solo a inizio frase ovunque**, in italiano e in inglese (eccezione: `overline`).
- Un **glossario** che risolve i verbi in conflitto (elimina/rimuovi/archivia, scarica/esporta/condividi), con esempi giusti e sbagliati.
- Gli **stati vuoti** sbloccano l'utente: dicono cosa serve sapere perché la funzione diventi utile.
- Gli **errori** hanno un tono deciso (Apis: fattuale, nessuna scusa) e una regola sul pronome (Apis: niente prima persona).
- Nelle **conferme** il verbo del titolo è quello del bottone: "Eliminare il progetto?" → "Elimina progetto".
- Un **modello** per ogni tipo di messaggio, così chiunque scrive in modo coerente (vedi sotto).
- **Localizzazione**: spazio per stringhe più lunghe (tedesco +30%), niente testo nelle immagini, niente frasi composte da pezzi.

Modelli di messaggio:

| Tipo | Struttura | Esempio |
|---|---|---|
| Errore di campo | Cosa correggere + esempio | "Inserisci un'email con la @, per esempio nome@azienda.ch" |
| Errore di sistema | Cosa è successo + cosa fare | "La sincronizzazione si è fermata alle 14:30. Controlla le credenziali di SAP e riprova." |
| Stato vuoto | Cosa manca + primo passo | "Nessun progetto ancora. Crea il primo progetto per iniziare a tracciare le ore." |
| Conferma | Domanda con il verbo + conseguenza | "Eliminare il progetto? Le 48 ore registrate verranno eliminate." → "Elimina progetto" / "Annulla" |
| Successo | Oggetto + esito, al passato | "Fattura 2026-118 inviata a Rossi SA." |

## 5. Il futuro è semantico

- I token sono piccole decisioni riutilizzabili e indipendenti dalla piattaforma: si cambiano una volta, si aggiornano ovunque.
- Si nomina per **intenzione**, non per valore: `accent`, `danger`, `surface-raised`, mai `yellow` o `grey-100` in un componente.
- I token rimandano ad altri token (alias): `button-primary-background` → `accent` → `pollen-400`.
- Le **modalità** gestiscono i contesti: chiaro/scuro (già in `tokens.css`), lingua, dimensione dello schermo.
- Qualsiasi decisione riutilizzabile diventa una variabile, anche se non è un token classico (durate, curve, testi ricorrenti).
- Primitivi ridotti al minimo: Apis ha 7 famiglie di colore. Prima di aggiungerne una, dimostra che i semantici esistenti non bastano.

## 6. Il futuro è accessibile

- L'accessibilità si costruisce dal primo giorno, non si aggiunge dopo.
- Ogni componente ha coppie colore testate (Apis: tutte le coppie dichiarate nei token superano WCAG AA in entrambi i temi).
- Tutto funziona solo con la tastiera, comprese le interazioni complesse (trascinamento: offri sempre un'alternativa con i bottoni).
- Le specifiche riportano i requisiti di accessibilità e il loro perché, in termini che gli sviluppatori possono applicare.
- Testo alternativo per ogni immagine informativa, etichetta su ogni bottone (anche solo icona), ordine dei titoli corretto.
- Si testa con persone, non solo con strumenti. Una modifica che peggiora l'accessibilità blocca il rilascio.
- Niente overlay di accessibilità e niente correzioni automatiche con l'AI: markup semantico e navigazione chiara.
- Si corregge a livello di sistema, così la correzione arriva in ogni istanza.

## 7. Contributi sotto controllo

Tre fasi per ogni componente nuovo o cambiato (dettagli in `governance.md`):

1. **Consolidare**: nessun componente esistente va bene, casi d'uso reali, impatto sugli altri componenti.
2. **Definire**: specifica pronta per lo sviluppo (anatomia, token, stati, opzioni, tipi, comportamento per viewport): la "definition of ready".
3. **Rendere conforme**: codice, design e documentazione coincidono; checklist completa; guida all'adozione.

Un componente è accettato solo se è definito con chiarezza ed è uguale in codice, design e documentazione. Un elemento della checklist si rimanda solo con una decisione esplicita, scritta nel changelog.

## 8. Definire i componenti insieme

- Si scrive prima la **frase di scopo** ("Scopo: chiedere all'utente una conferma"). Nome e comportamento ne derivano.
- Struttura della scheda: scopo, descrizione, uso, do/don't, motivazione, alternative considerate, limiti.
- Vietate le parole vaghe ("a volte", "in generale", "di solito", "nel caso"): si scrivono condizioni precise di quando usarlo e quando no.
- Componenti che si somigliano ma hanno scopi diversi restano **separati**: un dialogo che conferma, un messaggio che informa di qualcosa di irreversibile, un popover che mostra dettagli ancorati a un elemento.
- Un nuovo caso d'uso si confronta con lo scopo: se non ci sta, nasce un componente nuovo con il suo scopo.
- La definizione funziona se impedisce gli usi sbagliati e permette di cambiare il componente senza paura.

## 9. Struttura a strati (il modello Thumbtack)

- **Token** (colore, tipo, raggi, spazi, dimensioni, ombre) → **classi CSS** (`ap-*`) → **componenti** (React `window.Apis`).
- Catena dei token: componente → semantico → primitivo.
- Ogni strato si adotta da solo: un'app Groovy o Razor può usare solo `tokens.css` + `apis.css`; un sito Next.js usa anche i componenti React.
- Vie di fuga verso lo strato inferiore, documentate: se un componente non basta, scendi alle classi o ai token, mai ai valori grezzi.
- "Pozzo del successo": la cosa giusta è la più facile; quella sbagliata è scomoda ma possibile.

## 10. Oltre le piattaforme (il modello Spotify)

- Livelli concentrici: fondamenta condivise (token, colore, tipo) → livello comune → sottosistemi per piattaforma. Si cambia al centro e il cambiamento si propaga.
- Per ogni componente una **scheda comune** con glossario, anatomia, varianti, note per piattaforma, requisiti di accessibilità.
- Bottoni **primario / secondario / terziario** con un solo sistema di dimensioni su tutte le piattaforme; cambiano solo dettagli come lo stile del focus.

## 11. Sei miti da lasciare andare

1. Anche un team piccolo (o una persona sola) ne trae vantaggio.
2. Le tecniche si scelgono per gli obiettivi, non per moda.
3. Non si copia Material: il sistema riflette il proprio marchio.
4. Si parte dall'open source e lo si adatta (Apis usa Lucide e Google Fonts).
5. Un sistema libera la creatività invece di soffocarla.
6. Il lavoro sul design system è strategia e adozione, non solo componenti.
