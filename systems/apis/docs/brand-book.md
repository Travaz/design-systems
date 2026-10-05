Apis è il design system di travaz.dev: il sito pubblico e tutte le app interne usano gli stessi token, le stesse regole e gli stessi componenti. Prende i colori dall'ape e dal suo mondo: il giallo del polline, il nero del carapace, il bianco della cera, e poi i fiori e le resine che l'ape visita. Prende l'ordine dall'alveare: una griglia regolare, poche forme ripetute bene, ogni cella con uno scopo.

## Principi

Questi principi vengono da designsystems.com (Figma) e sono la base di ogni decisione qui sotto. Quando una regola non copre un caso, si torna a questi.

1. **Tutto sulla griglia da 8.** Spazi, dimensioni dei controlli e icone sono multipli di 8px. Il mezzo passo da 4px serve solo per dettagli piccoli (icona-etichetta, padding dei badge). Le interlinee sono sempre multipli di 4 (baseline grid). Niente valori dispari.
2. **Tre livelli di token, con alias.** Primitivo (`pollen-400`) → semantico, nominato per intenzione (`accent`) → componente (`button-primary-background`). I componenti non usano mai un primitivo.
3. **Pochi primitivi.** Sei famiglie di colore, tre famiglie di carattere, un numero ridotto di pesi. Per creare gerarchia si aumenta prima la dimensione, poi il peso.
4. **Modalità, non copie.** Chiaro/scuro e le lingue sono modalità degli stessi token, mai componenti duplicati.
5. **Lo scopo prima del nome.** Ogni componente nasce da una frase di scopo ("Scopo: dire all'utente che si trova in un ambiente di test"). Uno scopo nuovo significa un componente nuovo, non una variante in più.
6. **Uno stile per famiglia.** Le icone hanno un solo tratto, un solo tipo di angolo e di terminale; i bottoni sono primario, secondario, terziario in tutte le piattaforme.
7. **Si nomina per cosa è, non per quanto vale.** I token per intenzione (`danger`, non `red`), le icone per ciò che mostrano (`hexagon-plus`, non `add-project`).
8. **Il testo fa parte della specifica.** Regole di scrittura, glossario e modelli di messaggio stanno nella documentazione di ogni componente.
9. **Accessibile di default.** Coppie colore testate in entrambi i temi, tastiera completa, etichette su ogni controllo, ordine dei titoli corretto. Si corregge nel sistema, così la correzione arriva ovunque.
10. **Pronto prima di essere pubblicato.** Un componente entra nel sistema solo quando anatomia, token, stati, varianti e comportamento responsive sono definiti, e codice, design e documentazione coincidono.
11. **A strati, adottabile a pezzi.** Token → classi CSS → componenti React. Ogni strato si usa da solo; si può scendere di uno strato quando serve, ma la strada giusta deve essere la più facile.
12. **Su misura, non copiato.** Apis prende spunto dai sistemi open source ma riflette questo marchio. Le mode passano; le decisioni restano scritte qui.

## Colore

Il sistema è giallo, nero e bianco. Gli altri colori naturali (prato, borragine, nettare, propoli, erica) servono solo per stati e grafici.

