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

// Lire l'état sauvegardé (supporte ancien format entier et nouveau format JSON)
function lireEtat() {
  var raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) return null;
  try {
    var state = JSON.parse(raw);
    if (typeof state === 'object' && state !== null) return state;
  } catch (e) {}
  // Ancien format : entier brut
  var chap = parseInt(raw, 10);
  return isNaN(chap) ? null : { chap: chap, scroll: 0, done: true };
}

// Sauvegarder l'état complet
function sauvegarderEtat(done) {
  var state = {
    chap: currentChap(),
    scroll: done ? 0 : window.scrollY,
    done: done
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Charger les images d'un chapitre
// navigated = true quand appelé depuis changerOffset (chapitre précédent terminé)
function chargerChapitre(navigated) {
  var chap = Math.max(MIN_CHAP, Math.min(MAX_CHAP, currentChap()));
  document.getElementById('chapNum').value = chap;
  validerBornes();
  var viewer = document.getElementById('viewer');

  sauvegarderEtat(navigated ? true : false);

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
      img.loading = (pageNum <= 3) ? 'eager' : 'lazy';
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
// La navigation explicite marque le chapitre courant comme terminé
function changerOffset(direction) {
  var chap = currentChap() + direction;
  if (chap >= MIN_CHAP && chap <= MAX_CHAP) {
    document.getElementById('chapNum').value = chap;
    chargerChapitre(true);
  }
}

// Sauvegarde de la position de défilement + bouton retour en haut
window.addEventListener('scroll', function() {
  sauvegarderEtat(false);
  var btn = document.getElementById('back-to-top');
  btn.style.display = (window.scrollY > 500) ? 'block' : 'none';
});

// Initialisation au chargement
window.addEventListener('load', function() {
  var state = lireEtat();
  if (state !== null) {
    document.getElementById('chapNum').value = state.chap;
    chargerChapitre(state.done);
    // Restaurer la position si lecture interrompue en cours de chapitre
    if (!state.done && state.scroll > 0) {
      setTimeout(function() { window.scrollTo(0, state.scroll); }, 300);
    }
  } else {
    chargerChapitre(false);
  }
});

// Touche Entrée pour recharger
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') chargerChapitre(false);
});
