// Calcule les temps moyens aux 100m pour chaque phase et la moyenne globale
function calculerTempsMoyen100m(tableau) {
  console.log('Données reçues:', tableau);
  
  // On calcule simplement le temps moyen aux 100m pour chaque phase
  const temps100m = tableau.map(phase => {
    if (!phase.temps || !phase.distance || phase.distance === 0) {
      return 0;
    }
    const tempsMoyen = (phase.temps / phase.distance) * 100;
    console.log('Phase:', {
      temps: phase.temps,
      distance: phase.distance,
      tempsMoyen100m: tempsMoyen
    });
    return tempsMoyen;
  });

  // Calcul de la moyenne (en excluant les valeurs nulles)
  const tempsValides = temps100m.filter(t => t > 0);
  const moyenne = tempsValides.length > 0 
    ? tempsValides.reduce((a, b) => a + b, 0) / tempsValides.length 
    : 0;

  return {
    phase1: formatTemps(temps100m[0]),
    phase2: formatTemps(temps100m[1]),
    phase3: formatTemps(temps100m[2]),
    moyenne: formatTemps(moyenne)
  };
}

function formatTemps(temps) {
  if (!temps || temps === 0) {
    return "00:00";
  }
  const minutes = Math.floor(temps / 60);
  const secondes = Math.round(temps % 60);
  return `${minutes.toString().padStart(2, '0')}:${secondes.toString().padStart(2, '0')}`;
}

// Crée une courbe de vitesse (km/h) en fonction du temps cumulé
function create_graph(tableau) {
  console.log('Données pour le graphique:', tableau);
  
  // On calcule les points de vitesse pour chaque phase
  let tempsCumule = 0;
  const points = [];
  
  // Point initial
  points.push({
    temps: 0,
    vitesse: tableau[0].temps > 0 ? (tableau[0].distance / tableau[0].temps) * 3.6 : 0
  });
  
  // Points pour chaque phase
  tableau.forEach(phase => {
    if (phase.temps > 0) {
      tempsCumule += phase.temps;
      const vitesse = (phase.distance / phase.temps) * 3.6; // km/h
      points.push({
        temps: tempsCumule,
        vitesse: vitesse
      });
    }
  });

  console.log('Points du graphique:', points);

  const ctx = document.getElementById('vitesseCourbe').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: points.map(p => p.temps.toFixed(1)),
      datasets: [{
        label: 'Vitesse moyenne (km/h)',
        data: points.map(p => p.vitesse),
        borderColor: '#608969',
        backgroundColor: 'rgba(96,137,105,0.08)',
        fill: true,
        tension: 0.2,
        pointRadius: 4,
        pointBackgroundColor: '#608969',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Vitesse moyenne en fonction du temps (km/h)'}
      },
      scales: {
        x: {
          title: { display: true, text: 'Temps cumulé (s)' },
          min: 0
        },
        y: {
          title: { display: true, text: 'Vitesse (km/h)' },
          min: 0,
          max: 30
        }
      }
    }
  });
} 