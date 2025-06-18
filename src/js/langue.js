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
    deconnexion: "Se déconnecter",
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
    temps_200m: "Temps 200m:"
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
    deconnexion: "Sign out",
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
    temps_200m: "200m time:"
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
    deconnexion: "deconnexion_button",
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
    bouton_fin: "bouton_fin"
  };

  for (const key in ids) {
    const el = document.getElementById(ids[key]);
    if (el) el.innerHTML = t[key];
  }
}

window.setLanguage = setLanguage;

// Applique la langue automatiquement au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
  setLanguage(window.currentLang);
});