- La pagina è `surface` (bianco cera in chiaro, nero alveare in scuro). Le card stanno su `surface-raised`; pozzetti, codice e intestazioni di tabella su `surface-sunken`.
- Il testo è `ink`; il testo secondario è `ink-muted`. Entrambi arrivano almeno a {{contrast ink,ink-muted on surface,surface-raised,surface-sunken}} su tutte e tre le superfici, in entrambi i temi.
- `accent` è il giallo dell'ape. Usalo come **riempimento**, mai come testo: bottone primario, tab selezionata, switch acceso, un'evidenziazione per vista. Sopra il giallo il testo è sempre `on-accent` (nero carapace, {{contrast on-accent on accent}}), mai bianco.
- Su fondo chiaro il giallo ha contrasto {{contrast accent on surface light}}, quindi ogni riempimento `accent` porta un bordo da 1px in `accent-edge` per restare visibile.
- Quando serve un giallo leggibile come testo (occhielli, etichette), usa `accent-text` su `surface` o su `accent-soft`.
- I link sono `link` (blu borragine), sottolineati a riposo. Il giallo non è mai un link.
- Gli stati usano coppie fisse: `success` su `success-soft`, `warning` su `warning-soft`, `danger` su `danger-soft`, `info` su `info-soft`. Ogni stato ha sempre anche un'icona e una parola, mai solo il colore. `success` (verde prato) e `danger` (rosso propoli) differiscono anche in luminosità.
- Il nero e il giallo affiancati a strisce sono il segnale di attenzione del sistema (come in natura): li usa solo `EnvironmentBanner` e il separatore `ap-stripe`. Non usarli come decorazione.
- `surface-inverse` è una fascia scura in **entrambi** i temi (nero ape in chiaro, un gradino sopra la pagina in scuro), con testo `ink-inverse`. Footer, ticker e tooltip non diventano mai bianchi nel tema scuro.
- Grafici: serie categoriche in ordine fisso `viz-1` … `viz-6`. La prima serie è sempre il giallo. Oltre sei serie, raggruppa in "Altro".
- I token primitivi (`pollen-*`, `comb-*`, `meadow-*`, `borage-*`, `nectar-*`, `propolis-*`, `heather-*`) esistono solo per definire i semantici. Se ti serve un primitivo in un componente, manca un token semantico: aggiungilo.

## Tipografia

Tre famiglie da Google Fonts, ciascuna con un ruolo:

- **Bricolage Grotesque** (`display`): solo `display-xl`, `display`, `headline`, `title`. Organica, con piccole irregolarità, come qualcosa fatto a mano.
- **Instrument Sans** (`sans`): tutto il resto, dall'interfaccia al testo lungo.
- **JetBrains Mono** (`mono`): `code` e `data`. I numeri in tabelle e KPI usano `data` con cifre tabulari.

Regole:

- Il testo predefinito è `body` (16/24). Nelle app dense si scende a `body-sm` (14/20), mai sotto 12px.
- `display-xl` è la frase unica di una landing (un nome, un prodotto): una volta per sito, mai nelle app. `display` al massimo una volta per pagina. Le app partono da `heading` come titolo di pagina.
- Tutte le interlinee sono multipli di 4. Le righe di testo lungo non superano `size-prose` (70 caratteri).
- I titoli hanno `text-wrap: balance`. Gli `overline` sono in maiuscolo con spaziatura 0.08em e non superano tre parole.
- I quattro stili display sono **fluidi**: crescono in modo continuo da 360px a 1280px di larghezza (`display-xl` 48/52 → 88/88, `display` 40/44 → 56/60, `headline` 32/40 → 40/48, `title` 28/36 → 32/40). Entrambi gli estremi stanno sulla griglia da 4. Usa le classi `ap-display-xl`, `ap-display`, `ap-headline`, `ap-title` o `font: var(--type-…)`, mai dimensioni scritte a mano o media query per i titoli.

## Spazio, griglia e layout

- Usa solo i token `space-*`. Il numero nel nome è un multiplo di 4px: `space-4` = 16px, `space-6` = 24px.
- Componenti a dimensione fissa (bottoni, input): l'altezza viene da `size-control-*`, il padding si adatta. Componenti guidati dal contenuto (tabelle, card): il padding è fisso, l'altezza segue il contenuto.
- I bordi sono inclusi nelle misure (`box-sizing: border-box`).
- Sito: griglia a 12 colonne, contenuto massimo `size-content` (1200px). Margini laterali `space-4` su mobile, `space-6` su tablet, `space-8` su desktop. Tra le sezioni `space-16` (mobile `space-12`).
- App interne: layout fluido, sidebar più area di lavoro; tra i gruppi `space-8`, tra le sezioni `space-12`. Le tabelle dense possono scorrere orizzontalmente nel loro contenitore, mai la pagina.
- Breakpoint: `bp-sm` 640, `bp-md` 768, `bp-lg` 1024, `bp-xl` 1280. Progetta mobile-first.

