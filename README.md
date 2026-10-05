# Design systems

La mia raccolta di design system. Ognuno ha **un solo sorgente** in `systems/<id>/`; tutto il resto (skill per Claude, pacchetto CSS per i siti, pagina pubblicata, copie nei progetti) viene generato e controllato da strumenti condivisi.

| Sistema | Versione | Ispirazione | Usato da |
|---|---|---|---|
| [Apis](systems/apis/) | vedi `systems/apis/system.json` | L'ape: giallo polline, nero carapace, bianco cera | Landing page di travaz.dev |

## Comandi

Richiedono Node 20 o successivo, nessuna dipendenza da installare.

```bash
npm run new -- tundra "Tundra"     # crea un nuovo sistema dal modello
npm run check -- apis              # controlla un sistema (senza id: tutti)
npm run build -- apis              # genera dist/apis/ senza installare nulla
npm run release -- apis            # controlla, installa la skill, aggiorna i siti
npm run palette -- "#F7BE16" --name pollen --at 400 --hue-shift -20   # scala OKLCH da un colore
npm test                           # test degli strumenti + check di tutti i sistemi (anche in CI)
npm run test:visual                # screenshot e accessibilità della galleria (Playwright)
npm run test:visual:update         # rigenera gli screenshot di riferimento dopo un cambio voluto
```

Gli strumenti non hanno dipendenze. Solo i test visivi usano Playwright e axe: `npm install` e, la prima volta, `npx playwright install chromium`.

## Creare un nuovo sistema

1. `npm run new -- tundra "Tundra"`: crea `systems/tundra/` dal modello, già conforme ai controlli.
2. Scegli il colore di partenza e genera le scale:

