# Refonte webtoon_reader — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réécrire `index.html` et `Liebling!/lecteur.html` de façon sémantique, ordonnée et mobile-first, en extrayant le CSS dans `style.css` et le JS dans `lecteur.js`.

**Architecture:** CSS partagé mobile-first avec variables CSS dans `style.css`. JS du lecteur extrait dans `lecteur.js`. `index.html` lit le `localStorage` pour afficher la progression par carte. Le thème visuel (fond noir, accent rouge) est conservé et légèrement poli.

**Tech Stack:** HTML5 sémantique, CSS3 (variables, flexbox, grid, media queries min-width), Vanilla JS ES6. Aucune dépendance externe.

**Spec de référence:** `docs/superpowers/specs/2026-04-14-refonte-webtoon-reader-design.md`

---

## Fichiers touchés

| Action | Fichier | Rôle |
|--------|---------|------|
| Créer | `style.css` | CSS partagé — variables, base, bibliothèque, lecteur |
| Réécrire | `index.html` | Page bibliothèque — HTML sémantique + JS inline minimal |
| Créer | `Liebling!/lecteur.js` | Toute la logique JS du lecteur |
| Réécrire | `Liebling!/lecteur.html` | Page lecteur — HTML sémantique, importe style.css + lecteur.js |

---

## Task 1 : CSS de base — variables et reset

**Fichiers :**
- Créer : `style.css`

- [ ] **Étape 1 : Créer `style.css` avec variables CSS et reset**

```css
/* === VARIABLES === */
:root {
  --bg: #0f0f0f;
  --surface: #1a1a1a;
  --surface-hover: #252525;
  --border: #2a2a2a;
  --border-hover: #e74c3c;
  --text: #e0e0e0;
  --text-muted: #888;
  --accent: #e74c3c;
  --accent-dark: #c0392b;
  --nav-bg: rgba(15, 15, 15, 0.95);
  --radius: 10px;
  --radius-sm: 6px;
}

/* === RESET === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* === BASE === */
body {
  background-color: var(--bg);
  color: var(--text);
  font-family: 'Segoe UI', sans-serif;
  line-height: 1.5;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
  font-family: inherit;
}
```

- [ ] **Étape 2 : Vérifier dans le navigateur**

Ouvrir `index.html` via Live Server. La page doit avoir fond noir `#0f0f0f`. Pas d'erreur console.

- [ ] **Étape 3 : Commit**

```bash
git add style.css
git commit -m "feat: add shared CSS with variables and reset"
```

---

## Task 2 : CSS bibliothèque — grille et cartes

**Fichiers :**
- Modifier : `style.css` (ajouter section bibliothèque)

- [ ] **Étape 1 : Ajouter les styles bibliothèque à `style.css`**

```css
/* ================================
   BIBLIOTHÈQUE
   ================================ */

.library-header {
  text-align: center;
  padding: 32px 16px 24px;
}

.library-header h1 {
  font-size: 1.8rem;
  color: var(--accent);
  letter-spacing: 0.03em;
}

/* Grille — mobile first : 1 colonne */
.library-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 0 16px 40px;
  max-width: 1000px;
  margin: 0 auto;
}

@media (min-width: 600px) {
  .library-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .library-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Carte webtoon */
.webtoon-card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.webtoon-card:hover {
  transform: translateY(-4px);
  border-color: var(--border-hover);
  background: var(--surface-hover);
}

/* Bannière couverture */
.card-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

/* Placeholder si pas de cover.webp */
.card-cover-placeholder {
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

/* Corps de la carte */
.card-body {
  padding: 14px 16px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-progress {
  font-size: 0.8rem;
  color: var(--accent);
  font-weight: 600;
}
```

- [ ] **Étape 2 : Commit**

```bash
git add style.css
git commit -m "feat: add library grid and card CSS (mobile-first)"
```

---

## Task 3 : Réécriture de `index.html`

**Fichiers :**
- Réécrire : `index.html`

