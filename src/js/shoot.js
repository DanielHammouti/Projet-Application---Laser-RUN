const tirsContainer = document.querySelector('.tirs');
const template = document.getElementById('ligne-tir-template');

// Variable pour compter le nombre de tirs (récupérée depuis localStorage)
let nombreTirs = parseInt(localStorage.getItem('nombreTirs')) || 0;

for (let i = 1; i <= 5; i++) {
  const clone = template.content.cloneNode(true);
  const name = `tir${i}`;

  const yesInput = clone.querySelector('.check-vert');
  const noInput = clone.querySelector('.check-rouge');
  const yesLabel = clone.querySelector('.label-yes');
  const noLabel = clone.querySelector('.label-no');

  yesInput.id = `${name}-yes`;
  yesInput.name = name;
  noInput.id = `${name}-no`;
  noInput.name = name;

  yesLabel.htmlFor = yesInput.id;
  noLabel.htmlFor = noInput.id;

  const titre = clone.querySelector('.titre');
    const label = window.getTranslation ? window.getTranslation('tir') : 'Tir n°';
    titre.innerHTML = `${label} ${i}`;

  noInput.setAttribute('onclick', 'openPopup()');

  // Ajouter des event listeners pour compter les tirs
  yesInput.addEventListener('change', function() {
    if (this.checked) {
      nombreTirs++;
      localStorage.setItem('nombreTirs', nombreTirs.toString());
      console.log(`Nombre de tirs: ${nombreTirs}`);
    }
  });

  noInput.addEventListener('change', function() {
    if (this.checked) {
      nombreTirs++;
      localStorage.setItem('nombreTirs', nombreTirs.toString());
      console.log(`Nombre de tirs: ${nombreTirs}`);
    }
  });

  tirsContainer.appendChild(clone);
}

function openPopup() {
  document.getElementById("popupOverlay").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}

// Fonction pour obtenir le nombre total de tirs
function getNombreTirs() {
  return nombreTirs;
}

// Fonction pour réinitialiser le compteur (utile pour une nouvelle session complète)
function resetNombreTirs() {
  nombreTirs = 0;
  localStorage.setItem('nombreTirs', '0');
  console.log('Compteur de tirs réinitialisé');
}

// Afficher le nombre final de tirs dans la console
console.log(`Nombre total de tirs: ${nombreTirs}`);
