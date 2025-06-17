<?php
    $title = "Note";
    require ('header.php');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des utilisateurs</title>
    <link rel="stylesheet" href="../css/style_admin.css">
</head>
<body>
    <h1>Liste des utilisateurs</h1>
        <div class="ligne-select">
            <div class="text" id="text">Formation</div>
                <select name="formation" id="choix_formation">
                    <option value="all">Toutes les formations</option>
                    <option value="sti">STI</option>
                    <option value="mri">MRI
                </select>
        </div>
        <table border="1" id="tableau-utilisateurs">
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Note</th>
                <th>Date</th>
            </tr>
        </table>

    <script src="/src/js/note.js"></script>

    <script >
            document.addEventListener("DOMContentLoaded", function () {
                fetch("/api/users/read.php")
                    .then(response => response.json())
                    .then(data => {
                        window.utilisateurs = data.users; // Stocker tous les utilisateurs
                        afficherUtilisateurs("all"); // Afficher tous les élèves par défaut
                    })
                    .catch(error => console.error("Erreur de chargement des utilisateurs :", error));

                document.getElementById("choix_formation").addEventListener("change", function () {
                    afficherUtilisateurs(this.value); // Filtrer selon la sélection
                });
            });

            function afficherUtilisateurs(formation) {
                let tableau = document.getElementById("tableau-utilisateurs");

                window.utilisateurs.forEach(user => {
                    if (formation === "all" || user.classe.toLowerCase() === formation.toLowerCase()) {
                        let row = `<tr id="row-${user.id}">
                                    <td>${user.nom}</td>
                                    <td>${user.prenom}</td>
                                    <td id="note-${user.id}"></td>
                                    <td id="date-${user.id}"></td>
                                </tr>`;
                        tableau.innerHTML += row;

                    // Récupérer la session de l'utilisateur et calculer la note
                    fetch(`/api/sessions/read.php?id_user=${user.id}`)
                        .then(response => response.json())
                        .then(sessionData => {
                            if (sessionData.sessions.length > 0) {
                                let session = sessionData.sessions[0]; // Prendre la première session trouvée
                                let noteInfo = getBestNote(user.sexe, session.six, session.nb_tirs); // Calculer la note
                                console.log("Note calculée :", noteInfo);
                                document.getElementById(`note-${user.id}`).innerText = noteInfo.total;
                                document.getElementById(`date-${user.id}`).innerText = session.dateheure;
                            } else {
                                document.getElementById(`note-${user.id}`).innerText = "Pas de note";
                            }
                        })
                        .catch(error => {
                            console.error(`Erreur de chargement de la session pour ${user.nom} :`, error);
                            document.getElementById(`note-${user.id}`).innerText = "Erreur";
                        });
                });
            }

</script>
</body>
</html>
