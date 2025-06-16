// shooting_timer.js

const SHOOTING_TIME = 2; // durée du temps de tir en secondes



let shootingTimer;
let timeLeft = SHOOTING_TIME;



function createFinishButton() {
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
  finishButton.textContent = window.getTranslation ? window.getTranslation('bouton_fin') : 'Marquer - Confirmer fin de course';
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
    window.location.href = '../html/mark_page.html';
  };

  buttonContainer.appendChild(finishButton);
  shotsContainer.appendChild(buttonContainer);
}

function startShootingTimer() {
  const currentTotalTime = localStorage.getItem('elapsedTime') || '0';
    localStorage.setItem('previousTotalTime', currentTotalTime);
    
    // Mettre en pause le chronomètre principal
    localStorage.setItem('isRunning', 'false');
    
    // Incrémenter le compteur de sessions de tir
    const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
    const newSessionCount = shootingSessions + 1;
    localStorage.setItem('shootingSessions', newSessionCount.toString());

  if (newSessionCount === 3) {
    createFinishButton();
    const timeDisplay = document.querySelector('.temps-tirs');
    if (timeDisplay) timeDisplay.innerHTML = '<br />';
    return; 
  }

  timeLeft = SHOOTING_TIME;
  updateShootingDisplay();

  shootingTimer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(shootingTimer);
      localStorage.setItem('elapsedTime', localStorage.getItem('previousTotalTime'));
      localStorage.setItem('isRunning', 'true');
      window.location.href = '../html/run_page.html';
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
    const label = window.getTranslation ? window.getTranslation('temps_tir') : 'Temps Tir';
    timeDisplay.innerHTML = `${label} <br />${timeString}`;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0', 10);

  if (shootingSessions === 3) {
    createFinishButton();
    const timeDisplay = document.querySelector('.temps-tirs');
    if (timeDisplay) timeDisplay.innerHTML = '<br />';
  } else {
    const initialMinutes = Math.floor(SHOOTING_TIME / 60);
    const initialSeconds = SHOOTING_TIME % 60;
    const initialTimeString = `${initialMinutes.toString().padStart(2, '0')} : ${initialSeconds.toString().padStart(2, '0')}`;

    const timeDisplay = document.querySelector('.temps-tirs');
    if (timeDisplay) {
      const label = window.getTranslation ? window.getTranslation('temps_tir') : 'Temps Tir';
      timeDisplay.innerHTML = `${label}<br />${initialTimeString}`;
    }
  }

  startShootingTimer();
});
