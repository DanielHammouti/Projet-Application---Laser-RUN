<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des utilisateurs</title>
</head>
<body>
    <h1>Liste des utilisateurs</h1>
        <table border="1" id="tableau-utilisateurs">
            <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Note</th>
            </tr>
        </table>

    <script src="/src/js/note.js"></script>

    <script >
            document.addEventListener("DOMContentLoaded", function () {
                fetch("/api/users/read.php")
                    .then(response => response.json())
                    .then(data => {
                        afficherUtilisateurs(data.users);
                    })
                    .catch(error => console.error("Erreur de chargement des utilisateurs :", error));
            });

            function afficherUtilisateurs(users) {
                let tableau = document.getElementById("tableau-utilisateurs");

                users.forEach(user => {
                    let row = `<tr id="row-${user.id}">
                                <td>${user.nom}</td>
                                <td>${user.prenom}</td>
                                <td id="note-${user.id}">Chargement...</td>
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