- [ ] **Étape 1 : Réécrire `index.html` complet**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ma Bibliothèque Webtoon</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <header class="library-header">
    <h1>Ma Collection Webtoon</h1>
  </header>

  <main>
    <section class="library-grid">

      <article class="webtoon-card" data-folder="Liebling!">
        <a href="Liebling!/lecteur.html">
          <img
            class="card-cover"
            src="Liebling!/cover.webp"
            alt="Couverture de Liebling !"
            onerror="this.outerHTML='<div class=\'card-cover-placeholder\'>📂</div>'"
          >
          <div class="card-body">
            <h2 class="card-title">Liebling !</h2>
            <p class="card-progress" data-progress>▶ Commencer</p>
          </div>
        </a>
      </article>

    </section>
  </main>

  <script>
    // Lecture de la progression pour chaque carte (valeur entière depuis localStorage)
    document.querySelectorAll('.webtoon-card[data-folder]').forEach(function(card) {
      var folder = card.dataset.folder;
      var saved = localStorage.getItem('webtoon_save_' + folder);
      if (saved !== null) {
        var el = card.querySelector('[data-progress]');
        el.textContent = '\u25ba Continuer au chapitre ' + parseInt(saved, 10);
      }
    });
  </script>

</body>
</html>
```

> **Note sécurité :** `parseInt(saved, 10)` garantit que la valeur localStorage est traitée comme un entier. `textContent` est utilisé (pas `innerHTML`) — aucun risque XSS.

- [ ] **Étape 2 : Vérifier dans le navigateur**

Ouvrir `index.html` via Live Server :
- La carte Liebling ! s'affiche avec le dégradé sombre (pas de cover.webp)
- Le texte `▶ Commencer` est visible en rouge
- Le hover fait monter la carte et rougit la bordure
- La grille est en 1 colonne sur mobile (DevTools 375px), 2 colonnes à 600px, 3 à 900px

- [ ] **Étape 3 : Tester la progression depuis la console**

Dans la console du navigateur :
```js
localStorage.setItem('webtoon_save_Liebling!', '47');
location.reload();
// → doit afficher "▶ Continuer au chapitre 47"

localStorage.removeItem('webtoon_save_Liebling!');
location.reload();
// → retour à "▶ Commencer"
```

- [ ] **Étape 4 : Commit**

```bash
git add index.html
git commit -m "feat: rewrite index.html with semantic HTML and progress indicator"
```

---

## Task 4 : CSS lecteur

**Fichiers :**
- Modifier : `style.css` (ajouter section lecteur)

- [ ] **Étape 1 : Ajouter les styles lecteur à `style.css`**

```css
/* ================================
   LECTEUR
   ================================ */

/* Barre de navigation fixe */
#nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--nav-bg);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 10px 12px;
}

#nav-bar nav {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 800px;
  margin: 0 auto;
}

/* Boutons nav */
.nav-btn {
  padding: 7px 14px;
  border: none;
  border-radius: var(--radius-sm);
  background: #333;
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.2s;
  white-space: nowrap;
}

.nav-btn:hover:not(:disabled) {
  background: #555;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn--home {
  background: #444;
}

.nav-btn--home:hover {
  background: #666;
}

.nav-btn--next {
  background: var(--accent);
}

.nav-btn--next:hover:not(:disabled) {
  background: var(--accent-dark);
}

/* Titre centré dans la nav */
#nav-title {
  flex: 1;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--accent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Zone d'affichage des images */
#viewer {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 60px;
  display: flex;
  flex-direction: column;
}

/* Images — colonne unique, zéro espace */
#viewer figure {
  margin: 0;
  padding: 0;
  line-height: 0;
}

#viewer img {
  width: 100%;
  display: block;
}

/* Message de chargement */
.viewer-info {
  padding: 40px;
  text-align: center;
  color: var(--text-muted);
}

/* Bouton retour en haut */
#back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  display: none;
  z-index: 1000;
  transition: background 0.2s;
}

