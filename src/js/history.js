// history.js - Gestion de l'historique des sessions

let currentUser = null;

// Fonction pour formater la date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day}/${month}/${year}<br />${hours}:${minutes}`;
}

// Fonction pour formater le temps
function formatTime(seconds) {
  if (seconds === null || seconds === 0) return '--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Fonction pour formater un temps en MM:SS sans décimales
function formatTimeMMSS(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// Fonction pour calculer le pourcentage de réussite des tirs
function calculateShootingPercentage(nbTirs) {
  // Supposons qu'il y a 3 sessions de tir par course
  const totalShots = 3;
  if (totalShots === 0) return 0;
  return Math.round((nbTirs / totalShots) * 100);
}

// Fonction pour calculer la note sur 20
function calculateGrade(nbTirs) {
  // Supposons qu'il y a 3 sessions de tir par course
  const totalShots = 3;
  if (totalShots === 0) return 0;
  return Math.round((nbTirs / totalShots) * 20);
}

// Fonction pour créer une carte de session
function createSessionCard(session) {
  const shootingPercentage = calculateShootingPercentage(session.nb_tirs);
  const grade = calculateGrade(session.nb_tirs);
  
  const card = document.createElement('div');
  card.className = 'session-card';
  card.innerHTML = `
    <div class="session-header">
      <div class="session-date">${formatDate(session.dateheure)}</div>
      <div class="session-id">${window.getTranslation ? window.getTranslation('session') : 'Session'} #${session.id_session}</div>
    </div>
    <div class="session-content">
      <div class="session-stats">
        <table class="stats-table">
          <thead>
            <tr>
              <th>${window.getTranslation ? window.getTranslation('statistiques') : 'Statistiques'}</th>
              <th class="right-align">Temps moyen au 100m</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="stat-item">
                  <span class="stat-label">${window.getTranslation ? window.getTranslation('temps_600m') : 'Temps 600m:'}</span>
                  <span class="stat-value">${formatTime(session.six)}</span>
                </div>
              </td>
              <td class="right-align">
                <div class="stat-item">
                  <span class="stat-value right-align">${formatTimeMMSS(session.six / 6)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="stat-item">
                  <span class="stat-label">${window.getTranslation ? window.getTranslation('temps_400m') : 'Temps 400m:'}</span>
                  <span class="stat-value">${formatTime(session.quatre)}</span>
                </div>
              </td>
              <td class="right-align">
                <div class="stat-item">
                  <span class="stat-value right-align">${formatTimeMMSS(session.quatre / 4)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="stat-item">
                  <span class="stat-label">${window.getTranslation ? window.getTranslation('temps_200m') : 'Temps 200m:'}</span>
                  <span class="stat-value">${formatTime(session.deux)}</span>
                </div>
              </td>
              <td class="right-align">
                <div class="stat-item">
                  <span class="stat-value right-align">${formatTimeMMSS(session.deux / 2)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="stat-item">
                  <span class="stat-label">${window.getTranslation ? window.getTranslation('tirs_reussis') : 'Tirs réussis:'}</span>
                  <span class="stat-value">${Math.round((session.nb_tirs / 15) * 100)}% (${session.nb_tirs}/15)</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="stat-item">
                  <span class="stat-label">${window.getTranslation ? window.getTranslation('note') : 'Note:'}</span>
                  <span class="stat-value">${grade}/20</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="stat-item">
                  <span class="stat-label">Répartition optimale:</span>
                  <span class="stat-value">${shootingPercentage}%</span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="stat-item">
                  <span class="stat-label">${window.getTranslation ? window.getTranslation('meneur_allure') : 'Meneur d\'allure:'}</span>
                  <span class="stat-value">${session.meneur ? (window.getTranslation ? window.getTranslation('oui') : 'Oui') : (window.getTranslation ? window.getTranslation('non') : 'Non')}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  return card;
}

// Fonction pour charger l'historique des sessions
async function loadSessionsHistory() {
  try {
    const response = await fetch(`https://172.16.100.3/api/sessions/read.php?id_user=${currentUser.uid}`);
    
    // Si la réponse est 404, cela signifie qu'il n'y a pas de sessions pour cet utilisateur
    if (response.status === 404) {
      const container = document.getElementById('sessions-container');
      container.innerHTML = `
        <div class="no-sessions">
          <p>${window.getTranslation ? window.getTranslation('aucune_session') : 'Aucune session trouvée'}</p>
          <p>Commencez par effectuer votre première session d'entraînement !</p>
        </div>
      `;
      return;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const container = document.getElementById('sessions-container');
    container.innerHTML = '';
    
    if (data.sessions && data.sessions.length > 0) {
      // Trier les sessions par date (plus récentes en premier)
      const sortedSessions = data.sessions.sort((a, b) => 
        new Date(b.dateheure) - new Date(a.dateheure)
      );
      sortedSessions.forEach(session => {
        const totalTirs = 15;
        const nbTirs = session.nb_tirs || 0;
        // Calcul du temps total pour la note
        const tempsTotal = (session.six || 0) + (session.quatre || 0) + (session.deux || 0);
        // Calcul de la note avec la fonction getNote
        const user = fetch(`https://172.16.100.3/api/users/read_single.php?id=${currentUser.uid}`);
        const userData = user.json();
        const sexe = userData.user[0].sexe || 'homme';
        console.log(sexe);
        const noteObj = getBestNote(sexe, tempsTotal, nbTirs);
        const card = document.createElement('div');
        card.className = 'session-card';
        card.innerHTML = `
          <div class="session-header">
            <div class="session-date">${formatDate(session.dateheure)}</div>
            <div class="session-id">${window.getTranslation ? window.getTranslation('session') : 'Session'} #${session.id_session}</div>
          </div>
          <div class="session-content">
            <div class="session-stats">
              <table class="stats-table">
                <thead>
                  <tr>
                    <th>${window.getTranslation ? window.getTranslation('statistiques') : 'Statistiques'}</th>
                    <th class="right-align">Temps moyen au 100m</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="stat-item">
                        <span class="stat-label">${window.getTranslation ? window.getTranslation('temps_600m') : 'Temps 600m:'}</span>
                        <span class="stat-value">${formatTime(session.six)}</span>
                      </div>
                    </td>
                    <td class="right-align">
                      <div class="stat-item">
                        <span class="stat-value right-align">${formatTimeMMSS(session.six / 6)}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="stat-item">
                        <span class="stat-label">${window.getTranslation ? window.getTranslation('temps_400m') : 'Temps 400m:'}</span>
                        <span class="stat-value">${formatTime(session.quatre)}</span>
                      </div>
                    </td>
                    <td class="right-align">
                      <div class="stat-item">
                        <span class="stat-value right-align">${formatTimeMMSS(session.quatre / 4)}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="stat-item">
                        <span class="stat-label">${window.getTranslation ? window.getTranslation('temps_200m') : 'Temps 200m:'}</span>
                        <span class="stat-value">${formatTime(session.deux)}</span>
                      </div>
                    </td>
                    <td class="right-align">
                      <div class="stat-item">
                        <span class="stat-value right-align">${formatTimeMMSS(session.deux / 2)}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div class="stat-item">
                        <span class="stat-label">${window.getTranslation ? window.getTranslation('tirs_reussis') : 'Tirs réussis:'}</span>
                        <span class="stat-value">${Math.round((nbTirs / 15) * 100)}% (${nbTirs}/15)</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div class="stat-item">
                        <span class="stat-label">${window.getTranslation ? window.getTranslation('note') : 'Note:'}</span>
                        <span class="stat-value">${noteObj.total}/12 (${noteObj.courseNote} + ${noteObj.tirNote})</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div class="stat-item">
                        <span class="stat-label">Répartition optimale:</span>
                        <span class="stat-value">${noteObj.repartition}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <div class="stat-item">
                        <span class="stat-label">${window.getTranslation ? window.getTranslation('meneur_allure') : 'Meneur d\'allure:'}</span>
                        <span class="stat-value">${session.meneur ? (window.getTranslation ? window.getTranslation('oui') : 'Oui') : (window.getTranslation ? window.getTranslation('non') : 'Non')}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = `
        <div class="no-sessions">
          <p>${window.getTranslation ? window.getTranslation('aucune_session') : 'Aucune session trouvée'}</p>
          <p>Commencez par effectuer votre première session d'entraînement !</p>
        </div>
      `;
    }
  } catch (error) {
    const container = document.getElementById('sessions-container');
    container.innerHTML = `
      <div class="error-message">
        <p>${window.getTranslation ? window.getTranslation('erreur_chargement') : 'Erreur lors du chargement de l\'historique'}</p>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// Fonction d'initialisation
function initializeHistory() {
  // Attendre que Firebase soit initialisé et l'utilisateur connecté
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      // Mettre à jour le titre de la page
      const titreElement = document.getElementById('titre_historique');
      if (titreElement) {
        titreElement.textContent = window.getTranslation ? window.getTranslation('titre_historique') : 'Historique';
      }
      loadSessionsHistory();
    } else {
      window.location.href = 'auth.html';
    }
  });
}

// Initialiser l'historique quand le DOM est chargé, après un court délai pour la langue
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initializeHistory, 100);
});