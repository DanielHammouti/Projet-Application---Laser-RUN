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

document.addEventListener('DOMContentLoaded', () => {
  const timeDisplay = document.querySelector('.temps-tour');
  if (timeDisplay) {
    const label = window.getTranslation ? window.getTranslation('temps_tour') : 'Temps du tour';
    timeDisplay.innerHTML = `${label}<br />00 : 00`;
  }
  startRunTimer();
});
