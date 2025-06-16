// Crée une courbe de vitesse (m/s) en fonction du temps cumulé
// tableau = [{distance: 400, temps_course: 75}, ...] (temps en secondes)
function create_graph(tableau) {
  // Toujours 3 phases
  const defaultLabels = ['Phase 1', 'Phase 2', 'Phase 3'];
  // Compléter le tableau si besoin
  while (tableau.length < 3) {
    tableau.push({ distance: 0, temps: 0 });
  }
  // Calcul du temps cumulé (en s)
  let cumuls = [0];
  let total = 0;
  for (const d of tableau) {
    total += d.temps;
    cumuls.push(total);
  }
  // Calcul des vitesses (km/h) pour chaque phase
  // On place la vitesse de la phase sur l'intervalle correspondant
  let vitesses = [];
  for (let i = 0; i < tableau.length; i++) {
    const v = (tableau[i].temps > 0) ? (tableau[i].distance / tableau[i].temps) * 3.6 : 0;
    vitesses.push(v); // début de phase
    vitesses.push(v); // fin de phase
  }
  // Labels = temps cumulé (un point au début et à la fin de chaque phase)
  let labels = [];
  for (let i = 0; i < cumuls.length - 1; i++) {
    labels.push(cumuls[i].toFixed(1));
    labels.push(cumuls[i+1].toFixed(1));
  }

  const ctx = document.getElementById('vitesseCourbe').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Vitesse (km/h)',
        data: vitesses,
        borderColor: '#608969',
        backgroundColor: 'rgba(96,137,105,0.08)',
        fill: true,
        tension: 0,
        pointRadius: 4,
        pointBackgroundColor: '#608969',
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Vitesse instantanée en fonction du temps (km/h)'}
      },
      scales: {
        x: {
          title: { display: true, text: 'Temps cumulé (s)' }
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