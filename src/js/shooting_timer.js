// Configuration du temps de tir (en secondes)
const SHOOTING_TIME = 20; // 1:30 en secondes

let shootingTimer;
let timeLeft = SHOOTING_TIME;

// Fonction pour créer le bouton de fin de course
function createFinishButton() {
    // Trouver le conteneur des tirs
    const shotsContainer = document.querySelector('.tirs');
    if (!shotsContainer) {
        return;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginTop = '20px';
    buttonContainer.style.marginBottom = '20px';
    buttonContainer.style.width = '100%';
    
    const finishButton = document.createElement('button');
    finishButton.textContent = 'Marquer - Confirmer fin de course';
    finishButton.style.padding = '10px 20px';
    finishButton.style.backgroundColor = '#608969';
    finishButton.style.color = '#fff';
    finishButton.style.border = 'none';
    finishButton.style.borderRadius = '5px';
    finishButton.style.cursor = 'pointer';
    finishButton.style.fontFamily = 'Inter-Regular';
    finishButton.style.fontSize = '18px';
    finishButton.style.width = '80%';
    finishButton.style.maxWidth = '300px';
    finishButton.style.marginTop = '50px';
    
    finishButton.onclick = () => {
        window.location.href = 'mark_page.html';
    };
    
    buttonContainer.appendChild(finishButton);
    shotsContainer.appendChild(buttonContainer);
}

function startShootingTimer() {
    // Sauvegarder le temps total actuel avant de commencer le décompte
    const currentTotalTime = localStorage.getItem('elapsedTime') || '0';
    localStorage.setItem('previousTotalTime', currentTotalTime);
    
    // Mettre en pause le chronomètre principal
    localStorage.setItem('isRunning', 'false');
    
    // Incrémenter le compteur de sessions de tir
    const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
    const newSessionCount = shootingSessions + 1;
    localStorage.setItem('shootingSessions', newSessionCount.toString());
    
    // Si c'est la troisième session, ajouter le bouton de fin de course et ne pas démarrer le décompte
    if (newSessionCount === 3) {
        createFinishButton();
        // Masquer uniquement le texte du temps
        const timeDisplay = document.querySelector('.temps-tirs');
        if (timeDisplay) {
            timeDisplay.innerHTML = '<br />';
        }
        return; // Ne pas démarrer le décompte
    }
    
    // Pour les sessions 1 et 2, démarrer le décompte normalement
    timeLeft = SHOOTING_TIME;
    updateShootingDisplay();
    
    // Démarrer le décompte
    shootingTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(shootingTimer);
            // Restaurer le temps total avant la redirection
            localStorage.setItem('elapsedTime', localStorage.getItem('previousTotalTime'));
            localStorage.setItem('isRunning', 'true');
            // Rediriger vers la page run
            window.location.href = 'run_page.html';
            return;
        }
        
        timeLeft--;
        updateShootingDisplay();
    }, 1000);
}

function updateShootingDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    
    const timeDisplay = document.querySelector('.temps-tirs');
    if (timeDisplay) {
        timeDisplay.innerHTML = `Temps pour tirer<br />${timeString}`;
    }
}

// Initialiser l'affichage avec le temps configuré
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si c'est la troisième session et ajouter le bouton si nécessaire
    const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
    
    if (shootingSessions === 3) {
        createFinishButton();
        // Masquer uniquement le texte du temps
        const timeDisplay = document.querySelector('.temps-tirs');
        if (timeDisplay) {
            timeDisplay.innerHTML = '<br />';
        }
    } else {
        const initialMinutes = Math.floor(SHOOTING_TIME / 60);
        const initialSeconds = SHOOTING_TIME % 60;
        const initialTimeString = `${initialMinutes.toString().padStart(2, '0')} : ${initialSeconds.toString().padStart(2, '0')}`;
        
        const timeDisplay = document.querySelector('.temps-tirs');
        if (timeDisplay) {
            timeDisplay.innerHTML = `Temps pour tirer<br />${initialTimeString}`;
        }
    }
    
    startShootingTimer();
}); 