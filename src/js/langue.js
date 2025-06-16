const translations = {
  fr: {
    titre_param: "Paramètres",
    sexe_type: "Sexe",
    homme: "Homme",
    femme: "Femme",
    meneur: "Meneur d'allure ",
    course: "Course",
    valider: "Valider",
    langue: "Langue",
    temps_total: "Temps Total<br />00 : 00",
    debut: "DEBUT",
    temps_tour: "temps du tour",
    fin: "FIN",
    resultat_tir: "Résultat tirs",
    resultat_note: "Vous avez obtenu <br> la note de 16/20",
    date: "11 Juin 2025<br />15 : 30",
    note_resultat: "Vous avez obtenu <br> la note de <br> 16 / 20",
    tir_resultat: "Résultat tirs XX%",
    total_temps: "Temps Total<br />00 : 00 : 00",
    temps_tir: "Temps pour tirer<br />00 : 00",
    tir: "Tir n°",
    temps_moyen: "Temps moyen au 100m",
    courbe: "Courbe"
  },
  en: {
    titre_param: "Settings",
    sexe_type: "Gender",
    homme: "Male",
    femme: "Female",
    meneur: "Pace Setter",
    course: "Race",
    valider: "Submit",
    langue: "Language",
    temps_total: "Total Time<br />00 : 00",
    debut: "START",
    temps_tour: "Lap time",
    fin: "END",
    resultat_tir: "Shooting results",
    resultat_note: "You got <br> a score of 16/20",
    date: "June 11, 2025<br />3:30 PM",
    note_resultat: "You got <br> a score of <br> 16 / 20",
    tir_resultat: "Shooting result XX%",
    total_temps: "Total Time<br />00 : 00 : 00",
    temps_tir: "Shooting time<br />00 : 00",
    tir: "Shot #",
    temps_moyen: "Average time per 100m",
    courbe: "Curve"
  }
};

function setLanguage(lang) {
  if (!translations[lang]) return;
  const t = translations[lang];

  const ids = {
    titre_param: "titre_param",
    sexe_type: "sexe_type",
    homme: "homme",
    femme: "femme",
    meneur: "meneur_label",
    course: "course_label",
    valider: "bouton_valide",
    langue: "langue_label",
    temps_total: "temps_total",
    debut: "debut",
    temps_tour: "temps_tour",
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
    courbe: "courbe"
  };

  for (const key in ids) {
    const element = document.getElementById(ids[key]);
    if (element) element.innerHTML = t[key];
  }
}

function changerLangue() {
  const selectedLang = document.getElementById("langue").value;
  setLanguage(selectedLang);
}

window.onload = function () {
  setLanguage("fr");
  const bouton = document.getElementById("bouton_valide");
  if (bouton) {
    bouton.addEventListener("click", changerLangue);
  }
};
