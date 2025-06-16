let startTime;
let timerInterval;
let isRunning = false;
let currentTimeString = "00 : 00";

function resetChronometer() {
    clearInterval(timerInterval);
    isRunning = false;
    localStorage.setItem('isRunning', 'false');
    localStorage.setItem('elapsedTime', '0');
    currentTimeString = "00 : 00";
    updateDisplay();
}

function startChronometer() {
    if (!isRunning) {
        startTime = Date.now() - (parseInt(localStorage.getItem('elapsedTime')) || 0);
        isRunning = true;
        timerInterval = setInterval(updateChronometer, 1000);
        localStorage.setItem('isRunning', 'true');
    }
}

function updateChronometer() {
    const elapsedTime = Date.now() - startTime;
    localStorage.setItem('elapsedTime', elapsedTime.toString());
    updateDisplay();
}

function updateDisplay() {
    const elapsedTime = parseInt(localStorage.getItem('elapsedTime')) || 0;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    currentTimeString = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    
    const timeDisplay = document.querySelector('.text-rectangle-noir');
    if (timeDisplay) {
        timeDisplay.innerHTML = `Temps Total<br />${currentTimeString}`;
    }
}

function getCurrentTimeString() {
    return currentTimeString;
}

function initializeChronometer() {
    // Si nous sommes sur la page d'accueil, réinitialiser le chronomètre
    if (window.location.pathname.endsWith('html/index.html')) {
        resetChronometer();
    } 
    // Si nous sommes sur la page de tir, ne pas démarrer le chronomètre
    else if (window.location.pathname.endsWith('html/shots_page.html')) {
        clearInterval(timerInterval);
        isRunning = false;
        updateDisplay();
    }
    // Sur les autres pages, continuer normalement
    else if (localStorage.getItem('isRunning') === 'true') {
        startChronometer();
    } else {
        updateDisplay();
    }
}

// Initialiser le chronomètre au chargement de la page
document.addEventListener('DOMContentLoaded', initializeChronometer); 