## Forme ed elevazione

- Gli angoli sono contenuti, come le celle di un favo: `radius-sm` per bottoni, input, badge e tab; `radius-md` per card, alert e menu; `radius-lg` solo per dialoghi e pannelli grandi del sito; `radius-full` per switch, pillole e avatar. Tabelle e fasce a tutta larghezza restano a `radius-none`.
- L'esagono è il motivo del marchio e ha usi contati: vedi "Dosaggio del marchio".
- Tre livelli di ombra calda: `elevation-1` card a riposo, `elevation-2` menu e card al passaggio del mouse, `elevation-3` solo dialoghi. Dentro le app dense preferisci un bordo `line` a un'ombra.

## Stati e focus

- Il focus è sempre visibile: anello pieno da 2px in `focus`, distanziato 2px dal controllo. La distanza fa sì che l'anello tocchi sempre una superficie e mai il riempimento (nemmeno il giallo): arriva almeno a {{contrast focus on surface,surface-raised,surface-sunken}} su tutte le superfici, in entrambi i temi. Non togliere mai `outline-offset`.
- Hover: `surface-hover` per elementi neutri, `accent-hover` per il primario. Premuto: `accent-pressed` e 1px verso il basso.
- Disabilitato: riempimento `disabled`, testo `ink-muted`, cursore `not-allowed`, e un motivo spiegato vicino al controllo quando non è ovvio.

## Movimento

Il movimento di Apis è quello di un'ape che atterra: parte deciso e si posa con calma. Serve a orientare (cosa è nuovo, cosa è cambiato) e a dare ritmo, mai a decorare.

| Pattern | Dove | Durata e curva |
|---|---|---|
| Hover, pressione, focus | Ogni controllo | `duration-fast` (120ms), `ease-standard` |
| Toggle, tab, piccole aperture | Switch, tab, accordion | `duration-base` (200ms), `ease-standard` |
| Menu, dialoghi, drawer | Livelli sovrapposti | `duration-slow` (320ms), entrata `ease-standard`, uscita `ease-exit` |
| Reveal allo scroll (`data-ap-reveal`) | Blocchi di contenuto | `duration-reveal` (700ms), `ease-standard`, fratelli a passi di `duration-stagger` (90ms), massimo 5 passi |
| Rise all'ingresso (`ap-rise`) | Solo l'hero | `duration-reveal`, `ease-emphasis` |
| Cell-in, cell-open | Solo favo e ritratto dell'hero | `duration-reveal` / 1000ms, `ease-emphasis` |
| Cambio tema | Il bottone del tema | 600ms, cerchio dal bottone, `ease-emphasis` |

- **Un solo momento orchestrato per pagina**: l'ingresso dell'hero. Tutto il resto è reveal discreto o feedback.
- Il contenuto è leggibile senza JavaScript: `apis-motion.js` aggiunge `.ap-motion` a `<html>` e solo allora gli elementi partono nascosti.
- Con `prefers-reduced-motion` lo script non attiva nulla e le durate dei token vanno a zero.
- Niente parallax sullo scroll, niente testo animato parola per parola, niente loop vicino al testo che non si fermino al passaggio del mouse.

## Dosaggio del marchio

Giallo, nero ed esagono sono riconoscibili proprio perché sono pochi. Usati ovunque diventano un cantiere.

