<?php 
$title = "Note";
require('header.php');
session_start();

$database = new Database();
$db = $database->getConnection();

$user = new User($db);
$stmt = $user->read();
?>

    <style>
        table {
            border-collapse: collapse;
            width: 80%;
            margin: 40px auto;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: center;
        }
        th {
            background-color: #608969;
            color: white;
        }
    </style>

<h1 style="text-align:center; color:#608969;">Liste des Utilisateurs</h1>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Classe</th>
            <th>Sexe</th>
        </tr>
    </thead>
    <tbody>
        <?php while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) : ?>
            <tr>
                <td><?= htmlspecialchars($row['id_user']) ?></td>
                <td><?= htmlspecialchars($row['nom']) ?></td>
                <td><?= htmlspecialchars($row['prenom']) ?></td>
                <td><?= htmlspecialchars($row['classe']) ?></td>
                <td><?= htmlspecialchars($row['sexe']) ?></td>
            </tr>
        <?php endwhile; ?>
    </tbody>
</table>
