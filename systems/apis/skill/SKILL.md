---
name: apis-design-system
description: Apis, il design system personale di Daniel Travaglia (travaz.dev), ispirato all'ape — giallo polline, nero carapace, bianco cera e i colori naturali del prato. Usala ogni volta che progetti, costruisci, ristili o revisioni una UI per travaz.dev o per qualsiasi app interna di Daniel; quando scrivi HTML/CSS/Tailwind/React/Vue o template server-side per queste interfacce; quando crei mockup, landing page, dashboard, moduli o tabelle; e quando l'utente nomina "Apis", "il mio design system", "il mio stile", "travaz", "brand", "token", "palette dell'ape" o classi `ap-`, anche se non nomina la skill. Use this skill for any UI work on travaz.dev or Daniel's internal apps (website, dashboard, admin panel, form, component, mockup, restyle, design review) even when the request is in English.
---

# Apis — design system di travaz.dev

Apis è la linea guida unica per il sito travaz.dev e per tutte le app interne. Colori dall'ape (giallo `accent`, nero `carapace`, bianco cera `surface`), ordine dall'alveare (griglia da 8, poche forme ripetute bene), principi da designsystems.com.

Versione {{version}}. Design system pubblicato (riferimento visivo con anteprime live): {{artifactUrl}}

Sorgente unico: `{{sourceDir}}`. Questa skill è generata da lì: non modificarla a mano.

## Cosa c'è in questa skill

| File | Quando leggerlo |
|---|---|
| `references/brand-book.md` | **Sempre, prima di scrivere UI.** Colore, tipo, spazio, forme, stati, icone, tono di voce, accessibilità. |
| `references/tokens.md` | Quando ti serve un valore o un nome di token preciso. |
| `references/components.md` | Quando usi o crei un componente: scopo, classi, props, regole di testo, do/don't. |
| `references/principles.md` | Quando una situazione non è coperta: i principi da designsystems.com, con le regole numeriche. |
| `references/governance.md` | Quando aggiungi o cambi un token o un componente: definition of ready, checklist, versioni. |
| `assets/tokens.css` | Variabili CSS (primitivi + semantici, chiaro/scuro) e `@font-face`. Da copiare nel progetto insieme a `assets/fonts/`. |
| `assets/fonts/` | I tre caratteri in WOFF2 (latino e latino esteso) con le licenze OFL. |
| `assets/apis.css` | Classi `ap-*` dei componenti + token di livello componente. Richiede `tokens.css`. |
| `assets/tailwind.css` | Mappatura per Tailwind v4 (`bg-surface`, `text-ink`, `p-4`, `text-body`…). |
| `assets/apis-react.js` + `.d.ts` | Componenti React (`window.Apis`) e tipi. |
| `assets/apis-motion.js` | Pattern di movimento: reveal allo scroll, sequenze, cambio tema. Va in `<head>` senza `defer`. |
| `assets/tokens.json` | Token in formato W3C DTCG (Style Dictionary, Figma variables, Tokens Studio). |
| `assets/logo/` | `apis-mark.svg` (colore) e `apis-mark-mono.svg` (un inchiostro). |
| `assets/templates/` | `website.html` (trattamento sito) e `app-shell.html` (trattamento app interna). Si aspettano accanto `tokens.css`, `apis.css` e `apis-mark.svg`. |

## Flusso di lavoro

1. **Capisci il contesto.** Sito pubblico o app interna? I due trattamenti sono descritti in `brand-book.md` → "Sito e app interne". Guarda lo stack del progetto (Tailwind? React? template server-side?).
2. **Controlla se Apis è già installato** nel progetto (cerca `--accent`, `ap-btn`, `tokens.css`). Se c'è, usa quello che c'è e non duplicarlo.
3. **Installa i token se mancano.** Copia `assets/tokens.css` e `assets/apis.css` nella cartella degli stili; copia anche la cartella `assets/fonts/` accanto a `tokens.css` (i caratteri sono inclusi: non aggiungere link a Google Fonts). Con Tailwind v4 aggiungi anche `assets/tailwind.css` dopo `tokens.css`. Con React puoi usare i componenti di `assets/apis-react.js` o riscriverli come moduli seguendo le stesse classi.
4. **Costruisci solo con token semantici** (`surface`, `ink`, `accent`, `line`, `space-*`, `radius-*`…). Mai valori esadecimali o pixel scritti a mano, mai primitivi (`pollen-400`, `comb-200`) in un componente. Se un token manca, segui `governance.md`.
5. **Parti dai componenti esistenti** prima di inventarne uno. Se lo scopo è nuovo, scrivi la frase di scopo e la scheda (vedi `governance.md`).
6. **Scrivi i testi secondo il tono di Apis** (sezione "Contenuti e tono" del brand book): italiano, "tu", maiuscola solo iniziale, verbo + oggetto nei bottoni, errori che dicono come rimediare.
7. **Verifica con la checklist qui sotto** prima di dire che hai finito.

