<?php

/*
 * Middleware de vérification de la clé API.
 * À inclure dans les points d'API nécessitant une authentification.
 * Appel : verifyApiKey($conn, $expectedUserId);
 */

if (!function_exists('verifyApiKey')) {
    function verifyApiKey(PDO $conn, ?string $expectedUserId = null): bool
    {
        // Le cookie doit être présent
        if (!isset($_COOKIE['api_key']) || empty($_COOKIE['api_key'])) {
            return false;
        }

        $apiKey = $_COOKIE['api_key'];

        // Vérifier que la clé existe dans la base
        $sql  = 'SELECT id_user FROM "User" WHERE api_key = :api_key';
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':api_key', $apiKey);

        try {
            $stmt->execute();
        } catch (PDOException $e) {
            return false;
        }

        if ($stmt->rowCount() === 0) {
            return false;
        }

        // Récupérer l'utilisateur associé
        $row      = $stmt->fetch(PDO::FETCH_ASSOC);
        $userIdDb = $row['id_user'];

        // Si un id utilisateur spécifique est attendu, vérifier la correspondance
        if ($expectedUserId !== null && $userIdDb !== $expectedUserId) {
            return false;
        }
        // Succès : on ne retourne rien, le script peut continuer
        return true;
    }
}
?> 