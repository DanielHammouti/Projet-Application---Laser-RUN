const tirsContainer = document.querySelector('.tirs');
const template = document.getElementById('ligne-tir-template');

// Fonction pour compter les tirs réussis
function countSuccessfulShots() {
  const successfulShots = document.querySelectorAll('.check-vert:checked').length;
  return successfulShots;
}

// Fonction pour sauvegarder le nombre de tirs réussis
function saveSuccessfulShots() {
  const successfulShots = countSuccessfulShots();
  const currentShots = parseInt(localStorage.getItem('nbTirs') || '0');
  localStorage.setItem('nbTirs', (currentShots + successfulShots).toString());
}

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

  // Ajouter un écouteur d'événement pour le tir réussi
  yesInput.addEventListener('change', function() {
    if (this.checked) {
      saveSuccessfulShots();
    }
  });

  noInput.setAttribute('onclick', 'openPopup()');

  tirsContainer.appendChild(clone);
}

function openPopup() {
  document.getElementById("popupOverlay").style.display = "flex";
}

function closePopup() {
  document.getElementById("popupOverlay").style.display = "none";
}
