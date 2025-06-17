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

// Fonction pour calculer le pourcentage de réussite des tirs
function calculateShootingPercentage(six, quatre, deux, nbTirs) {
  if (nbTirs === 0) return 0;
  const totalPoints = (six * 6) + (quatre * 4) + (deux * 2);
  const maxPoints = nbTirs * 6;
  return Math.round((totalPoints / maxPoints) * 100);
}

// Fonction pour calculer la note sur 20
function calculateGrade(six, quatre, deux, nbTirs) {
  if (nbTirs === 0) return 0;
  const totalPoints = (six * 6) + (quatre * 4) + (deux * 2);
  const maxPoints = nbTirs * 6;
  return Math.round((totalPoints / maxPoints) * 20);
}

// Fonction pour créer une carte de session
function createSessionCard(session) {
  const shootingPercentage = calculateShootingPercentage(session.six, session.quatre, session.deux, session.nb_tirs);
  const grade = calculateGrade(session.six, session.quatre, session.deux, session.nb_tirs);
  
  const card = document.createElement('div');
  card.className = 'session-card';
  card.innerHTML = `
    <div class="session-header">
      <div class="session-date">${formatDate(session.dateheure)}</div>
      <div class="session-id">${window.getTranslation ? window.getTranslation('session') : 'Session'} #${session.id_session}</div>
    </div>
    <div class="session-content">
      <div class="session-stats">
        <div class="stat-item">
          <span class="stat-label">${window.getTranslation ? window.getTranslation('tirs_reussis') : 'Tirs réussis:'}</span>
          <span class="stat-value">6 pts: ${session.six} | 4 pts: ${session.quatre} | 2 pts: ${session.deux}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">${window.getTranslation ? window.getTranslation('total_tirs') : 'Total tirs:'}</span>
          <span class="stat-value">${session.nb_tirs}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">${window.getTranslation ? window.getTranslation('pourcentage') : 'Pourcentage:'}</span>
          <span class="stat-value">${shootingPercentage}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">${window.getTranslation ? window.getTranslation('note') : 'Note:'}</span>
          <span class="stat-value">${grade}/20</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">${window.getTranslation ? window.getTranslation('meneur_allure') : 'Meneur d\'allure:'}</span>
          <span class="stat-value">${session.meneur ? (window.getTranslation ? window.getTranslation('oui') : 'Oui') : (window.getTranslation ? window.getTranslation('non') : 'Non')}</span>
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// Fonction pour charger l'historique des sessions
async function loadSessionsHistory() {
  try {
    const response = await fetch(`../../api/sessions/read.php?id_user=${currentUser.uid}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const container = document.getElementById('sessions-container');
    
    if (data.sessions && data.sessions.length > 0) {
      // Trier les sessions par date (plus récentes en premier)
      const sortedSessions = data.sessions.sort((a, b) => 
        new Date(b.dateheure) - new Date(a.dateheure)
      );
      
      sortedSessions.forEach(session => {
        const card = createSessionCard(session);
        container.appendChild(card);
      });
    } else {
      container.innerHTML = `
        <div class="no-sessions">
          <p>${window.getTranslation ? window.getTranslation('aucune_session') : 'Aucune session trouvée'}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique:', error);
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
      console.log('Utilisateur connecté pour l\'historique:', user.email);
      
      // Mettre à jour le titre de la page
      const titreElement = document.getElementById('titre_historique');
      if (titreElement) {
        titreElement.textContent = window.getTranslation ? window.getTranslation('titre_historique') : 'Historique';
      }
      
      loadSessionsHistory();
    } else {
      console.log('Aucun utilisateur connecté');
      window.location.href = 'auth.html';
    }
  });
}

// Initialiser l'historique quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initializeHistory); 