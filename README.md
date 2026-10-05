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
npm test                           # test degli strumenti + check di tutti i sistemi (anche in CI)
npm run test:visual                # screenshot e accessibilità della galleria (Playwright)
npm run test:visual:update         # rigenera gli screenshot di riferimento dopo un cambio voluto
```

Gli strumenti non hanno dipendenze. Solo i test visivi usano Playwright e axe: `npm install` e, la prima volta, `npx playwright install chromium`.

## Com'è fatto un sistema

```
systems/<id>/
  system.json        nome, versione, prefisso delle classi, skill, link pubblicato, siti che lo usano
  tokens.json        IL sorgente dei token: primitivi, semantici per tema, coppie di contrasto, tipo, spazi…
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
  package/     tokens.css · tokens.json (W3C DTCG) · tailwind.css · <id>.css · <id>-react.js · logo/ · package.json
  skill/       <id>-design-system/ e il .zip da caricare su claude.ai
  artifact/    i file della pagina "Design System" pubblicata
```

Un sito usa un sistema in due modi: lo elenca in `consumers` dentro `system.json` (il rilascio copia i file e il controllo segnala copie vecchie e token inesistenti nel suo CSS), oppure installa il pacchetto con `npm install ../design-systems/dist/<id>/package`.

## Cosa controlla `npm run check`

- **Contrasto WCAG** di ogni coppia dichiarata in `tokens.json → contrast`, in ogni tema.
- **Token**: nomi validi e unici, ogni semantico definito in tutti i temi, note d'uso presenti, primitivi non usati.
- **Griglia**: interlinee multiple di 4, spazi sulla griglia da 4.
- **CSS dei componenti**: solo token esistenti, nessun primitivo, nessun colore scritto a mano (eccezioni marcate con `lint-allow-literal`).
- **Sintassi CSS**: parentesi graffe bilanciate (una graffa in più fa ignorare al browser la regola successiva, senza errori visibili).
- **Tipografia fluida**: entrambi gli estremi degli stili fluidi sulla griglia da 4.
- **Componenti**: README con frase di scopo, anteprima presente, bundle coerente con le cartelle.
- **Siti che lo usano**: copie allineate alla versione, nessun token inesistente nel loro CSS (variabili locali dichiarate con `/* ds-lint allow: --x --y */`).
- **Rilascio**: la prima voce del changelog corrisponde alla versione.

## Test

**`npm test`** (nessuna dipendenza, gira anche su GitHub a ogni push):
- funzioni pure: contrasto WCAG su valori noti, calcolo della tipografia fluida, `tokens.css` completo in ogni tema;
- strumenti end to end su sistemi temporanei: un sistema nuovo passa i controlli, il build produce tutti i file, e `check` fallisce davvero su graffa in più, token inesistente, primitivo nei componenti, colore scritto a mano, contrasto insufficiente, interlinea fuori griglia; `release` si rifiuta di rilasciare un sistema che non passa;
- `check` di tutti i sistemi reali.

**`npm run test:visual`** (in locale):
- il build genera `dist/<id>/gallery/`, una pagina per ogni anteprima di componente collegata al pacchetto;
- ogni pagina viene fotografata in ogni tema, a 375px e 1280px, e confrontata con `tests/visual/__screenshots__/<piattaforma>/` (tolleranza di 100 pixel, animazioni ferme);
- ogni pagina passa un audit axe (WCAG 2.2 AA), e un test di controllo verifica che axe trovi davvero i problemi noti.

Dopo una modifica visiva voluta: `npm run test:visual`, guarda le differenze nel report (`npx playwright show-report`), poi `npm run test:visual:update` e committa le nuove immagini. Gli screenshot di riferimento sono fatti su macOS: per farli girare in CI servirebbero quelli generati su Linux.
