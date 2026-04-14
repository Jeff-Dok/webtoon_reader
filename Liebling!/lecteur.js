// === Configuration — ajuster par webtoon ===
var MIN_CHAP = 0;
var MAX_CHAP = 138;
var MAX_PAGES_BOUCLE = 200;

// Clé localStorage unique basée sur le nom du dossier
var pathArray = window.location.pathname.split('/');
var folderName = decodeURIComponent(pathArray[pathArray.length - 2]);
var STORAGE_KEY = 'webtoon_save_' + folderName;

// Flag de session : une fois le bas atteint, ne plus revenir en arrière
var chapitreTermine = false;

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
  var chap = currentChap();
  var state = {
    chap: done ? Math.min(chap + 1, MAX_CHAP) : chap,
    scroll: done ? 0 : window.scrollY,
    done: done
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Charger les images d'un chapitre
// navigated = true quand appelé depuis changerOffset (chapitre précédent terminé)
function chargerChapitre(navigated) {
  chapitreTermine = false;
  var chap = Math.max(MIN_CHAP, Math.min(MAX_CHAP, currentChap()));
  document.getElementById('chapNum').value = chap;
  validerBornes();
  var viewer = document.getElementById('viewer');

  // Quand on navigue (Suiv./Préc.), le chapitre courant est déjà le bon à pointer
  if (navigated) {
    var state = { chap: chap, scroll: 0, done: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    sauvegarderEtat(false);
  }

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
function changerOffset(direction) {
  var chap = currentChap() + direction;
  if (chap >= MIN_CHAP && chap <= MAX_CHAP) {
    document.getElementById('chapNum').value = chap;
    chargerChapitre(true);
  }
}

// Sauvegarde de la position de défilement + bouton retour en haut
window.addEventListener('scroll', function() {
  if (!chapitreTermine) {
    var atBottom = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 50);
    if (atBottom) {
      chapitreTermine = true;
      sauvegarderEtat(true);
    } else {
      sauvegarderEtat(false);
    }
  }
  var btn = document.getElementById('back-to-top');
  btn.style.display = (window.scrollY > 500) ? 'block' : 'none';
});

// Restaurer le scroll une fois que la page est assez haute pour l'atteindre
function restaurerScroll(targetScroll) {
  var restored = false;

  function tryRestore() {
    if (restored) return;
    if (document.documentElement.scrollHeight >= targetScroll) {
      restored = true;
      window.scrollTo(0, targetScroll);
    }
  }

  // Tenter après chaque image chargée ou en erreur
  document.querySelectorAll('#viewer figure img').forEach(function(img) {
    img.addEventListener('load', tryRestore);
    img.addEventListener('error', tryRestore);
  });

  // Filet de sécurité si toutes les images sont déjà résolues
  tryRestore();
}

// Initialisation au chargement
window.addEventListener('load', function() {
  var state = lireEtat();
  if (state !== null) {
    document.getElementById('chapNum').value = state.chap;
    chargerChapitre(state.done);
    if (!state.done && state.scroll > 0) {
      restaurerScroll(state.scroll);
    }
  } else {
    chargerChapitre(false);
  }
});

// Touche Entrée pour recharger
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') chargerChapitre(false);
});
