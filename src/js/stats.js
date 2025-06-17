// Variable globale pour stocker les données des sessions
let sessionsData = [];

// Fonction pour récupérer les données depuis l'API
async function fetchSessionsData() {
    try {
        // Récupérer l'ID de l'utilisateur depuis Firebase
        const user = firebase.auth().currentUser;
        if (!user) {
            throw new Error("Utilisateur non connecté");
        }

        // Appeler l'API pour récupérer les sessions
        const response = await fetch(`/api/sessions/read.php?id_user=${user.uid}`);
        const data = await response.json();

        if (!data.sessions) {
            throw new Error("Aucune session trouvée");
        }

        // Transformer les données pour les graphiques
        // On inverse l'ordre des sessions pour avoir la plus ancienne en premier
        sessionsData = data.sessions.reverse().map((session, index) => ({
            session: index + 1,
            "200": parseFloat(session.deux) || 0,
            "400": parseFloat(session.quatre) || 0,
            "600": parseFloat(session.six) || 0,
            nb_tirs: parseInt(session.nb_tirs) || 0,
            meneur: session.meneur === "1" // Convertir en booléen
        }));

    } catch (error) {
        // En cas d'erreur, utiliser des données de test
        sessionsData = [
            { session: 1, "200": 10, "400": 20, "600": 30, nb_tirs: 12, meneur: false },
            { session: 2, "200": 12, "400": 22, "600": 32, nb_tirs: 10, meneur: true },
            { session: 3, "200": 50, "400": 25, "600": 35, nb_tirs: 8, meneur: false },
            { session: 4, "200": 35, "400": 28, "600": 38, nb_tirs: 13, meneur: true },
            { session: 5, "200": 25, "400": 30, "600": 40, nb_tirs: 15, meneur: false }
        ];
    }
}

function createDistanceGraph(distance) {
    const ctx = document.getElementById(`graph${distance}`).getContext('2d');
    const data = sessionsData.map(session => ({
        x: session.session,
        y: session[distance]
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `Temps ${distance}m`,
                data: data,
                borderColor: '#608969',
                backgroundColor: 'rgba(96,137,105,0.08)',
                fill: true,
                tension: 0.2,
                pointRadius: 6,
                pointBackgroundColor: sessionsData.map(session => 
                    session.meneur ? '#FF4444' : '#608969'
                ),
                pointBorderColor: sessionsData.map(session => 
                    session.meneur ? '#FF4444' : '#608969'
                )
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: `Évolution du temps sur ${distance}m` },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const session = sessionsData[context.dataIndex];
                            let label = `Temps: ${context.parsed.y}s`;
                            if (session.meneur) {
                                label += ' (avec meneur)';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'Session' },
                    min: 1,
                    max: Math.max(...sessionsData.map(s => s.session)),
                    ticks: {
                        stepSize: 1
                    }
                },
                y: {
                    title: { display: true, text: 'Temps (s)' },
                    min: 0
                }
            }
        }
    });
}

function createShotsGraph() {
    const ctx = document.getElementById('graphShots').getContext('2d');
    const data = sessionsData.map(session => ({
        x: session.session,
        y: session.nb_tirs
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Tirs réussis',
                data: data,
                borderColor: '#608969',
                backgroundColor: 'rgba(96,137,105,0.08)',
                fill: true,
                tension: 0.2,
                pointRadius: 6,
                pointBackgroundColor: sessionsData.map(session => 
                    session.meneur ? '#FF4444' : '#608969'
                ),
                pointBorderColor: sessionsData.map(session => 
                    session.meneur ? '#FF4444' : '#608969'
                )
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Évolution des tirs réussis' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const session = sessionsData[context.dataIndex];
                            let label = `Tirs réussis: ${context.parsed.y}`;
                            if (session.meneur) {
                                label += ' (avec meneur)';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: 'Session' },
                    min: 1,
                    max: Math.max(...sessionsData.map(s => s.session)),
                    ticks: {
                        stepSize: 1
                    }
                },
                y: {
                    title: { display: true, text: 'Nombre de tirs réussis' },
                    min: 0,
                    max: 15,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

async function stats() {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            // Attendre que Firebase soit initialisé
            await new Promise(resolve => {
                const checkFirebase = setInterval(() => {
                    if (firebase.auth()) {
                        clearInterval(checkFirebase);
                        resolve();
                    }
                }, 100);
            });

            // Attendre que l'utilisateur soit connecté
            await new Promise(resolve => {
                const unsubscribe = firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        unsubscribe();
                        resolve();
                    }
                });
            });

            // Récupérer les données et créer les graphiques
            await fetchSessionsData();
            createDistanceGraph('200');
            createDistanceGraph('400');
            createDistanceGraph('600');
            createShotsGraph();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des statistiques:', error);
        }
    });
}

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