```bash
npm run palette -- "#2F6F62" --name moss --light "#FBFAF7" --dark "#121413"
```

   Il comando crea 11 gradini in OKLCH, con luminosità percettivamente uniforme, il colore di partenza tenuto esatto e il croma che cala verso gli estremi. Per ogni gradino indica il contrasto sui tuoi fondi e cosa può fare: testo su chiaro, testo su scuro, bordo, fondo per testo scuro o bianco. `--at 400` fissa il gradino del colore di partenza; `--hue-shift -20` gira la tinta verso i gradini scuri (i gialli che scuriscono verso l'ambra); `--into tundra` scrive i primitivi direttamente nel sistema e avvisa se ne sostituisce di esistenti.
3. Collega i semantici ai gradini giusti in `tokens.json`, scrivi `docs/brand-book.md`, poi `npm run check -- tundra`.
4. Guarda il risultato in `dist/tundra/specimen.html` e nella galleria, e lancia `npm run release -- tundra`.

## Specimen e indice

Il build genera per ogni sistema `dist/<id>/specimen.html`: colori semantici nei due temi, contrasto misurato di ogni coppia dichiarata (✓ o ✗, con campione di testo o di bordo secondo la soglia), primitivi, scala tipografica, spazi, raggi ed elevazione. `dist/index.html` raccoglie tutti i sistemi con la loro palette. Entrambe le pagine sono coperte dai test visivi e da axe.

## Com'è fatto un sistema

```
systems/<id>/
  system.json        nome, versione, prefisso delle classi, skill, link pubblicato, siti che lo usano
  tokens.json        IL sorgente dei token: primitivi, semantici per tema, coppie di contrasto, tipo, spazi…
  fonts/             i caratteri in WOFF2 con le licenze: niente servizi esterni
  css/<id>.css       classi dei componenti; usa solo token semantici
  components/        un README (scopo, classi, regole) e un preview.html per componente; bundle.js opzionale
  docs/brand-book.md le regole d'uso, scritte per chi costruisce
  skill/SKILL.md     modello della skill ({{version}}, {{changelog}}… vengono riempiti al build)
  assets/            logo, modelli di pagina
  CHANGELOG.md       una riga per rilascio
```

`shared/docs/` contiene ciò che vale per tutti i sistemi: i principi presi da designsystems.com e la governance. Ogni skill li include.

## Cosa genera il build

```
dist/<id>/
  package/     tokens.css · tokens.json (W3C DTCG) · tailwind.css · <id>.css · <id>-react.js · <id>-motion.js · fonts/ · logo/ · package.json
  gallery/     una pagina per componente, per i test visivi e per guardarli a mano
  skill/       <id>-design-system/ e il .zip da caricare su claude.ai
  artifact/    i file della pagina "Design System" pubblicata
```

Un sito usa un sistema in due modi: lo elenca in `consumers` dentro `system.json` (il rilascio copia i file e il controllo segnala copie vecchie e token inesistenti nel suo CSS), oppure installa il pacchetto con `npm install ../design-systems/dist/<id>/package`.

## Numeri nei testi

Nei testi (brand book, schede dei componenti, note dei token) i rapporti di contrasto non si scrivono a mano: si scrive un segnaposto e il build mette il valore vero, il più basso tra tutte le coppie e tutti i temi, arrotondato per difetto.

```
Il testo secondario arriva almeno a {{contrast ink-muted on surface,surface-raised}}.
Sul rosso il testo è {{contrast on-danger on danger light}} in chiaro.
```

Le soglie WCAG (4.5:1, 3:1, 7:1) restano scritte, perché sono regole e non misure.

## Cosa controlla `npm run check`

- **Contrasto WCAG** di ogni coppia dichiarata in `tokens.json → contrast`, in ogni tema.
- **Token**: nomi validi e unici, ogni semantico definito in tutti i temi, note d'uso presenti, primitivi non usati.
- **Griglia**: interlinee multiple di 4, spazi sulla griglia da 4.
- **CSS dei componenti**: solo token esistenti, nessun primitivo, nessun colore scritto a mano (eccezioni marcate con `lint-allow-literal`).
- **Sintassi CSS**: parentesi graffe bilanciate (una graffa in più fa ignorare al browser la regola successiva, senza errori visibili).
- **Tipografia fluida**: entrambi gli estremi degli stili fluidi sulla griglia da 4.
- **Componenti**: README con frase di scopo, anteprima presente, bundle coerente con le cartelle.
- **Documentazione**: ogni token, classe o variabile citata tra backtick nei testi esiste davvero (anche i modelli come `pollen-*`); i segnaposti `{{contrast fg on bg}}` si risolvono; i rapporti di contrasto scritti a mano sono segnalati.
- **Prop dei componenti**: ogni prop dichiarata nei tipi è usata dal componente e documentata nella sua scheda, e viceversa.
- **Siti che lo usano**: copie allineate alla versione, nessun token inesistente nel loro CSS (variabili locali dichiarate con `/* ds-lint allow: --x --y */`).
- **Rilascio**: la prima voce del changelog corrisponde alla versione.

## Come testare

### Prima volta

```bash
npm install                        # solo Playwright e axe, servono ai test visivi
npx playwright install chromium    # il browser per i test visivi (circa 100 MB)
```

### Dopo ogni modifica

```bash
npm test                 # 1. strumenti e controlli: veloce, nessuna dipendenza
npm run test:visual      # 2. screenshot e accessibilità della galleria
```

Se entrambi passano, la modifica è pronta per il commit.

### Cosa verificano

**`npm test`**
- funzioni pure: contrasto WCAG su valori noti, calcolo della tipografia fluida, `tokens.css` completo in ogni tema;
- gli strumenti end to end, su sistemi temporanei che non toccano quelli veri: un sistema nuovo passa i controlli, il build produce tutti i file, e `check` fallisce davvero su graffa in più, token inesistente, primitivo nei componenti, colore scritto a mano, contrasto insufficiente, interlinea fuori griglia; `release` si rifiuta di rilasciare un sistema che non passa;
- `check` di tutti i sistemi reali.

**`npm run test:visual`**
- il build genera `dist/<id>/gallery/`, una pagina per ogni anteprima di componente (si può aprire anche a mano: `dist/apis/gallery/index.html`);
- i test sono **ermetici**: caratteri inclusi nel sistema, React dalla copia locale in `node_modules`, e qualsiasi richiesta verso internet viene bloccata e fa fallire il test con l'indirizzo che l'ha causata;
- ogni pagina viene fotografata in ogni tema, a 375px e 1280px, e confrontata con gli screenshot di riferimento in `tests/visual/__screenshots__/<piattaforma>/`, con una tolleranza di 100 pixel e le animazioni ferme;
- ogni pagina passa un audit axe (WCAG 2.2 AA), e un test di controllo verifica che axe trovi davvero i problemi noti.

### Quando un test visivo fallisce

1. Apri il report: `npx playwright show-report`. Per ogni differenza mostra prima, dopo e confronto.
2. **Se la differenza è un errore**, correggi il sorgente e rilancia.
3. **Se la differenza è voluta**, aggiorna gli screenshot di riferimento e committali insieme alla modifica:

```bash
npm run test:visual:update
```

Gli screenshot di macOS (`darwin/`) e quelli di Linux (`linux/`, usati dalla CI) sono separati, perché i due sistemi disegnano i caratteri in modo leggermente diverso. Per aggiornare quelli Linux puoi lanciare la CI a mano (vedi sotto), oppure in locale con Docker:

```bash
npm run test:visual:linux -- --update-snapshots=changed
```

## Versioni, tag e rilasci

Ogni sistema ha la sua versione (semver, in `system.json`) e il suo changelog. Ogni versione rilasciata ha un tag git annotato **`<id>@<versione>`** (per esempio `apis@1.3.0`), messo sul commit in cui `system.json` ha preso quel numero; il messaggio del tag è la voce del changelog.

1. Modifica, `npm test`, `npm run test:visual`.
2. Aggiorna `version` in `system.json` e aggiungi la voce in cima a `CHANGELOG.md`.
3. `npm run release -- <id>`, poi commit e push.
4. La CI crea il tag e la GitHub Release. In locale lo stesso si fa con `npm run tag` (`--push` per inviarli): le versioni già taggate restano come sono.

I tag permettono di confrontare due versioni (`git diff apis@1.2.0 apis@1.3.0 -- systems/apis`) e di installare un pacchetto preciso dalla pagina Releases di GitHub.

## CI/CD

A ogni push e a ogni pull request GitHub Actions esegue `.github/workflows/ci.yml`:

| Job | Quando | Cosa fa |
|---|---|---|
| Build e controlli | sempre | `npm test` |
| Screenshot e accessibilità | se il primo passa | i test visivi nell'immagine Linux ufficiale di Playwright, contro gli screenshot `linux/` |
| Tag e Release | solo su `main`, se passano entrambi | crea i tag mancanti `<id>@<versione>` e una GitHub Release per ciascuno, con pacchetto, zip della skill e specimen costruiti da quel commit |

- **Screenshot Linux mancanti** (la prima volta o per un componente nuovo): la CI li genera, li committa da sola con il messaggio "Update Linux screenshot baselines" e poi esegue la suite. Dopo quel commit fai `git pull`.
- **Dopo una modifica visiva voluta**: GitHub → Actions → CI → *Run workflow*, spunta "Rigenera gli screenshot Linux che sono cambiati". La CI aggiorna e committa solo quelli diversi, e nel commit puoi rivederli uno per uno.
- **Se qualcosa fallisce**: il report di Playwright è allegato all'esecuzione come `playwright-report`.
- Il push del bot non fa ripartire la CI.
- La pubblicazione del design system su claude.ai resta manuale: la fa Claude a partire da `dist/<id>/artifact/`.
