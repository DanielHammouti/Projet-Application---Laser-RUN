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

  // Fonction pour récupérer et organiser les temps des 3 sessions
  getSessionTimes() {
    // Récupérer les temps stockés dans le localStorage
    const session1Time = localStorage.getItem('session1Time') || '0';
    const session2Time = localStorage.getItem('session2Time') || '0';
    const session3Time = localStorage.getItem('session3Time') || '0';
    
    // Convertir les temps formatés "MM : SS" en secondes
    function timeStringToSeconds(timeString) {
      if (timeString === '0' || timeString === '00 : 00') return 0;
      const parts = timeString.split(' : ');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0]);
        const seconds = parseInt(parts[1]);
        return minutes * 60 + seconds;
      }
      return 0;
    }
    
    // Convertir tous les temps en secondes
    const session1Seconds = timeStringToSeconds(session1Time);
    const session2Seconds = timeStringToSeconds(session2Time);
    const session3Seconds = timeStringToSeconds(session3Time);
    
    // Organiser selon l'ordre : 400m (session1), 200m (session2), 600m (session3)
    const fourTime = session1Seconds;  // 400m - première session
    const twoTime = session2Seconds;   // 200m - deuxième session
    const sixTime = session3Seconds;   // 600m - troisième session
    
    console.log('=== RÉCUPÉRATION DES TEMPS ===');
    console.log('Temps récupérés et organisés:');
    console.log('Session 1 (400m):', session1Time, '=', fourTime, 'secondes');
    console.log('Session 2 (200m):', session2Time, '=', twoTime, 'secondes');
    console.log('Session 3 (600m):', session3Time, '=', sixTime, 'secondes');
    console.log('Variables finales:');
    console.log('fourTime:', fourTime);
    console.log('twoTime:', twoTime);
    console.log('sixTime:', sixTime);
    console.log('==============================');
    
    return { fourTime, twoTime, sixTime };
  },

  // Fonction de test pour vérifier les temps
  testSessionTimes() {
    console.log('=== TEST DE RÉCUPÉRATION DES TEMPS ===');
    const { fourTime, twoTime, sixTime } = this.getSessionTimes();
    
    // Vérification des valeurs
    if (fourTime > 0) {
      console.log('✅ fourTime (400m) récupéré avec succès:', fourTime, 'secondes');
    } else {
      console.log('❌ fourTime (400m) est à 0 ou non défini');
    }
    
    if (twoTime > 0) {
      console.log('✅ twoTime (200m) récupéré avec succès:', twoTime, 'secondes');
    } else {
      console.log('❌ twoTime (200m) est à 0 ou non défini');
    }
    
    if (sixTime > 0) {
      console.log('✅ sixTime (600m) récupéré avec succès:', sixTime, 'secondes');
    } else {
      console.log('❌ sixTime (600m) est à 0 ou non défini');
    }
    
    console.log('=====================================');
    
    return { fourTime, twoTime, sixTime };
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
      // Test de récupération des temps
      const { fourTime, twoTime, sixTime } = this.testSessionTimes();
      
      // Stocker les variables pour utilisation ultérieure
      localStorage.setItem('fourTime', fourTime.toString());
      localStorage.setItem('twoTime', twoTime.toString());
      localStorage.setItem('sixTime', sixTime.toString());
      
      // Affichage des résultats finaux
      console.log('=== RÉSULTATS FINAUX ===');
      console.log('Temps prêts pour insertion en DB:');
      console.log('fourTime (400m):', fourTime, 'secondes');
      console.log('twoTime (200m):', twoTime, 'secondes');
      console.log('sixTime (600m):', sixTime, 'secondes');
      console.log('=======================');
      
      // Ici vous pourrez ajouter l'appel à l'API pour insérer dans la DB
      // sendSessionDataToAPI(fourTime, twoTime, sixTime);
      
      // Redirection vers la page de marquage
      window.location.href = '../html/mark_page.html';
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

// Exécuter l'initialisation immédiatement
ShootingTimer.init();
