<?php
session_start();
$message = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Connexion à la base de données
    $conn = new mysqli("localhost", "root", "", "ma_bdd");
    if ($conn->connect_error) {
        die("Erreur de connexion: " . $conn->connect_error);
    }

    $username = $conn->real_escape_string($_POST['username']);
    $password = $_POST['password'];

    // Vérification de l'utilisateur
    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows == 1) {
        $user = $result->fetch_assoc();
        // Vérification du mot de passe (suppose que le mot de passe est hashé)
        if (password_verify($password, $user['password'])) {
            $_SESSION['username'] = $username;
            header("Location: dashboard.php"); // Redirige vers une page protégée
            exit();
        } else {
            $message = "Mot de passe incorrect.";
        }
    } else {
        $message = "Nom d'utilisateur incorrect.";
    }
    $conn->close();
}
?>