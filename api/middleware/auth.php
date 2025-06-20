<?php

/*
 * Middleware pour vérifier qu'un cookie "api_key" existe et qu'il correspond bien à l'utilisateur fourni.
 * À utiliser dans chaque endpoint qui nécessite une authentification.
 */
function verifyApiKey(PDO $conn, string $id_user): void
{
    if (!isset($_COOKIE['api_key'])) {
        http_response_code(401);
        echo json_encode(["message" => "Accès refusé : cookie api_key manquant"]);
        exit();
    }
    $api_key = $_COOKIE['api_key'];

    $sql = "SELECT 1 FROM \"User\" WHERE id_user = :id_user AND api_key = :api_key LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id_user', $id_user);
    $stmt->bindParam(':api_key', $api_key);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(["message" => "Accès refusé : clé API invalide ou non associée à l'utilisateur"]);
        exit();
    }
}

?> 