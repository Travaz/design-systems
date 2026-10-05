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
- Il testo è `ink`; il testo secondario è `ink-muted`. Entrambi superano 6.5:1 su tutte e tre le superfici in entrambi i temi.
- `accent` è il giallo dell'ape. Usalo come **riempimento**, mai come testo: bottone primario, tab selezionata, switch acceso, un'evidenziazione per vista. Sopra il giallo il testo è sempre `on-accent` (nero carapace, 10.6:1), mai bianco.
- Su fondo chiaro il giallo ha contrasto 1.7:1, quindi ogni riempimento `accent` porta un bordo da 1px in `accent-edge` per restare visibile.
- Quando serve un giallo leggibile come testo (occhielli, etichette), usa `accent-text` su `surface` o su `accent-soft`.
- I link sono `link` (blu borragine), sottolineati a riposo. Il giallo non è mai un link.
- Gli stati usano coppie fisse: `success` su `success-soft`, `warning` su `warning-soft`, `danger` su `danger-soft`, `info` su `info-soft`. Ogni stato ha sempre anche un'icona e una parola, mai solo il colore. `success` (verde prato) e `danger` (rosso propoli) differiscono anche in luminosità.
- Il nero e il giallo affiancati a strisce sono il segnale di attenzione del sistema (come in natura): li usa solo `EnvironmentBanner` e il separatore `ap-stripe`. Non usarli come decorazione.
- Grafici: serie categoriche in ordine fisso `viz-1` … `viz-6`. La prima serie è sempre il giallo. Oltre sei serie, raggruppa in "Altro".
- I token primitivi (`pollen-*`, `comb-*`, `meadow-*`, `borage-*`, `nectar-*`, `propolis-*`, `heather-*`) esistono solo per definire i semantici. Se ti serve un primitivo in un componente, manca un token semantico: aggiungilo.

## Tipografia

Tre famiglie da Google Fonts, ciascuna con un ruolo:

- **Bricolage Grotesque** (`display`): solo `display`, `headline`, `title`. Organica, con piccole irregolarità, come qualcosa fatto a mano.
- **Instrument Sans** (`sans`): tutto il resto, dall'interfaccia al testo lungo.
- **JetBrains Mono** (`mono`): `code` e `data`. I numeri in tabelle e KPI usano `data` con cifre tabulari.

Regole:

- Il testo predefinito è `body` (16/24). Nelle app dense si scende a `body-sm` (14/20), mai sotto 12px.
- Un solo `display` per pagina, solo sul sito. Le app interne partono da `heading` come titolo di pagina.
- Tutte le interlinee sono multipli di 4. Le righe di testo lungo non superano `size-prose` (70 caratteri).
- I titoli hanno `text-wrap: balance`. Gli `overline` sono in maiuscolo con spaziatura 0.08em e non superano tre parole.
- Su mobile (sotto `bp-md`) `display` scende a 40/44, `headline` a 32/40, `title` a 28/36.

## Spazio, griglia e layout

- Usa solo i token `space-*`. Il numero nel nome è un multiplo di 4px: `space-4` = 16px, `space-6` = 24px.
- Componenti a dimensione fissa (bottoni, input): l'altezza viene da `size-control-*`, il padding si adatta. Componenti guidati dal contenuto (tabelle, card): il padding è fisso, l'altezza segue il contenuto.
- I bordi sono inclusi nelle misure (`box-sizing: border-box`).
- Sito: griglia a 12 colonne, contenuto massimo `size-content` (1200px). Margini laterali `space-4` su mobile, `space-6` su tablet, `space-8` su desktop. Tra le sezioni `space-16` (mobile `space-12`).
- App interne: layout fluido, sidebar più area di lavoro; tra i gruppi `space-8`, tra le sezioni `space-12`. Le tabelle dense possono scorrere orizzontalmente nel loro contenitore, mai la pagina.
- Breakpoint: `bp-sm` 640, `bp-md` 768, `bp-lg` 1024, `bp-xl` 1280. Progetta mobile-first.

## Forme ed elevazione

- Gli angoli sono contenuti, come le celle di un favo: `radius-sm` per bottoni, input, badge e tab; `radius-md` per card, alert e menu; `radius-lg` solo per dialoghi e pannelli grandi del sito; `radius-full` per switch, pillole e avatar. Tabelle e fasce a tutta larghezza restano a `radius-none`.
- L'esagono è il motivo del marchio: logo, stati vuoti, icone di categoria. Non trasformare ogni contenitore in un esagono.
- Tre livelli di ombra calda: `elevation-1` card a riposo, `elevation-2` menu e card al passaggio del mouse, `elevation-3` solo dialoghi. Dentro le app dense preferisci un bordo `line` a un'ombra.

## Stati, focus e movimento

- Il focus è sempre visibile: anello pieno da 2px in `focus`, distanziato 2px dal controllo. La distanza fa sì che l'anello tocchi sempre una superficie e mai il riempimento (nemmeno il giallo): supera 10:1 su tutte le superfici, in entrambi i temi. Non togliere mai `outline-offset`.
- Hover: `surface-hover` per elementi neutri, `accent-hover` per il primario. Premuto: `accent-pressed` e 1px verso il basso.
- Disabilitato: riempimento `disabled`, testo `ink-muted`, cursore `not-allowed`, e un motivo spiegato vicino al controllo quando non è ovvio.
- Durate: 120ms per hover e pressione, 200ms per toggle e tab, 320ms per dialoghi. Curva `cubic-bezier(0.2, 0, 0, 1)`: parte veloce e si posa dolcemente, come un'ape che atterra. Con `prefers-reduced-motion` le durate vanno a zero.

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
- Base: `Icon`

### Sito e app interne

Sono lo stesso sistema con due trattamenti. Il **sito** può usare `display` e `headline`, `body-lg`, spazi da `space-16` e `space-24`, `radius-lg`, il giallo in grandi campi. Le **app interne** sono dense e silenziose: titoli da `heading`, testo `body-sm` nelle tabelle, controlli `sm`, un solo bottone primario per vista, il giallo solo per l'azione principale e la selezione. Ogni app interna non di produzione mostra `EnvironmentBanner` in cima.

### Aggiungere o cambiare un componente

Un contributo passa tre fasi, e non si salta una fase:

1. **Consolidare.** Dimostra che nessun componente esistente copre il caso, raccogli almeno due casi d'uso reali, valuta l'impatto sugli altri componenti. Scrivi la frase di scopo.
2. **Definire.** Specifica pronta per lo sviluppo: anatomia, token usati (solo semantici o di componente), stati (riposo, hover, focus, premuto, disabilitato, errore, caricamento), varianti, comportamento da mobile a desktop, regole di testo, requisiti di accessibilità.
3. **Rendere conforme.** Codice, design e documentazione coincidono; contrasti verificati in chiaro e scuro; navigazione da tastiera provata; scheda del componente scritta.

Le versioni seguono semver: un token rinominato o rimosso è una versione maggiore, un token o componente nuovo è minore, una correzione di valore è una patch.
