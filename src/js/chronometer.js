let startTime;
let timerInterval;
let isRunning = false;
let currentTimeString = "00 : 00";
let elapsedTime = 0;

function updateElapsedTime() {
  if (isRunning) {
    elapsedTime = Date.now() - startTime;
  }
  return elapsedTime;
}

function resetChronometer() {
  clearInterval(timerInterval);
  isRunning = false;
  localStorage.setItem('isRunning', 'false');
  elapsedTime = 0;
  localStorage.setItem('elapsedTime', '0');
  currentTimeString = "00 : 00";
  updateDisplay();
}

function startChronometer() {
  if (!isRunning) {
    const savedTime = parseInt(localStorage.getItem('elapsedTime')) || 0;
    startTime = Date.now() - savedTime;
    elapsedTime = savedTime;
    isRunning = true;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      localStorage.setItem('elapsedTime', elapsedTime.toString());
      updateDisplay();
    }, 1000);
  }
}

function updateDisplay() {
  const excludedPages = ['settings_page.html', 'statistic_page.html', 'history_page.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (excludedPages.includes(currentPage)) return;

  const currentElapsedTime = updateElapsedTime();
  const seconds = Math.floor((currentElapsedTime / 1000) % 60);
  const minutes = Math.floor((currentElapsedTime / (1000 * 60)) % 60);
  currentTimeString = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;

  const timeDisplay = document.querySelector('.text-rectangle-noir');
  if (timeDisplay) {
    const label = window.getTranslation ? window.getTranslation('temps_total') : 'Temps Total';
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
    elapsedTime = parseInt(localStorage.getItem('elapsedTime')) || 0;
    updateDisplay();
  } else if (localStorage.getItem('isRunning') === 'true') {
    startChronometer();
  } else {
    elapsedTime = parseInt(localStorage.getItem('elapsedTime')) || 0;
    updateDisplay();
  }
}

initializeChronometer();

document.addEventListener('DOMContentLoaded', updateDisplay);
