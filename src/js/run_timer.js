let runStartTime;
let runTimerInterval;
let runIsRunning = false;

function startRunTimer() {
    if (!runIsRunning) {
        runStartTime = Date.now();
        runIsRunning = true;
        runTimerInterval = setInterval(updateRunDisplay, 1000);
        // Mettre à jour immédiatement pour éviter le délai d'une seconde
        updateRunDisplay();
    }
}

function updateRunDisplay() {
    const elapsedTime = Date.now() - runStartTime;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const timeString = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    
    const timeDisplay = document.querySelector('.temps-tour');
    if (timeDisplay) {
        timeDisplay.innerHTML = `Temps du tour<br />${timeString}`;
    }
}

// Démarrer le chronomètre au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser l'affichage à 00 : 00
    const timeDisplay = document.querySelector('.temps-tour');
    if (timeDisplay) {
        timeDisplay.innerHTML = `Temps du tour<br />00 : 00`;
    }
    
    // Démarrer le chronomètre immédiatement
    startRunTimer();
}); 