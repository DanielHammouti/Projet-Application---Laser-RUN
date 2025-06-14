// Configuration du temps de tir (en secondes)
const SHOOTING_TIME = 10; // 1:30 en secondes

let shootingTimer;
let timeLeft = SHOOTING_TIME;

function startShootingTimer() {
    // Arrêter le chronomètre principal
    if (typeof resetChronometer === 'function') {
        resetChronometer();
    }
    
    // Réinitialiser le temps
    timeLeft = SHOOTING_TIME;
    updateShootingDisplay();
    
    // Démarrer le décompte
    shootingTimer = setInterval(() => {
        timeLeft--;
        updateShootingDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(shootingTimer);
            // Rediriger vers la page run
            window.location.href = 'run_page.html';
        }
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
    const initialMinutes = Math.floor(SHOOTING_TIME / 60);
    const initialSeconds = SHOOTING_TIME % 60;
    const initialTimeString = `${initialMinutes.toString().padStart(2, '0')} : ${initialSeconds.toString().padStart(2, '0')}`;
    
    const timeDisplay = document.querySelector('.temps-tirs');
    if (timeDisplay) {
        timeDisplay.innerHTML = `Temps pour tirer<br />${initialTimeString}`;
    }
    
    startShootingTimer();
}); 