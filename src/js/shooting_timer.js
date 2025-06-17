// shooting_timer.js

// Utiliser un objet pour encapsuler toutes les variables et fonctions
const ShootingTimer = {
  SHOOTING_TIME: 2,
  shootingTimer: null,
  timeLeft: 2,
  startTime: null,
  animationFrameId: null,

  // Fonction pour afficher le temps immédiatement
  displayTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeString = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;

    const timeDisplay = document.querySelector('.temps-tirs');
    if (timeDisplay) {
      const label = window.getTranslation ? window.getTranslation('temps_tir') : 'Temps Tir';
      timeDisplay.innerHTML = `${label} <br />${timeString}`;
    }
  },

  createFinishButton() {
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
      sendSessionDataToAPI();

      localStorage.setItem('sixTime', '0');
      localStorage.setItem('fourTime', '0');
      localStorage.setItem('twoTime', '0');
      localStorage.setItem('sixmeter', '0');
      localStorage.setItem('nbTirs', '0');

      //window.location.href = '../html/mark_page.html';
    };

    buttonContainer.appendChild(finishButton);
    shotsContainer.appendChild(buttonContainer);
  },

  updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - this.startTime) / 1000);
    const remainingTime = Math.max(0, this.SHOOTING_TIME - elapsedTime);
    
    this.displayTime(remainingTime);

    if (remainingTime <= 0) {
      cancelAnimationFrame(this.animationFrameId);
      localStorage.setItem('elapsedTime', localStorage.getItem('previousTotalTime'));
      localStorage.setItem('isRunning', 'true');
      window.location.href = '../html/run_page.html';
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => this.updateTimer());
  },

  startShootingTimer() {
    const currentTotalTime = localStorage.getItem('elapsedTime') || '0';
    localStorage.setItem('previousTotalTime', currentTotalTime);
    
    // Mettre en pause le chronomètre principal
    localStorage.setItem('isRunning', 'false');
    
    // Incrémenter le compteur de sessions de tir
    const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
    const newSessionCount = shootingSessions + 1;
    localStorage.setItem('shootingSessions', newSessionCount.toString());

    if (newSessionCount === 3) {
      this.createFinishButton();
      const timeDisplay = document.querySelector('.temps-tirs');
      if (timeDisplay) timeDisplay.innerHTML = '<br />';
      return; 
    }

    this.timeLeft = this.SHOOTING_TIME;
    this.displayTime(this.timeLeft);
    
    // Démarrer le timer avec un délai minimal
    setTimeout(() => {
      this.startTime = Date.now();
      this.animationFrameId = requestAnimationFrame(() => this.updateTimer());
    }, 100);
  },

  init() {
    // Afficher le temps initial immédiatement
    this.displayTime(this.SHOOTING_TIME);
    
    const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0', 10);
    if (shootingSessions === 3) {
      this.createFinishButton();
      const timeDisplay = document.querySelector('.temps-tirs');
      if (timeDisplay) timeDisplay.innerHTML = '<br />';
    } else {
      this.startShootingTimer();
    }
  }
};

function sendSessionDataToAPI() {
  const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
  const sixmeter = parseInt(localStorage.getItem('sixmeter') || '0');
  const fourmeter = parseInt(localStorage.getItem('fourmeter') || '0');
  const twometer = parseInt(localStorage.getItem('twometer') || '0');
  const nbTirs = parseInt(localStorage.getItem('nbTirs') || '0');
  const idUser = localStorage.getItem('userId');
  const meneur = localStorage.getItem('meneur') === 'true' ? 1 : 0;
  
  const url = 'https://172.16.100.3/api/sessions/create.php';
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    data: { 
      id_user: idUser,
      six: sixmeter,
      quatre: fourmeter,
      deux: twometer,
      nb_tirs: nbTirs,
      meneur: meneur
    },
    success: function(response) {
      console.log('Réponse de l\'API:', response);
      if (response.message) {
        console.log('Message:', response.message);
      }
    },
    error: function(xhr, status, error) {
      console.error('Erreur lors de la création de la session de tir:');
      console.error('Status:', status);
      console.error('Error:', error);
    }
  });
}

// Exécuter l'initialisation immédiatement
ShootingTimer.init();
