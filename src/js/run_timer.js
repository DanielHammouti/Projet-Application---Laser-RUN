let runStartTime;
let runTimerInterval;
let runIsRunning = false;

let sixTime = 0;
let fourTime = 0;
let twoTime = 0;
let sixmeter = 0;
let nbTirs = 0;

function startRunTimer() {
  if (!runIsRunning) {
    runStartTime = Date.now();
    runIsRunning = true;
    runTimerInterval = setInterval(updateRunDisplay, 1000);
    updateRunDisplay(); // Mise à jour immédiate
  }
}

function updateRunDisplay() {
  const elapsedTime = Date.now() - runStartTime;
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  const timeString = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;

  const timeDisplay = document.querySelector('.temps-tour');
  if (timeDisplay) {
    const label = window.getTranslation ? window.getTranslation('temps_tour') : 'Temps du tour';
    timeDisplay.innerHTML = `${label}<br />${timeString}`;
  }
}

// Fonction pour récupérer le temps du tour
function getTourTime() {
  if (!runIsRunning) return "00 : 00";
  
  const elapsedTime = Date.now() - runStartTime;
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  return `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
}

// Fonction pour arrêter le chronomètre
function stopRunTimer() {
  if (runIsRunning) {
    clearInterval(runTimerInterval);
    runIsRunning = false;
    return getTourTime(); // Retourne le temps final
  }
  return "00 : 00";
}

document.addEventListener('DOMContentLoaded', () => {
  const timeDisplay = document.querySelector('.temps-tour');
  if (timeDisplay) {
    const label = window.getTranslation ? window.getTranslation('temps_tour') : 'Temps du tour';
    timeDisplay.innerHTML = `${label}<br />00 : 00`;
    
    const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
    const sixmeter = parseInt(localStorage.getItem('sixmeter') || '0');

    const tempsFinal = stopRunTimer();

    if (shootingSessions === 1 && sixmeter === 0) {
      localStorage.setItem('fourmeter', tempsFinal);
    }
    else if (shootingSessions === 1 && sixmeter === 1) {
      localStorage.setItem('sixmeter', tempsFinal);
    }
    else if (shootingSessions === 2 && sixmeter === 0) {
      localStorage.setItem('twometer', tempsFinal);
    }
    else if (shootingSessions === 2 && sixmeter === 1) {
      localStorage.setItem('fourmeter', tempsFinal);
    }
    else if (shootingSessions === 3 && sixmeter === 0) {
      localStorage.setItem('sixmeter', tempsFinal);
    }
    
  }
  startRunTimer();
});
