---
name: {{id}}-design-system
description: {{Name}}, un design system di Daniel Travaglia. Usala quando progetti, costruisci o revisioni una UI che deve seguire {{Name}}, o quando l'utente nomina "{{Name}}" o classi `{{prefix}}`. AGGIORNA questa descrizione con i contesti precisi in cui va usata.
---

# {{Name}}

Versione {{version}}. Design system pubblicato: {{artifactUrl}}

Sorgente unico: `{{sourceDir}}`. Questa skill è generata da lì: non modificarla a mano.

## Cosa c'è in questa skill

| File | Quando leggerlo |
|---|---|
| `references/brand-book.md` | Sempre, prima di scrivere UI. |
| `references/tokens.md` | Per nomi e valori precisi dei token. |
| `references/principles.md` | Quando un caso non è coperto. |
| `references/governance.md` | Quando aggiungi o cambi token e componenti. |
| `assets/tokens.css`, `assets/{{id}}.css`, `assets/tailwind.css`, `assets/tokens.json` | Da usare nel progetto. |

## Regole

- Solo token semantici (`surface`, `ink`, `accent`, `space-*`…), mai valori scritti a mano né primitivi.
- Contrasto AA in tutti i temi, focus sempre visibile.

## Quando l'utente chiede di cambiare {{Name}}

Modifica il sorgente in `{{sourceDir}}`, poi dalla radice della raccolta: `npm run check -- {{id}}`, aggiorna versione e `CHANGELOG.md`, `npm run release -- {{id}}`.

## Changelog

{{changelog}}
