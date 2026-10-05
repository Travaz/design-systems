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
```

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
- **Componenti**: README con frase di scopo, anteprima presente, bundle coerente con le cartelle.
- **Siti che lo usano**: copie allineate alla versione, nessun token inesistente nel loro CSS (variabili locali dichiarate con `/* ds-lint allow: --x --y */`).
- **Rilascio**: la prima voce del changelog corrisponde alla versione.

Non ancora coperto: test visivi automatici e audit axe delle anteprime (richiedono Playwright e un browser headless).
