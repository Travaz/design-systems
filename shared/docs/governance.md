# Governance di Apis

Come il sistema cresce senza perdere coerenza. Vale per nuovi componenti, nuovi token e modifiche a quelli esistenti.

## Prima di aggiungere qualcosa

Rispondi per iscritto:

1. Quale bisogno reale c'è? Cita almeno due schermate o casi concreti (sito o app interne).
2. Perché nessun componente o token esistente lo copre? Prova prima a comporre quelli esistenti.
3. Qual è la frase di scopo? ("Scopo: …")
4. Cosa cambia per gli altri componenti?

Se la risposta a 2 è "basta una variante", controlla che la variante abbia lo **stesso scopo**. Scopo diverso = componente nuovo.

## Definition of ready (fase 2)

Un componente è pronto per lo sviluppo quando la sua scheda contiene:

- [ ] Frase di scopo e descrizione in una riga
- [ ] Quando usarlo / quando non usarlo, con condizioni precise (niente "di solito", "a volte")
- [ ] Alternative considerate e perché scartate
- [ ] Anatomia: le parti, con i nomi delle classi `ap-*`
- [ ] Token usati: solo semantici o di componente, mai primitivi o valori grezzi
- [ ] Dimensioni sulla griglia da 8 (4 solo per dettagli), interlinee multiple di 4
- [ ] Strategia di spazio: element-first o content-first
- [ ] Varianti e dimensioni (`sm`/`md`/`lg` se applicabile)
- [ ] Stati: riposo, hover, focus, premuto, selezionato, disabilitato, errore, caricamento (quelli che servono)
- [ ] Comportamento da 360px a 1440px
- [ ] Testo: etichette, maiuscole, messaggi d'errore e vuoti, secondo i modelli
- [ ] Accessibilità: ruolo ARIA, nome accessibile, tastiera (quali tasti fanno cosa), focus, annunci a screen reader
- [ ] Cosa fornisce chi lo usa (props, contenuto, contenitore)

## Conformità (fase 3)

Prima di considerarlo parte del sistema:

- [ ] Codice CSS in `apis.css` e componente React in `apis-react.js`, tipi in `apis-react.d.ts`
- [ ] Scheda in `references/components.md` e nel design system pubblicato
- [ ] Contrasti verificati in chiaro **e** scuro: testo 4.5:1, testo ≥24px o bold ≥19px 3:1, bordi di controlli, focus e icone 3:1
- [ ] Navigazione da tastiera provata davvero
- [ ] Provato con `prefers-reduced-motion` e con zoom al 200%
- [ ] Codice, design e documentazione dicono la stessa cosa
- [ ] Voce nel changelog

## Aggiungere un token

- Un nuovo **semantico** si aggiunge quando un intento ricorre in almeno due componenti. Va dichiarato in entrambi i temi, con una nota d'uso che nomina le superfici su cui è leggibile, e con il contrasto misurato.
- Un nuovo **primitivo** si aggiunge solo se nessun primitivo esistente può servire il nuovo semantico.
- Un **token di componente** vive in `apis.css` e punta solo a un semantico.
- Nomi: minuscolo, trattini, per intenzione. Mai il valore nel nome.

## Versioni

Semver sul pacchetto della skill e del design system:

- **Maggiore**: token rinominato o rimosso, prop rimossa, cambio di comportamento che rompe.
- **Minore**: token, componente, variante o prop nuova.
- **Patch**: correzione di un valore, di un contrasto, di un testo.

Ogni rilascio ha una riga nel changelog in fondo al file `SKILL.md`: data, versione, cosa è cambiato.

## Il flusso di rilascio

Ogni design system vive in `design-systems/systems/<id>/` ed è l'**unico sorgente**: skill, pacchetto per i siti, file del design system pubblicato e copie nei progetti sono generati. Non si modifica mai un file generato.

1. Modifica il sorgente (`tokens.json`, `css/`, `components/`, `docs/`).
2. `npm run check -- <id>`: contrasto di ogni coppia dichiarata in ogni tema, griglia da 4/8, nomi e note d'uso dei token, CSS dei componenti senza primitivi né colori scritti a mano, token esistenti anche nel CSS dei siti che usano il sistema. Deve chiudersi con 0 errori.
3. Aggiorna `version` in `system.json` e aggiungi la voce in cima a `CHANGELOG.md`.
4. `npm run release -- <id>`: ricostruisce, reinstalla la skill in `~/.claude/skills/` e aggiorna le copie nei siti elencati in `consumers`.
5. Pubblica `dist/<id>/artifact/` sul design system allo stesso link (lo fa Claude).
