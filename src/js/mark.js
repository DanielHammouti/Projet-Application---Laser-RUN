document.addEventListener('DOMContentLoaded', () => {
    // Arrêter le chronomètre
    if (typeof resetChronometer === 'function') {
        clearInterval(timerInterval);
        isRunning = false;
        localStorage.setItem('isRunning', 'false');
    }

    // Récupérer et logger toutes les données stockées
    const storedData = {
        rawRunningGrade: localStorage.getItem('rawRunningGrade'),
        rawShootingGrade: localStorage.getItem('rawShootingGrade'),
        runningPercentage: localStorage.getItem('runningPercentage'),
        shootingPercentage: localStorage.getItem('shootingPercentage'),
        finalTotalTime: localStorage.getItem('finalTotalTime'),
        shootingSuccessRate: localStorage.getItem('shootingSuccessRate'),
        session1Hits: localStorage.getItem('session1Hits'),
        session2Hits: localStorage.getItem('session2Hits'),
        session3Hits: localStorage.getItem('session3Hits')
    };
    console.log('Données stockées:', storedData);

    // Vérifier si les données essentielles sont présentes
    if (!storedData.rawRunningGrade || !storedData.rawShootingGrade || 
        !storedData.runningPercentage || !storedData.finalTotalTime) {
        console.error('Données manquantes - Redirection vers la page d\'accueil');
        alert('Erreur : données manquantes. Veuillez recommencer la course.');
        window.location.href = 'index.html';
        return;
    }

    // Récupérer les notes brutes
    const rawRunningGrade = parseFloat(localStorage.getItem('rawRunningGrade')) || 0;
    const rawShootingGrade = parseFloat(localStorage.getItem('rawShootingGrade')) || 0;
    
    // Récupérer les pourcentages de répartition
    const runningPercentage = parseFloat(localStorage.getItem('runningPercentage')) || 50;
    const shootingPercentage = 100 - runningPercentage;
    
    // Calculer la note finale sur 20
    const runningPoints = (rawRunningGrade * runningPercentage) / 100 * 2;
    const shootingPoints = (rawShootingGrade * shootingPercentage) / 100 * 2;
    const finalGrade = runningPoints + shootingPoints;
    
    console.log('Calculs des notes:', {
        rawRunningGrade,
        rawShootingGrade,
        runningPercentage,
        shootingPercentage,
        runningPoints,
        shootingPoints,
        finalGrade
    });

    localStorage.setItem('finalGrade', finalGrade);

    // Fonction pour mettre à jour l'affichage
    function updateDisplayValues() {
        // Temps total
        const finalTime = parseInt(localStorage.getItem('finalTotalTime')) || 0;
        const minutes = Math.floor((finalTime / (1000 * 60)));
        const seconds = Math.floor((finalTime / 1000) % 60);
        const timeString = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
        
        // Pourcentage de réussite au tir
        const shootingSuccessRate = parseFloat(localStorage.getItem('shootingSuccessRate')) || 0;
        
        // Mettre à jour l'affichage du temps total
        const tempsTotal = document.getElementById('temps_total');
        if (tempsTotal) {
            const label = window.getTranslation ? window.getTranslation('temps_total') : 'Temps Total';
            tempsTotal.innerHTML = `${label}<br />${timeString}`;
            console.log('Mise à jour temps total:', timeString);
        }

        // Mettre à jour l'affichage du résultat de tir
        const resultatTir = document.getElementById('resultat_tir');
        if (resultatTir) {
            resultatTir.textContent = `Tir Réussi : ${shootingSuccessRate.toFixed(1)}%`;
            console.log('Mise à jour résultat tir:', shootingSuccessRate);
        }

        // Mettre à jour l'affichage de la note finale
        const resultatNote = document.getElementById('resultat_note');
        if (resultatNote) {
            resultatNote.innerHTML = `Vous avez obtenu<br>la note de<br>${finalGrade.toFixed(1)}/20`;
            console.log('Mise à jour note finale:', finalGrade);
        }

        // Générer le bloc récapitulatif stylé
        const details = `
            <div style="margin-top: 24px; text-align: center; font-size: 1.1em;">
                <p>Répartition des points :</p>
                <p>Course : ${runningPercentage}% - Tir : ${shootingPercentage}%</p>
                <p>Note course : ${rawRunningGrade}/10 (${runningPoints.toFixed(1)}/20)</p>
                <p>Note tir : ${rawShootingGrade}/10 (${shootingPoints.toFixed(1)}/20)</p>
            </div>
        `;
        const resultatDetails = document.getElementById('resultat_details');
        if (resultatDetails) {
            resultatDetails.innerHTML = details;
        }
    }

    // Appeler la fonction de mise à jour immédiatement
    updateDisplayValues();

    // Réappliquer la mise à jour après un court délai pour s'assurer que le DOM est bien chargé
    setTimeout(updateDisplayValues, 100);
    
    // Et une dernière fois après 500ms pour être vraiment sûr
    setTimeout(updateDisplayValues, 500);
}); 