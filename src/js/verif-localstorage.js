// Vérifie si la clé "dateheure" du localStorage date de plus de 2 heures.
// Si c'est le cas, supprime "userId" et "dateheure".
document.addEventListener('DOMContentLoaded', () => {
  const dateHeureStr = localStorage.getItem('dateheure');
  if (!dateHeureStr) return; // Rien à faire si la clé n'existe pas.

  const dateHeure = new Date(dateHeureStr);
  if (isNaN(dateHeure.getTime())) {
    // Valeur invalide : on nettoie les données et on sort.
    localStorage.removeItem('userId');
    localStorage.removeItem('dateheure');
    return;
  }
  
  //const deuxHeuresEnMs = 2 * 60 * 60 * 1000; // 2 heures en millisecondes
  const deuxHeuresEnMs = 60 * 1000; // 1 minute en millisecondes
  const maintenant = Date.now();

  if ((maintenant - dateHeure.getTime()) > deuxHeuresEnMs) {
    console.log('Session expirée – suppression des données locales.');
    localStorage.removeItem('userId');
    localStorage.removeItem('dateheure');
  }
});
