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
  const excludedPages = ['settings_page.html', 'statistic_page.html', 'history_page.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (excludedPages.includes(currentPage)) return;

  const elapsedTime = parseInt(localStorage.getItem('elapsedTime')) || 0;
  const seconds = Math.floor((elapsedTime / 1000) % 60);
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
  currentTimeString = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;

  const timeDisplay = document.querySelector('.text-rectangle-noir');
  if (timeDisplay) {
    const label = window.getTranslation('temps_total');
    timeDisplay.innerHTML = `${label} <br />${currentTimeString}`;
  }
}

function getCurrentTimeString() {
  return currentTimeString;
}

function initializeChronometer() {
  if (window.location.pathname.endsWith('index.html')) {
    resetChronometer();
  } else if (window.location.pathname.endsWith('shots_page.html')) {
    clearInterval(timerInterval);
    isRunning = false;
    updateDisplay();
  } else if (localStorage.getItem('isRunning') === 'true') {
    startChronometer();
  } else {
    updateDisplay();
  }
}

document.addEventListener('DOMContentLoaded', initializeChronometer);
