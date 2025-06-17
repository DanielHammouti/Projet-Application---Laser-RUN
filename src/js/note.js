function getTirNote(pourcentage, dominante) {
  // dominante : "mixte", "tir", "course"
  // pourcentage : entre 0 et 1
  let index = 0;
  if (dominante.toLowerCase() === "tir") index = 2;
  else if (dominante.toLowerCase() === "course") index = 1;

  if (pourcentage >= 0.9)      return [6, 5.4, 7][index];
  else if (pourcentage >= 0.8) return [5, 4.5, 5.5][index];
  else if (pourcentage >= 0.7) return [4, 3.6, 4.4][index];
  else if (pourcentage >= 0.6) return [3, 2.7, 3.3][index];
  else if (pourcentage >= 0.5) return [2, 1.8, 2.2][index];
  else if (pourcentage >= 0.4) return [1, 0.9, 1.1][index];
  else                         return 0;
}

function getNote(sexe, tempsSec, nb_tirs, dominante) {
    // Définir les barèmes course (seuils en secondes)
    const courseBaremeGarcon = [
      { max: 255, notes: [6, 5, 6.6] },     // 4mn15
      { max: 262, notes: [5.4, 4.32, 5.94] },
      { max: 270, notes: [4.8, 3.84, 5.28] },
      { max: 277, notes: [4.2, 3.36, 4.62] },
      { max: 285, notes: [3.6, 2.88, 3.96] },
      { max: 300, notes: [3, 2.4, 3.3] },
      { max: 315, notes: [2.4, 1.92, 2.64] },
      { max: 330, notes: [1.8, 1.44, 1.98] },
      { max: 345, notes: [1.2, 0.96, 1.32] },
      { max: 360, notes: [0.6, 0.48, 0.66] },
      { max: Infinity, notes: [0, 0, 0] }
    ];
  
    const courseBaremeFille = [
      { max: 310, notes: [6, 4.8, 6.6] },     // 5mn10
      { max: 335, notes: [5.4, 4.32, 5.94] },
      { max: 360, notes: [4.8, 3.84, 5.28] },
      { max: 370, notes: [4.2, 3.36, 4.62] },
      { max: 380, notes: [3.6, 2.88, 3.96] },
      { max: 390, notes: [3, 2.4, 3.3] },
      { max: 405, notes: [2.4, 1.92, 2.64] },
      { max: 420, notes: [1.8, 1.44, 1.98] },
      { max: 435, notes: [1.2, 0.96, 1.32] },
      { max: 450, notes: [0.6, 0.48, 0.66] },
      { max: Infinity, notes: [0, 0, 0] }
    ];
  
    const dominanteToIndex = {
      "mixte": 0,
      "tir": 1,
      "course": 2
    };
  
    const index = dominanteToIndex[dominante.toLowerCase()] ?? 0;
  
    const courseTable = (sexe.toLowerCase() === "fille") ? courseBaremeFille : courseBaremeGarcon;
  
    const courseNote = courseTable.find(e => tempsSec <= e.max)?.notes[index] ?? 0;

    // Calcul du pourcentage de tirs réussis sur 15
    const pourcentageTirs = Math.max(0, Math.min(1, nb_tirs / 15));
    const tirNote = getTirNote(pourcentageTirs, dominante);
  
    const total = courseNote + tirNote;
    return {
      courseNote,
      tirNote,
      total
    };
}

function getBestNote(sexe, tempsSec, nb_tirs) {
    // Définir les barèmes course (seuils en secondes)
    const courseBaremeGarcon = [
      { max: 255, notes: [6, 5, 6.6] },     // 4mn15
      { max: 262, notes: [5.4, 4.32, 5.94] },
      { max: 270, notes: [4.8, 3.84, 5.28] },
      { max: 277, notes: [4.2, 3.36, 4.62] },
      { max: 285, notes: [3.6, 2.88, 3.96] },
      { max: 300, notes: [3, 2.4, 3.3] },
      { max: 315, notes: [2.4, 1.92, 2.64] },
      { max: 330, notes: [1.8, 1.44, 1.98] },
      { max: 345, notes: [1.2, 0.96, 1.32] },
      { max: 360, notes: [0.6, 0.48, 0.66] },
      { max: Infinity, notes: [0, 0, 0] }
    ];
  
    const courseBaremeFille = [
      { max: 310, notes: [6, 4.8, 6.6] },     // 5mn10
      { max: 335, notes: [5.4, 4.32, 5.94] },
      { max: 360, notes: [4.8, 3.84, 5.28] },
      { max: 370, notes: [4.2, 3.36, 4.62] },
      { max: 380, notes: [3.6, 2.88, 3.96] },
      { max: 390, notes: [3, 2.4, 3.3] },
      { max: 405, notes: [2.4, 1.92, 2.64] },
      { max: 420, notes: [1.8, 1.44, 1.98] },
      { max: 435, notes: [1.2, 0.96, 1.32] },
      { max: 450, notes: [0.6, 0.48, 0.66] },
      { max: Infinity, notes: [0, 0, 0] }
    ];

    const courseTable = (sexe.toLowerCase() === "fille") ? courseBaremeFille : courseBaremeGarcon;
    
    // Calcul du pourcentage de tirs réussis sur 15
    const pourcentageTirs = Math.max(0, Math.min(1, nb_tirs / 15));
    
    // Tester les 3 répartitions possibles
    const repartitions = [
        { nom: "mixte", index: 0, label: "50% Course / 50% Tirs" },
        { nom: "tir", index: 1, label: "40% Course / 60% Tirs" },
        { nom: "course", index: 2, label: "60% Course / 40% Tirs" }
    ];
    
    let meilleureNote = 0;
    let meilleureRepartition = null;
    let courseNote = 0;
    let tirNote = 0;
    
    repartitions.forEach(repartition => {
        // Note de course pour cette répartition
        const courseNoteTemp = courseTable.find(e => tempsSec <= e.max)?.notes[repartition.index] ?? 0;
        
        // Note de tir pour cette répartition
        const tirNoteTemp = getTirNote(pourcentageTirs, repartition.nom);
        
        const totalTemp = courseNoteTemp + tirNoteTemp;
        
        if (totalTemp > meilleureNote) {
            meilleureNote = totalTemp;
            meilleureRepartition = repartition;
            courseNote = courseNoteTemp;
            tirNote = tirNoteTemp;
        }
    });
    
    return {
        courseNote: courseNote,
        tirNote: tirNote,
        total: Math.round(meilleureNote * 10) / 10,
        repartition: meilleureRepartition.label,
        dominante: meilleureRepartition.nom
    };
}
  