#back-to-top:hover {
  background: var(--accent-dark);
}
```

- [ ] **Étape 2 : Commit**

```bash
git add style.css
git commit -m "feat: add reader CSS (nav, viewer, images, mobile-first)"
```

---

## Task 5 : Créer `lecteur.js`

**Fichiers :**
- Créer : `Liebling!/lecteur.js`

- [ ] **Étape 1 : Créer `Liebling!/lecteur.js`**

```js
// === Configuration — ajuster par webtoon ===
var MIN_CHAP = 0;
var MAX_CHAP = 138;
var MAX_PAGES_BOUCLE = 200;

// Clé localStorage unique basée sur le nom du dossier
var pathArray = window.location.pathname.split('/');
var folderName = decodeURIComponent(pathArray[pathArray.length - 2]);
var STORAGE_KEY = 'webtoon_save_' + folderName;

// Lire le chapitre courant depuis le champ caché
function currentChap() {
  return parseInt(document.getElementById('chapNum').value, 10);
}

// Mettre à jour le titre de la nav
function updateTitle(chap) {
  document.getElementById('nav-title').textContent = folderName + ' \u2014 Ch. ' + chap;
}

// Valider les bornes et état des boutons
function validerBornes() {
  var chap = currentChap();
  document.getElementById('btn-prec').disabled = (chap <= MIN_CHAP);
  document.getElementById('btn-suiv').disabled = (chap >= MAX_CHAP);
  updateTitle(chap);
}

// Charger les images d'un chapitre
function chargerChapitre() {
  validerBornes();
  var chap = currentChap();
  var viewer = document.getElementById('viewer');

  // Sauvegarder la progression (entier uniquement)
  localStorage.setItem(STORAGE_KEY, chap);

  // Vider le viewer et afficher message de chargement
  while (viewer.firstChild) {
    viewer.removeChild(viewer.firstChild);
  }
  var msg = document.createElement('p');
  msg.className = 'viewer-info';
  msg.textContent = 'Chargement du chapitre ' + chap + '\u2026';
  viewer.appendChild(msg);

  // Charger les images
  for (var i = 1; i <= MAX_PAGES_BOUCLE; i++) {
    (function(pageNum) {
      var figure = document.createElement('figure');
      var img = document.createElement('img');
      img.src = 'Chapitre ' + chap + '/' + pageNum + '.webp';
      img.loading = 'lazy';
      img.alt = 'Chapitre ' + chap + ' \u2014 page ' + pageNum;

      img.onload = function() {
        var loadMsg = viewer.querySelector('.viewer-info');
        if (loadMsg) loadMsg.remove();
      };

      img.onerror = function() {
        figure.remove();
      };

      figure.appendChild(img);
      viewer.appendChild(figure);
    })(i);
  }

  window.scrollTo(0, 0);
}

// Changer de chapitre (+1 ou -1)
function changerOffset(direction) {
  var chap = currentChap() + direction;
  if (chap >= MIN_CHAP && chap <= MAX_CHAP) {
    document.getElementById('chapNum').value = chap;
    chargerChapitre();
  }
}

// Bouton retour en haut
window.addEventListener('scroll', function() {
  var btn = document.getElementById('back-to-top');
  btn.style.display = (window.scrollY > 500) ? 'block' : 'none';
});

// Initialisation au chargement
window.addEventListener('load', function() {
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved !== null) {
    document.getElementById('chapNum').value = parseInt(saved, 10);
  }
  validerBornes();
  chargerChapitre();
});

// Touche Entrée pour recharger
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') chargerChapitre();
});
```

> **Note sécurité :** Aucun `innerHTML` utilisé. Le viewer est vidé avec `removeChild`. Toutes les valeurs insérées dans le DOM passent par `textContent` ou des attributs explicites (`img.src`, `img.alt`). La valeur localStorage est traitée avec `parseInt` avant tout usage.

- [ ] **Étape 2 : Commit**

```bash
git add "Liebling!/lecteur.js"
git commit -m "feat: extract reader logic into lecteur.js"
```

---

## Task 6 : Réécriture de `lecteur.html`

**Fichiers :**
- Réécrire : `Liebling!/lecteur.html`

- [ ] **Étape 1 : Réécrire `Liebling!/lecteur.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Liebling ! — Lecteur</title>
  <link rel="stylesheet" href="../style.css">
