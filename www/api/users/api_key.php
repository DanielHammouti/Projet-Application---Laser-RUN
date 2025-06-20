<?php

include_once '../config/database.php';
include_once '../objects/user.php';

// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Gestion des requêtes OPTIONS (pre-flight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try{
    if(!$database->isAlreadyConnected()){
        $database->getConnection();
    }

    $user = new User($database->conn);

    // Récupération des données (GET ou POST)
    $data = $_SERVER['REQUEST_METHOD'] === 'POST' ? $_POST : $_GET;

    if(!isset($data['id'])){
        throw new Exception("L'identifiant de l'utilisateur est requis");
    }

    $user->setId($data['id']);

    $stmt = $user->read_single();
    if($stmt->rowCount() === 0){
        http_response_code(404);
        echo json_encode(array("message" => "Utilisateur introuvable"));
        exit();
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $api_key = $row['api_key'];

    // Définition du cookie sécurisé HTTP-Only (30 jours)
    setcookie(
        'api_key',
        $api_key,
        [
            'expires'  => time() + 60 * 60 * 24,
            'path'     => '/',
            'secure'   => true,
            'httponly' => true,
            'samesite' => 'Strict'
        ]
    );

    http_response_code(200);
    echo json_encode(array("api_key" => $api_key));

}catch(Exception $e){
    http_response_code(500);
    echo json_encode(array(
        "message" => "Erreur lors de la récupération de la clé API",
        "error" => $e->getMessage()
    ));
}

?> 