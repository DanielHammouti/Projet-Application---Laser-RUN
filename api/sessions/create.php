<?php

include_once '../config/database.php';
include_once '../objects/session.php';
include_once '../objects/user.php';
include_once '../verify_api_key.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

try {
    if(!$database->isAlreadyConnected()){
        $database->getConnection();
    }

    $session = new Session($database->conn);

    if(!isset($_GET['id_user']) || !isset($_GET['six']) || !isset($_GET['quatre']) || !isset($_GET['deux']) || !isset($_GET['nb_tirs']) || !isset($_GET['meneur'])){
        throw new Exception("L'identifiant de l'utilisateur est requis");
    }

    // Vérifier si l'utilisateur existe
    $user = new User($database->conn);
    $user->setId($_GET['id_user']);
    $stmt = $user->read_single();
    if($stmt->rowCount() == 0) {
        throw new Exception("L'utilisateur n'existe pas");
    }

    // Vérification de la clé API : doit correspondre à l'utilisateur déclaré dans la requête
    if(isset($_GET['id_user'])){
        $verify = verifyApiKey($database->conn, $_GET['id_user']);
    } else {
        throw new Exception("L'identifiant de l'utilisateur est requis");
    }

    if(!$verify){
        http_response_code(401);
        echo json_encode(array("message" => "invalid api key"));
        return;
    }

    $session->setIdUser($_GET['id_user']);
    $session->setDateHeure(date('Y-m-d H:i:s'));
    $session->setSix($_GET['six']);
    $session->setQuatre($_GET['quatre']);
    $session->setDeux($_GET['deux']);
    $session->setNbTirs($_GET['nb_tirs']);
    $session->setMeneur($_GET['meneur']);

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