</head>
<body>

  <header id="nav-bar">
    <nav>
      <a href="../index.html" class="nav-btn nav-btn--home">🏠</a>
      <button id="btn-prec" class="nav-btn" onclick="changerOffset(-1)">&#8249; Préc.</button>
      <span id="nav-title"></span>
      <button id="btn-suiv" class="nav-btn nav-btn--next" onclick="changerOffset(1)">Suiv. &#8250;</button>
    </nav>
    <input type="number" id="chapNum" value="0" min="0" max="138"
           style="display:none" onchange="chargerChapitre()">
  </header>

  <main id="viewer"></main>

  <button id="back-to-top" onclick="window.scrollTo({top:0,behavior:'smooth'})">&#8593;</button>

  <script src="lecteur.js"></script>
</body>
</html>
```

- [ ] **Étape 2 : Vérifier dans le navigateur**

Ouvrir `Liebling!/lecteur.html` via Live Server :
- La barre de navigation affiche : `🏠 | ‹ Préc. | Liebling ! — Ch. 0 | Suiv. ›`
- Les images du chapitre 0 se chargent bout à bout, sans espace
- `‹ Préc.` est désactivé (chapitre minimum)
- Cliquer `Suiv. ›` passe au chapitre 1 et met à jour le titre
- `🏠` redirige vers `index.html`
- Le bouton ↑ apparaît après 500px de scroll
- Sur mobile (DevTools 375px) : nav sur une ligne, images pleine largeur, pas de scroll horizontal

- [ ] **Étape 3 : Vérifier la progression dans les deux sens**

1. Aller au chapitre 47 dans le lecteur
2. Revenir sur `index.html` → la carte affiche `▶ Continuer au chapitre 47`

- [ ] **Étape 4 : Commit**

```bash
git add "Liebling!/lecteur.html"
git commit -m "feat: rewrite lecteur.html with semantic HTML, import style.css + lecteur.js"
```

---

## Task 7 : Mettre à jour `CLAUDE.md`

**Fichiers :**
- Modifier : `CLAUDE.md`

- [ ] **Étape 1 : Remplacer la section `## File Structure` dans `CLAUDE.md`**

```markdown
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
```

Mettre à jour aussi la section `## Architecture du lecteur` :

```markdown
## Architecture du lecteur (`lecteur.js`)

**Constantes à ajuster par webtoon :**
```js
var MIN_CHAP = 0;
var MAX_CHAP = 138;
var MAX_PAGES_BOUCLE = 200;
```

**Clé localStorage :**
```js
var STORAGE_KEY = 'webtoon_save_' + folderName;
```
Générée automatiquement depuis le nom du dossier.

**Fonctions principales :**
- `chargerChapitre()` — vide le viewer, charge les images, sauvegarde la progression
- `changerOffset(dir)` — change de chapitre (+1 ou -1)
- `validerBornes()` — désactive les boutons aux limites, met à jour le titre
```

- [ ] **Étape 2 : Commit final**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for refonte file structure"
```

---

## Vérification finale

- [ ] `index.html` — HTML valide, sémantique (`header`, `main`, `section`, `article`)
- [ ] `style.css` — toutes les media queries en `min-width`, variables CSS utilisées partout, aucun `max-width`
- [ ] `Liebling!/lecteur.html` — HTML valide, sémantique (`header`, `nav`, `main`, `figure`), aucun style inline sauf `display:none` sur `#chapNum`
- [ ] `Liebling!/lecteur.js` — aucun `innerHTML`, toutes les valeurs DOM via `textContent` ou attributs explicites
- [ ] Mobile (375px) : nav sur une ligne, images pleine largeur, pas de scroll horizontal
- [ ] Desktop (1200px) : grille 3 colonnes sur `index.html`, lecteur max 800px centré
- [ ] Progression : `index.html` lit correctement le localStorage écrit par `lecteur.js`
