// langues.js

const translations = {
  fr: {
    titre_param: "Paramètres",
    titre_stat : "Statistiques",
    titre_historique: "Historique",
    statistiques: "Statistiques",
    sexe_type: "Sexe",
    homme: "Homme",
    femme: "Femme",
    meneur: "Meneur d'allure ",
    course: "Course",
    valider: "Valider",
    langue: "Langue",
    temps_total: "Temps Total",
    debut: "DEBUT",
    temps_tour: "Temps du tour",
    fin: "FIN",
    resultat_tir: "Résultat tirs",
    resultat_note: "Vous avez obtenu <br> la note de 16/20",
    date: "11 Juin 2025<br />15 : 30",
    note_resultat: "Vous avez obtenu <br> la note de <br> 16 / 20",
    tir_resultat: "Résultat tirs XX%",
    total_temps: "Temps Total",
    temps_tir: "Temps pour tirer",
    tir: "Tir n°",
    temps_moyen: "Temps moyen au 100m",
    courbe: "Courbe",
    bouton_fin : "Marquer - Confirmer fin de course",
    tirs_reussis: "Tirs réussis:",
    total_tirs: "Total tirs:",
    pourcentage: "Pourcentage:",
    note: "Note:",
    meneur_allure: "Meneur d'allure:",
    oui: "Oui",
    non: "Non",
    aucune_session: "Aucune session trouvée",
    erreur_chargement: "Erreur lors du chargement de l'historique",
    session: "Session",
    tirs: "tirs",
    temps_600m: "Temps 600m:",
    temps_400m: "Temps 400m:",
    temps_200m: "Temps 200m:",
    deconnexion : "Déconnexion",
    title_settings: "Paramètres",
    title_statistic: "Statistiques",
    title_history: "Historique",
    title_home: "Accueil",
    title_run: "Course",
    title_shots: "Tirs",
    title_mark: "Note",
    title_auth: "Authentification",
    // Clés pour les graphiques
    evolution_time_title: "Évolution du temps",
    time_distance_prefix: "Temps",
    evolution_shots_title: "Évolution des tirs réussis",
    time_axis: "Temps (s)",
    shots_axis: "Nombre de tirs réussis",
    avg_speed_label: "Vitesse moyenne (km/h)",
    avg_speed_graph_title: "Vitesse moyenne en fonction du temps (km/h)",
    speed_axis: "Vitesse (km/h)",
    cumulative_time_axis: "Temps cumulé (s)",
    tirs_reussis_graph: "Tirs réussis",
    with_pacer: "(avec meneur)"
  },
  en: {
    titre_param: "Settings",
    titre_stat : "Statistics",
    titre_historique: "History",
    statistiques: "Statistics",
    sexe_type: "Gender",
    homme: "Male",
    femme: "Female",
    meneur: "Pace Setter",
    course: "Race",
    valider: "Submit",
    langue: "Language",
    temps_total: "Total Time",
    debut: "START",
    temps_tour: "Lap time",
    fin: "END",
    resultat_tir: "Shooting results",
    resultat_note: "You got <br> a score of 16/20",
    date: "June 11, 2025<br />3:30 PM",
    note_resultat: "You got <br> a score of <br> 16 / 20",
    tir_resultat: "Shooting result XX%",
    total_temps: "Total Time",
    temps_tir: "Shooting time",
    tir: "Shot #",
    temps_moyen: "Average time per 100m",
    courbe: "Curve",
    bouton_fin :"Mark - Confirm end of race",
    tirs_reussis: "Successful shots:",
    total_tirs: "Total shots:",
    pourcentage: "Percentage:",
    note: "Grade:",
    meneur_allure: "Pace setter:",
    oui: "Yes",
    non: "No",
    aucune_session: "No session found",
    erreur_chargement: "Error loading history",
    session: "Session",
    tirs: "shots",
    temps_600m: "600m time:",
    temps_400m: "400m time:",
    temps_200m: "200m time:",
    deconnexion: "Logout",
    title_settings: "Settings",
    title_statistic: "Statistics",
    title_history: "History",
    title_home: "Home",
    title_run: "Run",
    title_shots: "Shots",
    title_mark: "Mark",
    title_auth: "Authentication",
    // Keys for charts
    evolution_time_title: "Evolution of time",
    time_distance_prefix: "Time",
    evolution_shots_title: "Evolution of successful shots",
    time_axis: "Time (s)",
    shots_axis: "Number of successful shots",
    avg_speed_label: "Average speed (km/h)",
    avg_speed_graph_title: "Average speed over time (km/h)",
    speed_axis: "Speed (km/h)",
    cumulative_time_axis: "Cumulative time (s)",
    tirs_reussis_graph: "Successful shots",
    with_pacer: "(with pacer)"
  }
};

const userLang = navigator.language || navigator.userLanguage;
const langCode = userLang.split('-')[0];
const supportedLangs = ["fr", "en"];
// Charger la langue depuis le localStorage ou utiliser la langue par défaut
window.currentLang = localStorage.getItem('selectedLanguage') || (supportedLangs.includes(langCode) ? langCode : "en");

window.getTranslation = function(key) {
  if (!translations[window.currentLang]) return key;
  return translations[window.currentLang][key] || key;
};

function setLanguage(lang) {
  if (!supportedLangs.includes(lang)) return;
  window.currentLang = lang;
  // Sauvegarder la langue dans le localStorage
  localStorage.setItem('selectedLanguage', lang);

  const t = translations[lang];
  const ids = {
    titre_param: "titre_param",
    titre_stat : "titre_stat",
    sexe_type: "sexe_type",
    homme: "homme",
    femme: "femme",
    meneur: "meneur_label",
    course: "course_label",
    valider: "bouton_valide",
    langue: "langue_label",
    temps_total: "temps_total",
    debut: "debut",
    temps_tour: "Temps_tour",
    fin: "fin",
    resultat_tir: "resultat_tir",
    resultat_note: "resultat_note",
    date: "date",
    note_resultat: "note_resultat",
    tir_resultat: "tir_resultat",
    total_temps: "total_temps",
    temps_tir: "temps_tir",
    tir: "tir",
    temps_moyen: "temps_moyen",
    courbe: "courbe",
    bouton_fin: "bouton_fin",
    deconnexion: "bouton_deconnexion",
    titre_historique: "titre_historique"
  };

  for (const key in ids) {
    const el = document.getElementById(ids[key]);
    if (el) el.innerHTML = t[key];
  }

  updatePageTitle(t);

  // Notifier les autres scripts du changement de langue
  document.dispatchEvent(new Event('languageChanged'));
}

window.setLanguage = setLanguage;

// Applique la langue automatiquement au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
  setLanguage(window.currentLang);
});

// AJOUT : fonction utilitaire pour mettre à jour le titre selon la page courante
function updatePageTitle(t) {
  const page = window.location.pathname.split('/').pop();
  const map = {
    'settings_page.html': 'title_settings',
    'statistic_page.html': 'title_statistic',
    'history_page.html': 'title_history',
    'index.html': 'title_home',
    'run_page.html': 'title_run',
    'shots_page.html': 'title_shots',
    'mark_page.html': 'title_mark',
    'auth.html': 'title_auth'
  };
  const key = map[page];
  if (key && t[key]) {
    document.title = `${t[key]} - LaserTrack`;
  }
}
