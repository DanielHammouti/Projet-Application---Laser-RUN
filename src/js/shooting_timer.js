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

  // Fonction pour nettoyer les données incorrectes du localStorage
  cleanIncorrectData() {
    console.log('🧹 Nettoyage des données incorrectes...');
    
    // Vérifier et nettoyer session3Time si nécessaire
    const session3Time = localStorage.getItem('session3Time');
    if (session3Time) {
      const session3Seconds = this.timeStringToSeconds(session3Time);
      if (session3Seconds > 1000) {
        console.log('🗑️ Suppression de session3Time incorrect:', session3Time);
        localStorage.removeItem('session3Time');
        localStorage.removeItem('sixTime');
      }
    }
    
    // Vérifier et nettoyer sixTime si nécessaire
    const sixTime = localStorage.getItem('sixTime');
    if (sixTime) {
      const sixTimeValue = parseInt(sixTime);
      if (sixTimeValue > 1000) {
        console.log('🗑️ Suppression de sixTime incorrect:', sixTime);
        localStorage.removeItem('sixTime');
      }
    }
  },

  // Fonction utilitaire pour convertir un temps formaté en secondes
  timeStringToSeconds(timeString) {
    if (timeString === '0' || timeString === '00 : 00') return 0;
    const parts = timeString.split(' : ');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0]);
      const seconds = parseInt(parts[1]);
      return minutes * 60 + seconds;
    }
    return 0;
  },

  // Fonction pour récupérer et organiser les temps des 3 sessions
  getSessionTimes() {
    // Nettoyer les données incorrectes avant de récupérer
    this.cleanIncorrectData();
    
    // Récupérer les temps stockés dans le localStorage
    const session1Time = localStorage.getItem('session1Time') || '0';
    const session2Time = localStorage.getItem('session2Time') || '0';
    let session3Time = localStorage.getItem('session3Time') || '0';
    
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
    let session3Seconds = timeStringToSeconds(session3Time);
    
    // Vérifier si la session 3 doit être recalculée (si elle n'existe pas ou si elle semble incorrecte)
    const shouldRecalculate = session3Seconds === 0 || session3Seconds > 1000; // Si plus de 1000 secondes, c'est probablement incorrect
    
    if (shouldRecalculate) {
      console.log('⚠️ Session 3 à recalculer (valeur actuelle:', session3Seconds, 'secondes)...');
      const elapsedTime = parseInt(localStorage.getItem('elapsedTime') || '0');
      const fourTime = parseInt(localStorage.getItem('fourTime') || '0');
      const twoTime = parseInt(localStorage.getItem('twoTime') || '0');
      
      // Convertir elapsedTime de millisecondes en secondes
      const elapsedTimeSeconds = Math.floor(elapsedTime / 1000);
      
      // Calculer le temps de la 3ème session
      session3Seconds = elapsedTimeSeconds - (fourTime + twoTime);
      session3Time = this.formatTime(session3Seconds);
      
      console.log('🔧 Calcul automatique de la session 3:');
      console.log('  - elapsedTime (ms):', elapsedTime);
      console.log('  - elapsedTime (secondes):', elapsedTimeSeconds);
      console.log('  - fourTime (session 1):', fourTime);
      console.log('  - twoTime (session 2):', twoTime);
      console.log('  - session3Seconds calculé:', session3Seconds);
      console.log('  - session3Time formaté:', session3Time);
      
      // Stocker le temps calculé
      localStorage.setItem('session3Time', session3Time);
      localStorage.setItem('sixTime', session3Seconds.toString());
    }
    
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
    console.log('🔍 DEBUG - ShootingTimer.init() appelé');
    console.log('🔍 DEBUG - shootingSessions:', shootingSessions);
    
    // Si c'est la 3ème session, stocker le temps de la session précédente
    if (shootingSessions === 3) {
      console.log('🔍 DEBUG - 3ème session détectée, appel de storeThirdSessionTime()');
      this.storeThirdSessionTime();
      this.createFinishButton();
      const timeDisplay = document.querySelector('.temps-tirs');
      if (timeDisplay) timeDisplay.innerHTML = '<br />';
    } else {
      console.log('🔍 DEBUG - Session', shootingSessions, '- appel de startShootingTimer()');
      this.startShootingTimer();
    }
  },

  // Fonction pour stocker le temps de la 3ème session
  storeThirdSessionTime() {
    console.log('🔍 DEBUG - storeThirdSessionTime() appelée');
    
    // Méthode 1: Calcul avec elapsedTime et previousTotalTime
    const elapsedTime = parseInt(localStorage.getItem('elapsedTime') || '0');
    const previousTotalTime = parseInt(localStorage.getItem('previousTotalTime') || '0');
    
    // Convertir elapsedTime de millisecondes en secondes
    const elapsedTimeSeconds = Math.floor(elapsedTime / 1000);
    const previousTotalTimeSeconds = Math.floor(previousTotalTime / 1000);
    
    console.log('🔍 DEBUG - Valeurs récupérées:');
    console.log('  - elapsedTime (ms):', elapsedTime);
    console.log('  - elapsedTime (secondes):', elapsedTimeSeconds);
    console.log('  - previousTotalTime (ms):', previousTotalTime);
    console.log('  - previousTotalTime (secondes):', previousTotalTimeSeconds);
    
    // Calculer le temps de la 3ème session
    let sessionTime = elapsedTimeSeconds - previousTotalTimeSeconds;
    
    // Si le calcul donne 0, essayer une méthode alternative
    if (sessionTime <= 0) {
      console.log('⚠️ Calcul donne 0 ou négatif, utilisation de la méthode alternative');
      
      // Méthode 2: Calculer en soustrayant les temps des 2 premières sessions
      const fourTime = parseInt(localStorage.getItem('fourTime') || '0');
      const twoTime = parseInt(localStorage.getItem('twoTime') || '0');
      
      console.log('🔍 DEBUG - Méthode alternative:');
      console.log('  - fourTime (session 1):', fourTime);
      console.log('  - twoTime (session 2):', twoTime);
      console.log('  - elapsedTime total (secondes):', elapsedTimeSeconds);
      
      // Le temps de la 3ème session = temps total - (session1 + session2)
      sessionTime = elapsedTimeSeconds - (fourTime + twoTime);
      
      console.log('  - sessionTime calculé:', sessionTime);
    }
    
    const sessionTimeFormatted = this.formatTime(sessionTime);
    
    console.log('📊 Stockage du temps de la session 3 (600m):');
    console.log('  - elapsedTime (secondes):', elapsedTimeSeconds);
    console.log('  - previousTotalTime (secondes):', previousTotalTimeSeconds);
    console.log('  - sessionTime final:', sessionTime, 'secondes');
    console.log('  - sessionTimeFormatted:', sessionTimeFormatted);
    
    localStorage.setItem('session3Time', sessionTimeFormatted);
    localStorage.setItem('sixTime', sessionTime.toString());
    console.log('✅ Temps stocké pour session 3 (600m):', sessionTimeFormatted);
    
    // Vérification immédiate
    const storedSession3Time = localStorage.getItem('session3Time');
    const storedSixTime = localStorage.getItem('sixTime');
    console.log('🔍 DEBUG - Vérification après stockage:');
    console.log('  - session3Time stocké:', storedSession3Time);
    console.log('  - sixTime stocké:', storedSixTime);
  },

  // Fonction pour formater le temps en secondes en "MM : SS"
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`;
  },

  storeSessionTime() {
    const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
    const elapsedTime = parseInt(localStorage.getItem('elapsedTime') || '0');
    const elapsedTimeSeconds = Math.floor(elapsedTime / 1000);

    // Récupérer la fin de la session précédente (en secondes)
    const lastSessionEndTime = parseInt(localStorage.getItem('lastSessionEndTime') || '0');

    // Calculer le temps de la session courante
    const sessionTime = elapsedTimeSeconds - lastSessionEndTime;

    // Stocker le temps de la session courante
    if (shootingSessions === 1) {
      localStorage.setItem('session1Time', this.formatTime(sessionTime));
      localStorage.setItem('fourTime', sessionTime.toString());
    } else if (shootingSessions === 2) {
      localStorage.setItem('session2Time', this.formatTime(sessionTime));
      localStorage.setItem('twoTime', sessionTime.toString());
    } else if (shootingSessions === 3) {
      localStorage.setItem('session3Time', this.formatTime(sessionTime));
      localStorage.setItem('sixTime', sessionTime.toString());
    }

    // Mettre à jour la fin de la session précédente
    localStorage.setItem('lastSessionEndTime', elapsedTimeSeconds.toString());
  }
};

// Exécuter l'initialisation immédiatement
ShootingTimer.init();
