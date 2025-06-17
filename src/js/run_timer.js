let runStartTime;
let runTimerInterval;
let runIsRunning = false;

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

// Fonction pour arrêter le chronomètre et retourner le temps en secondes
function stopRunTimer() {
  if (runIsRunning) {
    clearInterval(runTimerInterval);
    runIsRunning = false;
    const elapsedTime = Date.now() - runStartTime;
    const seconds = Math.floor(elapsedTime / 1000);
    return seconds;
  }
  return 0;
}

// Fonction pour formater le temps en secondes en "MM : SS"
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`;
}

// Fonction pour stocker le temps de la session actuelle
function storeSessionTime() {
  const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
  const tempsFinalSeconds = stopRunTimer();
  const tempsFinalFormatted = formatTime(tempsFinalSeconds);
  
  console.log(`Stockage du temps de la session ${shootingSessions}:`, tempsFinalFormatted, `(${tempsFinalSeconds} secondes)`);
  
  // Stocker le temps selon le numéro de session
  if (shootingSessions === 1) {
    localStorage.setItem('session1Time', tempsFinalFormatted);
    console.log('Temps stocké pour session 1 (400m):', tempsFinalFormatted);
  } else if (shootingSessions === 2) {
    localStorage.setItem('session2Time', tempsFinalFormatted);
    console.log('Temps stocké pour session 2 (200m):', tempsFinalFormatted);
  } else if (shootingSessions === 3) {
    localStorage.setItem('session3Time', tempsFinalFormatted);
    console.log('Temps stocké pour session 3 (600m):', tempsFinalFormatted);
  }
  
  return tempsFinalFormatted;
}

document.addEventListener('DOMContentLoaded', () => {
  const timeDisplay = document.querySelector('.temps-tour');
  if (timeDisplay) {
    const label = window.getTranslation ? window.getTranslation('temps_tour') : 'Temps du tour';
    timeDisplay.innerHTML = `${label}<br />00 : 00`;
  }
  startRunTimer();
  
  // Stocker le temps quand on quitte la page (avant de partir vers la page de tir)
  window.addEventListener('beforeunload', () => {
    storeSessionTime();
  });
  
  // Stocker aussi quand on clique sur un lien qui mène vers la page de tir
  document.addEventListener('click', (e) => {
    if (e.target.closest('a[href*="shots_page.html"]')) {
      storeSessionTime();
    }
  });
});
