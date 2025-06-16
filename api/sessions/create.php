<?php

include_once '../config/database.php';
include_once '../objects/session.php';
include_once '../objects/user.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    if(!$database->isAlreadyConnected()){
        $database->getConnection();
    }

    $session = new Session($database->conn);

    if(!isset($_GET['id_user'])){
        throw new Exception("L'identifiant de l'utilisateur est requis");
    }

    // Vérifier si l'utilisateur existe
    $user = new User($database->conn);
    $user->setId($_GET['id_user']);
    $stmt = $user->read_single();
    if($stmt->rowCount() == 0) {
        throw new Exception("L'utilisateur n'existe pas");
    }

    $session->setIdUser($_GET['id_user']);
    $session->setDateHeure(date('Y-m-d H:i:s'));

    if($session->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Session créée avec succès"));
    } else {
        throw new Exception("Erreur lors de la création de la session");
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Erreur lors de la création de la session",
        "error" => $e->getMessage()
    ));
}
?>