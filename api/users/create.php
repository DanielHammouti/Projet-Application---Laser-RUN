<?php 

include_once '../config/database.php';
include_once '../objects/user.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try{
    if(!$database->isAlreadyConnected()){
        $database->getConnection();
    }

    $user = new User($database->conn);

    if(!isset($_GET['id']) || !isset($_GET['nom']) || !isset($_GET['prenom']) || !isset($_GET['groupe']) || !isset($_GET['classe']) || !isset($_GET['sexe'])){
        throw new Exception("Les données sont invalides");
    }

    $user->setId($_GET['id']);
    $user->setNom($_GET['nom']);
    $user->setPrenom($_GET['prenom']);
    $user->setGroupe($_GET['groupe']);
    $user->setClasse($_GET['classe']);
    $user->setSexe($_GET['sexe']);

    if($user->create()){
        http_response_code(201);
        echo json_encode(array("message" => "Utilisateur créé avec succès"));
    }else{
        http_response_code(503);
        echo json_encode(array("message" => "Erreur lors de la création de l'utilisateur"));
    }
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(array(
        "message" => "Erreur lors de la création de l'utilisateur",
        "error" => $e->getMessage()
    ));
}

?>