## Regole d'oro (le più violate)

- Il giallo `accent` è un **riempimento**, mai un colore di testo né un link. Sopra il giallo il testo è sempre `on-accent` (nero), mai bianco. I riempimenti gialli su fondo chiaro hanno un bordo `accent-edge`.
- **Un solo bottone primario per vista.**
- Spazi solo dai token `space-*` (multipli di 8; 4 solo per dettagli). Interlinee multiple di 4.
- Bricolage Grotesque solo per `display`/`headline`/`title`. Tutto il resto in Instrument Sans. Numeri in tabelle e KPI in JetBrains Mono con `tabular-nums`.
- Gli stati hanno sempre **icona + parola + colore**, mai solo il colore.
- Il focus è sempre visibile: `outline: 2px solid var(--focus); outline-offset: 2px`.
- La striscia gialla e nera è il segnale di attenzione: solo `EnvironmentBanner` e `ap-stripe`. Le app interne non di produzione mostrano sempre `EnvironmentBanner`.
- Entrambi i temi, sempre: niente colori che esistono solo in chiaro o solo in scuro; `body` ha `background: var(--surface)`.
- Icone Lucide (24px, tratto 2px, arrotondate), un colore con `currentColor`; icona senza testo = `aria-label`.
- Niente emoji nell'interfaccia, niente punti esclamativi, niente gradienti viola-blu, niente card con bordo colorato a sinistra.
- **Dosaggio**: l'esagono solo per marchio, ritratto principale, favo dell'hero e stati vuoti (mai per elenchi, timeline, chip). Il giallo o in un grande campo per pagina o in singoli dettagli, non sparso.
- Titoli con gli stili fluidi (`ap-display-xl`, `ap-display`, `ap-headline`, `ap-title` o `var(--type-…)`): niente dimensioni scritte a mano né media query per i titoli.
- Movimento solo con i pattern di `apis-motion.js` (`data-ap-reveal`, `ap-rise`, `ap-cell-in`, `Apis.motion.toggleTheme`): un solo momento orchestrato per pagina.

## Checklist prima di consegnare

- [ ] Solo token semantici o di componente; nessun valore grezzo, nessun primitivo nei componenti
- [ ] Spazi e dimensioni sulla griglia da 8, interlinee multiple di 4
- [ ] Un solo primario per vista; il giallo usato come riempimento, non come testo
- [ ] Contrasto: testo 4.5:1 (3:1 sopra 24px o 19px bold), bordi di controlli, focus e icone 3:1, **in chiaro e in scuro**
- [ ] Tastiera: tutto raggiungibile con Tab, ordine logico, focus visibile, Esc chiude i livelli sovrapposti
- [ ] Ogni campo ha un `label`; aiuti ed errori collegati con `aria-describedby`; un solo `h1`, titoli in ordine
- [ ] Testi: maiuscola iniziale, verbi del glossario, errori e stati vuoti secondo i modelli, formato CHF `12'480.00` e date `1 ott 2026`
- [ ] Layout funzionante da 360px a 1440px, nessuno scorrimento orizzontale della pagina
- [ ] `prefers-reduced-motion` rispettato
- [ ] Se hai aggiunto un token o un componente: scheda scritta, design system pubblicato aggiornato, riga nel changelog

## Quando l'utente chiede di cambiare Apis

Apis è vivo, ma questa cartella è **generata**. Ogni modifica va fatta nel sorgente `{{sourceDir}}` (token in `tokens.json`, classi in `css/`, componenti in `components/`, regole in `docs/brand-book.md`), poi dalla radice della raccolta:

1. `npm run check -- apis`: contrasto, griglia, nomi e uso dei token. Deve passare.
2. Aggiorna `version` in `system.json` e aggiungi una riga in `CHANGELOG.md`.
3. `npm run release -- apis`: ricostruisce, reinstalla questa skill e aggiorna le copie nei siti che usano Apis.
4. Pubblica `dist/apis/artifact/` sul design system allo stesso link.

Le richieste dell'utente vincono sempre su questa skill.

## Changelog

{{changelog}}
