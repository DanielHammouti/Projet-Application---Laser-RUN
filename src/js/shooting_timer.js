// Configuration du temps de tir (en secondes)
const SHOOTING_TIME = 3; // 1:30 en secondes

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
        const finalTime = localStorage.getItem('elapsedTime');
        localStorage.setItem('finalTotalTime', finalTime);
        
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
    
    // Récupérer la distance (400m ou 600m)
    const distance = localStorage.getItem('selectedDistance') || '400';
    
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

    // Calculer la note de course (sur 10)
    let runningGrade = 0;
    if (distance === '400') {
        if (gender === 'Homme') {
            if (totalTimeInSeconds <= 90) runningGrade = 10;
            else if (totalTimeInSeconds <= 100) runningGrade = 8;
            else if (totalTimeInSeconds <= 110) runningGrade = 6;
            else if (totalTimeInSeconds <= 120) runningGrade = 4;
            else if (totalTimeInSeconds <= 130) runningGrade = 2;
            else runningGrade = 0;
        } else { // Femme
            if (totalTimeInSeconds <= 110) runningGrade = 10;
            else if (totalTimeInSeconds <= 120) runningGrade = 8;
            else if (totalTimeInSeconds <= 130) runningGrade = 6;
            else if (totalTimeInSeconds <= 140) runningGrade = 4;
            else if (totalTimeInSeconds <= 150) runningGrade = 2;
            else runningGrade = 0;
        }
    } else { // 600m
        if (gender === 'Homme') {
            if (totalTimeInSeconds <= 140) runningGrade = 10;
            else if (totalTimeInSeconds <= 150) runningGrade = 8;
            else if (totalTimeInSeconds <= 160) runningGrade = 6;
            else if (totalTimeInSeconds <= 170) runningGrade = 4;
            else if (totalTimeInSeconds <= 180) runningGrade = 2;
            else runningGrade = 0;
        } else { // Femme
            if (totalTimeInSeconds <= 160) runningGrade = 10;
            else if (totalTimeInSeconds <= 170) runningGrade = 8;
            else if (totalTimeInSeconds <= 180) runningGrade = 6;
            else if (totalTimeInSeconds <= 190) runningGrade = 4;
            else if (totalTimeInSeconds <= 200) runningGrade = 2;
            else runningGrade = 0;
        }
    }

    // Sauvegarder les notes brutes et le pourcentage de réussite au tir
    localStorage.setItem('rawRunningGrade', runningGrade);
    localStorage.setItem('rawShootingGrade', shootingGrade);
    localStorage.setItem('shootingSuccessRate', shootingSuccessRate);
}

function startShootingTimer() {
    // Sauvegarder le temps total actuel avant de commencer le décompte
    const currentTotalTime = localStorage.getItem('elapsedTime') || '0';
    localStorage.setItem('previousTotalTime', currentTotalTime);
    
    // Mettre en pause le chronomètre principal
    localStorage.setItem('isRunning', 'false');
    
    // Incrémenter le compteur de sessions de tir
    const shootingSessions = parseInt(localStorage.getItem('shootingSessions') || '0');
    const newSessionCount = shootingSessions + 1;
    localStorage.setItem('shootingSessions', newSessionCount.toString());
    
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