# Spec — Refonte webtoon_reader

**Date :** 2026-04-14  
**Périmètre :** `index.html` + `Liebling!/lecteur.html`  
**Objectif :** Réécriture sémantique, ordonnée et mobile-first du projet. Même thème visuel (fond noir, accent rouge `#e74c3c`), modernisé légèrement.

---

## 1. Structure des fichiers

```
webtoon_reader/
├── index.html          ← page bibliothèque (refonte)
├── style.css           ← CSS partagé bibliothèque + lecteur
├── CLAUDE.md
├── docs/
│   └── superpowers/specs/
│       └── 2026-04-14-refonte-webtoon-reader-design.md
└── Liebling!/
    ├── lecteur.html    ← page lecteur (refonte)
    ├── lecteur.js      ← JS du lecteur (extrait du HTML)
    └── Chapitre X/     ← images WebP (inchangées)
```

**Règle :** Aucune dépendance externe. Vanilla JS, HTML5, CSS3 uniquement.

---

## 2. Page bibliothèque — `index.html`

### HTML sémantique
```html
<body>
  <header>         ← titre de la bibliothèque
  <main>
    <section class="library-grid">
      <article class="webtoon-card"> × N  ← une par webtoon
```

### Carte webtoon
Chaque `<article class="webtoon-card">` contient :
1. **Bannière** — `<figure>` avec image de couverture (`cover.webp` dans le dossier du webtoon). Si `cover.webp` est absent, la bannière affiche un fond dégradé sombre comme placeholder.
2. **Titre** — `<h2>` nom du webtoon
3. **Indicateur de progression** — lu depuis `localStorage` :
   - Si jamais ouvert → `▶ Commencer`
   - Si déjà lu → `▶ Continuer au chapitre ##`

La carte entière est un lien `<a href="...">` vers le `lecteur.html` du webtoon.

### CSS — Mobile First
- **Base (mobile)** : grille 1 colonne, cartes pleine largeur
- **`@media (min-width: 600px)`** : grille 2 colonnes
- **`@media (min-width: 900px)`** : grille 3 colonnes, max-width 1000px centré
- Hover : `translateY(-4px)` + border `#e74c3c`

---

## 3. Page lecteur — `lecteur.html` + `lecteur.js`

### HTML sémantique
```html
<body>
  <header id="nav-bar">
    <nav>   ← barre de navigation fixe
  <main id="viewer">
    <figure> × N   ← une par image chargée
  <button id="back-to-top">
```

### Barre de navigation (fixe, top)
Une seule ligne, 4 éléments :

```
🏠 Accueil  |  ‹ Préc.  |  Liebling ! — Ch. 47  |  Suiv. ›
```

- **🏠 Accueil** : lien `<a>` vers `../index.html`, aligné à gauche
- **‹ Préc.** : bouton, désactivé au chapitre min
- **Titre central** : `<span>` affichant `{nomWebtoon} — Ch. {n}`, flex: 1, centré
- **Suiv. ›** : bouton rouge `#e74c3c`, désactivé au chapitre max

### Images du lecteur
- **Toujours colonne unique** — aucune grille, aucun layout multi-colonnes
- `width: 100%` — s'adapte à la largeur du périphérique
- `max-width: 800px` centré sur grand écran
- `display: block; margin: 0` — zéro espacement entre images, lecture fluide
- `loading="lazy"` — lazy loading conservé
- `onerror` → retire la balise (images manquantes ignorées silencieusement)
- `onload` → retire le message "Chargement..."

### Logique JS (`lecteur.js`)
- Constantes : `MIN_CHAP`, `MAX_CHAP`, `MAX_PAGES_BOUCLE` (configurable par webtoon)
- Clé localStorage : `webtoon_save_{folderName}` (généré depuis l'URL)
- Fonctions : `chargerChapitre()`, `changerOffset(dir)`, `validerBornes()`
- Événements : `keypress` (Entrée), `scroll` (bouton ↑), `onload` (reprise)

---

## 4. CSS partagé — `style.css`

### Variables
```css
:root {
  --bg: #0f0f0f;
  --surface: #1a1a1a;
  --border: #2a2a2a;
  --text: #e0e0e0;
  --accent: #e74c3c;
  --muted: #888;
}
```

### Règles générales
- `box-sizing: border-box` universel
- `font-family: 'Segoe UI', sans-serif`
- Fond `var(--bg)`, texte `var(--text)`
- Toutes les media queries en `min-width` uniquement

---

## 5. Ce qui ne change pas

- Format et nommage des images (`Chapitre X/{n}.webp`)
- Clé localStorage (rétrocompatible)
- Logique de chargement des images (boucle + onerror)
- Thème sombre + accent rouge

---

## 6. Ajouter un nouveau webtoon (procédure mise à jour)

1. Créer `{NomWebtoon}/` avec les sous-dossiers `Chapitre X/`
2. Ajouter une image `{NomWebtoon}/cover.webp` (optionnel — un placeholder s'affiche si absent)
3. Copier `Liebling!/lecteur.html` + `lecteur.js`, ajuster `MIN_CHAP`, `MAX_CHAP` et le titre
4. Ajouter un `<article class="webtoon-card">` dans `index.html`
