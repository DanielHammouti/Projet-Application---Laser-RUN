// Affichage du temps total et du pourcentage de tir réussi

document.addEventListener('DOMContentLoaded', () => {
    const finalTime = parseInt(localStorage.getItem('finalTotalTime')) || 0;
    const minutes = Math.floor((finalTime / (1000 * 60)));
    const seconds = Math.floor((finalTime / 1000) % 60);
    const timeString = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
    document.querySelector('.text-rectangle-noir').innerHTML = `Temps Total<br />${timeString}`;
    const shootingSuccessRate = parseFloat(localStorage.getItem('shootingSuccessRate')) || 0;
    document.querySelector('.resultat-tir').textContent = `Tir Réussi : ${shootingSuccessRate.toFixed(1)}%`;
});

function savePercentageAndContinue() {
    const selectedOption = document.querySelector('input[name="percentage"]:checked');
    const runningPercentage = parseInt(selectedOption.value);
    const shootingPercentage = 100 - runningPercentage;
    localStorage.setItem('runningPercentage', runningPercentage);
    localStorage.setItem('shootingPercentage', shootingPercentage);
    window.location.href = 'mark_page.html';
} 