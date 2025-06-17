// Configuration du temps de tir (en secondes)
const SHOOTING_TIME = 10; // 1:30 en secondes

let shootingTimer;
let timeLeft = SHOOTING_TIME;

// Fonction pour créer le bouton de fin de course
function createFinishButton() {
    const tirsContainer = document.querySelector('.tirs');
    if (!tirsContainer) {
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
    finishButton.classList.add('finish-button');
    
    finishButton.onclick = () => {
        // Sauvegarder le temps total final
        const finalTime = parseInt(localStorage.getItem('elapsedTime')) || 0;
        localStorage.setItem('finalTotalTime', finalTime);

        // Correction : enregistrer la durée de la dernière phase
        const phase1 = parseInt(localStorage.getItem('phase1Time')) || 0;
        const phase2 = parseInt(localStorage.getItem('phase2Time')) || 0;
        const phase3 = finalTime - phase1 - phase2;
        localStorage.setItem('phase3Time', phase3 > 0 ? phase3.toString() : '1');
        console.log('Enregistrement phase3Time:', phase3, 'ms');
        
        // Calculer et sauvegarder les notes brutes
        calculateRawGrades();
        
        // Rediriger vers la page de sélection des pourcentages
        window.location.href = '../html/percentage_page.html';
    };
    
    buttonContainer.appendChild(finishButton);
    tirsContainer.appendChild(buttonContainer);
}

function calculateRawGrades() {
    // Récupérer le pourcentage de tirs réussis (attention à ne pas utiliser la variable de répartition)
    const totalShots = 15; // 3 sessions de 5 tirs
    let successfulShots = 0;
    
    // Compter les tirs réussis de toutes les sessions
    for (let session = 1; session <= 3; session++) {
        successfulShots += parseInt(localStorage.getItem(`session${session}Hits`) || 0);
    }
    
    // Calculer le pourcentage de réussite
    const shootingSuccessRate = (successfulShots / totalShots) * 100;
    
    // Récupérer le temps total en secondes
    const finalTime = parseInt(localStorage.getItem('finalTotalTime')) || 0;
    const totalTimeInSeconds = finalTime / 1000;
    
    // Récupérer le sexe
    const gender = localStorage.getItem('selectedGender') || 'Homme';

    // Calculer la note de tir (sur 10)
    let shootingGrade = 0;
    if (shootingSuccessRate >= 90) shootingGrade = 10;
    else if (shootingSuccessRate >= 80) shootingGrade = 8;
    else if (shootingSuccessRate >= 70) shootingGrade = 6;
    else if (shootingSuccessRate >= 60) shootingGrade = 4;
    else if (shootingSuccessRate >= 50) shootingGrade = 2;
    else shootingGrade = 0;

    // Calculer la note de course (sur 10) pour 1200m
    let runningGrade = 0;
    if (gender === 'Homme') {
        if (totalTimeInSeconds <= 270) runningGrade = 10; // 4min30
        else if (totalTimeInSeconds <= 300) runningGrade = 8; // 5min00
        else if (totalTimeInSeconds <= 330) runningGrade = 6; // 5min30
        else if (totalTimeInSeconds <= 360) runningGrade = 4; // 6min00
        else if (totalTimeInSeconds <= 390) runningGrade = 2; // 6min30
        else runningGrade = 0;
    } else { // Femme
        if (totalTimeInSeconds <= 330) runningGrade = 10; // 5min30
        else if (totalTimeInSeconds <= 360) runningGrade = 8; // 6min00
        else if (totalTimeInSeconds <= 390) runningGrade = 6; // 6min30
        else if (totalTimeInSeconds <= 420) runningGrade = 4; // 7min00
        else if (totalTimeInSeconds <= 450) runningGrade = 2; // 7min30
        else runningGrade = 0;
    }

    // Sauvegarder les notes brutes et le pourcentage de réussite au tir
    localStorage.setItem('rawRunningGrade', runningGrade);
    localStorage.setItem('rawShootingGrade', shootingGrade);
    localStorage.setItem('shootingSuccessRate', shootingSuccessRate);
}

function startShootingTimer() {
    // Sauvegarder le temps total actuel avant de commencer le décompte
    const currentTotalTime = parseInt(localStorage.getItem('elapsedTime') || '0');
    console.log('DEBUG - État initial:', {
        currentTotalTime,
        shootingSessions: localStorage.getItem('shootingSessions'),
        phase1Time: localStorage.getItem('phase1Time'),
        phase2Time: localStorage.getItem('phase2Time'),
        phase3Time: localStorage.getItem('phase3Time'),
        phaseTotalBefore0: localStorage.getItem('phaseTotalBefore0'),
        phaseTotalBefore1: localStorage.getItem('phaseTotalBefore1'),
        phaseTotalBefore2: localStorage.getItem('phaseTotalBefore2')
    });
    
    localStorage.setItem('previousTotalTime', currentTotalTime.toString());
    
    // Incrémenter le compteur de sessions de tir
    const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
    const newSessionCount = shootingSessions + 1;
    localStorage.setItem('shootingSessions', newSessionCount.toString());

    console.log('DEBUG - Avant enregistrement phase:', {
        shootingSessions,
        newSessionCount,
        currentTotalTime
    });

    // Enregistrer le temps de la phase actuelle qui vient de se terminer
    if (shootingSessions >= 0 && shootingSessions < 3) {
        const previousTotalTime = parseInt(localStorage.getItem('phaseTotalBefore' + shootingSessions) || '0');
        const phaseTime = currentTotalTime - previousTotalTime;
        // Correction : ne jamais enregistrer de temps <= 0
        const validPhaseTime = phaseTime > 0 ? phaseTime : 1;
        // On enregistre la phase courante (pas la suivante)
        localStorage.setItem('phase' + (shootingSessions + 1) + 'Time', validPhaseTime.toString());
        
        console.log('DEBUG - Enregistrement phase ' + (shootingSessions + 1) + ':', {
            previousTotalTime,
            currentTotalTime,
            phaseTime,
            validPhaseTime
        });
    } else {
        console.log('DEBUG - Pas d\'enregistrement de phase:', {
            shootingSessions,
            condition: 'shootingSessions >= 0 && shootingSessions < 3'
        });
    }

    // Sauvegarder le temps total avant la prochaine phase
    localStorage.setItem('phaseTotalBefore' + newSessionCount, currentTotalTime.toString());
    console.log('DEBUG - Sauvegarde temps avant prochaine phase:', {
        newSessionCount,
        currentTotalTime
    });

    // Mettre en pause le chronomètre principal
    localStorage.setItem('isRunning', 'false');
    
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