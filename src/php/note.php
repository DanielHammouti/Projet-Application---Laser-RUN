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
        </tr>
    </table>

    <script >
            document.addEventListener("DOMContentLoaded", function () {
            fetch("../api/user/read.php")
                .then(response => response.json())
                .then(data => {
                    afficherUtilisateurs(data.users);
                })
                .catch(error => console.error("Erreur de chargement :", error));
        });

        function afficherUtilisateurs(users) {
            let tableau = document.getElementById("tableau-utilisateurs");

            users.forEach(user => {
                let row = `<tr>
                            <td>${user.nom}</td>
                            <td>${user.prenom}</td>
                        </tr>`;
                tableau.innerHTML += row;
            });
        }
</script>
</body>
</html>
