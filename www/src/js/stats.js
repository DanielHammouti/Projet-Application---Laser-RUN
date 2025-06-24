// Variable globale pour stocker les données des sessions
let sessionsData = [];
// Variables pour stocker les instances des graphiques
let charts = {
    '200': null,
    '400': null,
    '600': null,
    'shots': null
};

// Fonction utilitaire de traduction
function t(key) {
    return window.getTranslation ? window.getTranslation(key) : key;
}

let currentUser = null;

// Fonction pour récupérer les données depuis l'API
async function fetchSessionsData() {
    try {
        // Récupérer l'ID de l'utilisateur depuis Firebase
        if (!currentUser) {
            return;
        }
        console.log("ID utilisateur:", currentUser.uid);

        // Appeler l'API pour récupérer les sessions
        const response = await fetch(
            `https://172.16.100.3/api/sessions/read.php?id_user=${currentUser.uid}`,
            { credentials: 'include' }
        );
        console.log("Status de la réponse:", response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Données parsées:", data);

        if (!data.sessions) {
            throw new Error("Aucune session trouvée");
        }

        // Transformer les données pour les graphiques
        const reversedSessions = data.sessions.reverse();
        console.log("Sessions inversées:", reversedSessions);
        
        const lastFiveSessions = reversedSessions.slice(-5);
        console.log("5 dernières sessions:", lastFiveSessions);

        sessionsData = lastFiveSessions.map((session, index) => {
            const mappedSession = {
                session: index + 1,
                "200": parseFloat(session.deux) || 0,
                "400": parseFloat(session.quatre) || 0,
                "600": parseFloat(session.six) || 0,
                nb_tirs: parseInt(session.nb_tirs) || 0,
                meneur: session.meneur === 1 || session.meneur === "1" || session.meneur === 'yes' || session.meneur === true
            };
            console.log(`Session ${index + 1} mappée:`, mappedSession);
            return mappedSession;
        });
        console.log("Données finales pour les graphiques:", sessionsData);

    } catch (error) {
        console.error("Erreur détaillée lors de la récupération des sessions:", error);
        if (error.stack) {
            console.error("Stack trace:", error.stack);
        }
        sessionsData = [];
    }
}

function createDistanceGraph(distance) {
    const ctx = document.getElementById(`graph${distance}`).getContext('2d');
    
    // Détruire l'ancien graphique s'il existe
    if (charts[distance]) {
        charts[distance].destroy();
    }
    
    const data = sessionsData.map(session => ({
        x: session.session,
        y: session[distance]
    }));

    // Si aucune donnée, ne pas créer le graphique
    if (data.length === 0) {
        return;
    }

    charts[distance] = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: `${t('time_distance_prefix')} ${distance}m`,
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
                title: { display: true, text: `${t('evolution_time_title')} ${distance}m` },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const session = sessionsData[context.dataIndex];
                            let label = `${t('time_distance_prefix')}: ${context.parsed.y}s`;
                            if (session.meneur) {
                                label += ` ${t('with_pacer')}`;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: t('session') },
                    min: 1,
                    max: Math.max(2, sessionsData.length), // Au moins 2 pour avoir une échelle visible
                    ticks: {
                        stepSize: 1
                    }
                },
                y: {
                    title: { display: true, text: t('time_axis') },
                    min: 0,
                    max: Math.max(60, Math.max(...data.map(d => d.y)) * 1.2) // Au moins 60 secondes ou 20% plus que le max
                }
            }
        }
    });

    // Mettre à jour le titre affiché au-dessus du graphique (élément .text)
    const heading = ctx.canvas.parentElement.querySelector('.text');
    if (heading) {
        heading.textContent = `${t('evolution_time_title')} ${distance}m`;
    }
}

function createShotsGraph() {
    const ctx = document.getElementById('graphShots').getContext('2d');
    
    // Détruire l'ancien graphique s'il existe
    if (charts['shots']) {
        charts['shots'].destroy();
    }
    
    const data = sessionsData.map(session => ({
        x: session.session,
        y: session.nb_tirs
    }));

    // Si aucune donnée, ne pas créer le graphique
    if (data.length === 0) {
        return;
    }

    charts['shots'] = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: t('tirs_reussis_graph'),
                data: data,
                borderColor: '#608969',
                backgroundColor: 'rgba(96,137,105,0.08)',
                fill: true,
                tension: 0.2,
                pointRadius: 6,
                pointBackgroundColor: '#608969',
                pointBorderColor: '#608969'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: t('evolution_shots_title') },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${t('tirs_reussis_graph')}: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: { display: true, text: t('session') },
                    min: 1,
                    max: Math.max(2, sessionsData.length), // Au moins 2 pour avoir une échelle visible
                    ticks: {
                        stepSize: 1
                    }
                },
                y: {
                    title: { display: true, text: t('shots_axis') },
                    min: 0,
                    max: Math.max(15, Math.max(...data.map(d => d.y)) * 1.2), // Au moins 15 ou 20% plus que le max
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });

    // Mettre à jour le titre affiché au-dessus du graphique des tirs
    const heading = ctx.canvas.parentElement.querySelector('.text');
    if (heading) {
        heading.textContent = t('evolution_shots_title');
    }
}

async function updateGraphs() {
    await fetchSessionsData();
    createDistanceGraph('200');
    createDistanceGraph('400');
    createDistanceGraph('600');
    createShotsGraph();
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
                        currentUser = user;  // Stocker l'utilisateur dans la variable globale
                        unsubscribe();
                        resolve();
                    }
                });
            });

            // Première création des graphiques
            await updateGraphs();

            // Mettre à jour les graphiques toutes les 30 secondes
            setInterval(updateGraphs, 30000);

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
          label: t('avg_speed_label'),
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
          title: { display: true, text: t('avg_speed_graph_title') }
        },
        scales: {
          x: {
            title: { display: true, text: t('cumulative_time_axis') },
            min: 0
          },
          y: {
            title: { display: true, text: t('speed_axis') },
            min: 0,
            max: 30
          }
        }
      }
    });
  } 

// Mettre à jour les graphiques lorsqu'on change de langue
document.addEventListener('languageChanged', () => {
    // Reconstruire les graphiques avec les nouveaux libellés
    updateGraphs();
}); 