- **Esagono**: solo nel marchio, nel ritratto principale (`ap-cell`, una volta per sito), nel favo decorativo dell'hero (una volta per pagina) e nell'icona di `EmptyState`. Non usarlo per elenchi puntati, indicatori della timeline, chip, separatori o cornici di card.
- **Giallo**: o **un grande campo** per pagina (la fascia contatti, la copertina), o **singoli dettagli** (il bottone primario, la barra della tab selezionata, una sottolineatura). Non entrambi nella stessa vista ristretta, e mai sparso su molti piccoli elementi decorativi.
- **Nero e giallo affiancati in grande**: solo nel marchio e nella striscia di attenzione. Non accostare un grande blocco nero a un grande blocco giallo.
- Per elenchi e separatori usa forme neutre: un punto `radius-full` in `ink-muted`, una linea `line`.

## Immagini

- **Fotografie vere**, a colori naturali e luce calda: persone, luoghi di lavoro, prodotti. Niente foto stock generiche e niente illustrazioni.
- **Proporzioni** dai token: `aspect-portrait` (4:5) per le persone, `aspect-cover` (16:10) per progetti e articoli, `aspect-square` per loghi e avatar, `aspect-cell` solo per il ritratto principale. Sempre `object-fit: cover`.
- **Ritratto**: occhi sul terzo superiore (`object-position: 50% 30%`), sfondo semplice, nessun filtro.
- **Screenshot**: dentro un riquadro `radius-md` con bordo `line`, mai inclinati o con ombre finte da dispositivo.
- **Peso**: al massimo 2400px sul lato lungo, in WebP o AVIF, `loading="lazy"` fuori dal primo schermo, `width` e `height` sempre dichiarati.
- **Testo alternativo**: descrive cosa serve sapere ("Ritratto di Daniel Travaglia"), `alt=""` per le immagini decorative.

## Marchio

- Il marchio è una cella del favo (esagono a punta in alto) in `accent` con due bande in `carapace`, su una griglia di 64: esagono di raggio 30 centrato, bande alte 8 a y 22 e 38.
- Spazio libero attorno pari a metà della sua larghezza; dimensione minima 16px.
- Accanto al marchio il nome si scrive in Bricolage Grotesque 700.
- **Stato: provvisorio.** È un segno geometrico di partenza, non un marchio disegnato a mano. Va ridisegnato prima di usarlo fuori dal sito personale.

## Iconografia

- Usa le icone di Lucide (open source): griglia 24px, tratto 2px, terminali e angoli arrotondati. È lo stesso stile delle icone interne di Apis.
- Dimensioni: `size-icon-sm` (16) nei controlli piccoli e accanto a `body-sm`, `size-icon-md` (24) di default, `size-icon-lg` (32) per funzioni e stati vuoti. Non scendere sotto 16px.
- Un solo colore per icona, ereditato con `currentColor`. Due colori al massimo solo sul sito; tre o più è un'illustrazione.
- Nomi per ciò che si vede, in inglese e con trattini: `circle-check`, `hexagon-plus`. Varianti con la barra: `hexagon/filled`.
- Un'icona senza testo ha sempre un'etichetta accessibile (`aria-label`) e un tooltip.

## Contenuti e tono

Apis parla come un artigiano competente: diretto, calmo, preciso. Frasi brevi, verbi attivi, niente punti esclamativi, niente emoji nell'interfaccia.

