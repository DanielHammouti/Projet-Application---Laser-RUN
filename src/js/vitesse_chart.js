// Crée une courbe de vitesse (m/s) en fonction du temps cumulé
// tableau = [{distance: 400, temps_course: 75}, ...] (temps en secondes)
function create_graph(tableau) {
  // Toujours 3 phases
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
  const vitesses = tableau.map(d => (d.temps > 0 ? (d.distance / d.temps) * 3.6 : 0));

  // Construction des points : (0, v1), (t1, v2), (t1+t2, v3), (t1+t2+t3, v3)
  let labels = [cumuls[0].toFixed(1), cumuls[1].toFixed(1), cumuls[2].toFixed(1), cumuls[3].toFixed(1)];
  let data = [vitesses[0], vitesses[1], vitesses[2], vitesses[2]];

  const ctx = document.getElementById('vitesseCourbe').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Vitesse moyenne (km/h)',
        data: data,
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