# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session Workflow

Workflow global défini dans `~/.claude/CLAUDE.md`.

### MAJ command

Quand l'utilisateur tape `MAJ` seul :
1. Mettre à jour `CLAUDE.md` pour refléter l'état actuel du projet

## Project Overview

Un lecteur de webtoons local en vanilla JS / HTML / CSS. Pas de système de build, pas de dépendances npm. Les images sont stockées localement au format WebP, organisées par webtoon et par chapitre.

## Running the App

Ouvrir `index.html` dans un navigateur (ou via Live Server). La progression est sauvegardée dans `localStorage` par webtoon.

## File Structure

- `index.html` — bibliothèque : grille des webtoons, lecture localStorage pour la progression
- `style.css` — CSS partagé mobile-first (variables CSS, bibliothèque, lecteur)
- `{NomWebtoon}/lecteur.html` — page lecteur (HTML sémantique, importe style.css + lecteur.js)
- `{NomWebtoon}/lecteur.js` — logique JS du lecteur (MIN_CHAP, MAX_CHAP, chargement images, localStorage)
- `{NomWebtoon}/cover.webp` — image de couverture (optionnel — placeholder dégradé si absent)
- `{NomWebtoon}/Chapitre X/` — images WebP numérotées `1.webp`, `2.webp`, etc.

### Webtoons actuels

| Dossier      | Chapitres | MAX_CHAP |
|--------------|-----------|----------|
| `Liebling!`  | 0 → 138   | 138      |

## Architecture du lecteur

Chaque webtoon a son propre `lecteur.html` + `lecteur.js`. Le HTML est purement sémantique ; toute la logique est dans `lecteur.js`.

**Constantes à ajuster par webtoon (dans `lecteur.js`) :**
```js
var MIN_CHAP = 0;
var MAX_CHAP = 138;        // à mettre à jour quand de nouveaux chapitres sont ajoutés
var MAX_PAGES_BOUCLE = 200; // nombre max de pages tentées par chapitre
```

**Clé localStorage :**
```js
var STORAGE_KEY = 'webtoon_save_' + folderName; // généré depuis le nom du dossier
```
La clé est générée automatiquement — pas de config manuelle nécessaire.

**Chargement des images :**
- Boucle de `1` à `MAX_PAGES_BOUCLE`, tente de charger `Chapitre X/{i}.webp`
- Si `onerror` → la `<figure>` est retirée du DOM (images manquantes ignorées silencieusement)
- Si `onload` → le message "Chargement..." est retiré

## Conventions clés

- Pas de dépendances externes (pas de bibliothèque JS, pas de framework CSS)
- Thème sombre : fond `#0f0f0f`, accent rouge `#e74c3c` — définis dans `style.css`
- Images format WebP uniquement, nommées avec des entiers (`1.webp`, `2.webp`, ...)
- Navigation clavier : touche Entrée pour recharger le chapitre
- Sécurité DOM : `textContent` uniquement (jamais `innerHTML`), `parseInt(..., 10)` pour les valeurs localStorage

## Ajouter un nouveau webtoon

1. Créer `{NomWebtoon}/` avec les sous-dossiers `Chapitre X/`
2. Ajouter une image `{NomWebtoon}/cover.webp` (optionnel — un placeholder s'affiche si absent)
3. Copier `Liebling!/lecteur.html` + `Liebling!/lecteur.js`, ajuster `MIN_CHAP`, `MAX_CHAP` et le `<title>`
4. Ajouter un `<article class="webtoon-card">` dans `index.html`

## Mettre à jour MAX_CHAP

Quand de nouveaux chapitres sont ajoutés, mettre à jour dans `{NomWebtoon}/lecteur.js` :
- `var MAX_CHAP = X;`
- Et l'attribut `max="X"` sur l'`<input id="chapNum">` dans `lecteur.html`