- **Lingua.** L'italiano è la lingua principale; l'inglese segue le stesse regole. Ci si rivolge all'utente con il "tu" sul sito e nelle app. Il sistema non parla in prima persona ("Non è stato possibile salvare", non "Non siamo riusciti").
- **Maiuscole.** Sempre maiuscola solo a inizio frase, anche in inglese, anche nei bottoni e nelle intestazioni di tabella: "Salva modifiche", "Export report". Unica eccezione: gli `overline`, tutti maiuscoli.
- **Bottoni.** Verbo all'infinito più oggetto: "Crea progetto", "Scarica fattura". Il titolo di una conferma usa lo stesso verbo del bottone che conferma: "Eliminare il progetto?" → "Elimina progetto" / "Annulla".
- **Errori.** Dicono cosa è successo e come rimediare, senza scuse: "La data di fine è prima della data di inizio. Scegli una data dopo il 3 ott." Mai solo "Errore".
- **Stati vuoti.** Dicono cosa comparirà qui e qual è il primo passo: "Nessun progetto ancora. Crea il primo progetto per iniziare a tracciare le ore."
- **Glossario.** *Elimina* = rimuove per sempre; *Rimuovi* = toglie da un gruppo, l'oggetto esiste ancora; *Archivia* = nasconde, si può ripristinare. *Scarica* = file sul dispositivo; *Esporta* = conversione in un altro formato; *Condividi* = accesso per altre persone.
- **Numeri e date.** Formato svizzero-italiano: `CHF 12'480.00`, `1 ott 2026`, `14:30`. Numeri sempre in `data` (cifre tabulari) nelle tabelle.
- **Traduzioni.** Lascia il 30% di spazio in più per il tedesco. Non comporre frasi unendo pezzi di stringhe. Niente testo dentro immagini o icone.

## Accessibilità

- Obiettivo WCAG 2.2 AA: testo 4.5:1, testo grande e controlli 3:1, in entrambi i temi. Le coppie dichiarate nei token sono già verificate; se ne crei una nuova, misurala.
- Tutto funziona da tastiera, nell'ordine di lettura. Tab: frecce sinistra/destra, Home, Fine. Switch: Spazio. Dialoghi: Esc chiude e il focus torna al controllo che li ha aperti.
- Ogni campo ha un `label` visibile; aiuti ed errori sono collegati con `aria-describedby`. Il segnaposto non sostituisce mai l'etichetta.
- Le immagini informative hanno un testo alternativo; quelle decorative `alt=""`.
- Un solo `h1` per pagina, titoli in ordine senza salti.
- Area minima di tocco 44×44px sul mobile (`size-control-lg` per i bottoni principali).
- Niente overlay di accessibilità e niente correzioni automatiche: markup semantico e test con persone reali.

## Componenti

Undici componenti React in `window.Apis`, più le classi `ap-*` per chi non usa React. Ogni componente ha la sua scheda con scopo, quando usarlo, cosa fornisce chi lo usa e regole di scrittura.

- Azioni: `Button`
- Moduli: `TextField`, `Checkbox`, `Switch`
- Feedback: `Alert`, `Badge`, `EmptyState`, `EnvironmentBanner`
- Contenitori e navigazione: `Card`, `Tabs`
- Dati: `DataTable`
- Base: `Icon`, `Motion` (pattern di movimento e script `apis-motion.js`)

### Sito e app interne

Sono lo stesso sistema con due trattamenti. Il **sito** può usare `display` e `headline`, `body-lg`, spazi da `space-16` e `space-24`, `radius-lg`, il giallo in grandi campi. Le **app interne** sono dense e silenziose: titoli da `heading`, testo `body-sm` nelle tabelle, controlli `sm`, un solo bottone primario per vista, il giallo solo per l'azione principale e la selezione. Ogni app interna non di produzione mostra `EnvironmentBanner` in cima.

### Aggiungere o cambiare un componente

Un contributo passa tre fasi, e non si salta una fase:

1. **Consolidare.** Dimostra che nessun componente esistente copre il caso, raccogli almeno due casi d'uso reali, valuta l'impatto sugli altri componenti. Scrivi la frase di scopo.
2. **Definire.** Specifica pronta per lo sviluppo: anatomia, token usati (solo semantici o di componente), stati (riposo, hover, focus, premuto, disabilitato, errore, caricamento), varianti, comportamento da mobile a desktop, regole di testo, requisiti di accessibilità.
3. **Rendere conforme.** Codice, design e documentazione coincidono; contrasti verificati in chiaro e scuro; navigazione da tastiera provata; scheda del componente scritta.

Le versioni seguono semver: un token rinominato o rimosso è una versione maggiore, un token o componente nuovo è minore, una correzione di valore è una patch.
