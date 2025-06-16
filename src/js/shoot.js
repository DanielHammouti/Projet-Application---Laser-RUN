const tirsContainer = document.querySelector('.tirs');
const template = document.getElementById('ligne-tir-template');

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

    clone.querySelector('.num').textContent = i;

    noInput.setAttribute('onclick', 'openPopup()');

    // Ajouter les écouteurs d'événements pour le calcul du pourcentage
    yesInput.addEventListener('change', calculateShootingPercentage);
    noInput.addEventListener('change', calculateShootingPercentage);

    tirsContainer.appendChild(clone);
}

function calculateShootingPercentage() {
    let successfulShots = 0;
    const shotsPerSession = 5;

    // Récupérer la session actuelle
    const currentSession = parseInt(localStorage.getItem('shootingSessions')) || 1;
    
    // Compter les tirs réussis de la session actuelle
    for (let i = 1; i <= shotsPerSession; i++) {
        const yesInput = document.getElementById(`tir${i}-yes`);
        if (yesInput && yesInput.checked) {
            successfulShots++;
        }
    }

    // Sauvegarder les résultats de la session actuelle
    localStorage.setItem(`session${currentSession}Hits`, successfulShots);

    // Calculer le total des tirs réussis sur toutes les sessions
    let totalSuccessfulShots = 0;
    for (let session = 1; session <= currentSession; session++) {
        totalSuccessfulShots += parseInt(localStorage.getItem(`session${session}Hits`) || 0);
    }

    // Calculer le pourcentage sur le nombre total de tirs effectués jusqu'à présent
    const totalShotsSoFar = currentSession * shotsPerSession;
    const percentage = (totalSuccessfulShots / totalShotsSoFar) * 100;
    
    // Sauvegarder le pourcentage global
    localStorage.setItem('shootingPercentage', percentage);
}

function openPopup() {
    document.getElementById("popupOverlay").style.display = "flex";
}

function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
}

// Au chargement de la page, réinitialiser les résultats si c'est une nouvelle série
document.addEventListener('DOMContentLoaded', () => {
    const currentSession = parseInt(localStorage.getItem('shootingSessions')) || 1;
    if (currentSession === 1) {
        // Réinitialiser les résultats des sessions précédentes
        localStorage.removeItem('session1Hits');
        localStorage.removeItem('session2Hits');
        localStorage.removeItem('session3Hits');
        localStorage.removeItem('shootingPercentage');
        localStorage.removeItem('finalTotalTime'); // Réinitialiser aussi le temps final
        localStorage.removeItem('finalGrade'); // Réinitialiser aussi la note finale
    }
});