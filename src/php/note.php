<?php
// Récupérer les données JSON de read.php
$url = "http://tonsite.com/read.php"; // Mets l'URL correcte ici
$response = file_get_contents($url);
$data = json_decode($response, true);

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des utilisateurs</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <h1>Liste des utilisateurs</h1>

    <?php
    if (!empty($data["users"])) {
        echo "<table border='1'>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Classe</th>
                    <th>Sexe</th>
                </tr>";

        foreach ($data["users"] as $user) {
            echo "<tr>
                    <td>{$user['id']}</td>
                    <td>{$user['nom']}</td>
                    <td>{$user['prenom']}</td>
                    <td>{$user['classe']}</td>
                    <td>{$user['sexe']}</td>
                  </tr>";
        }

        echo "</table>";
    } else {
        echo "<p>Aucun utilisateur trouvé.</p>";
    }
    ?>
</body>
</html>
