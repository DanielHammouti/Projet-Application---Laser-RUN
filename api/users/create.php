<?php 

include_once '../config/database.php';
include_once '../objects/user.php';

try{
    if(!$database->isAlreadyConnected()){
        $database->getConnection();
    }

    $user = new User($database->conn);

    // Récupération des données POST
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        $data = $_POST;
    }

    if(!isset($data['id']) || !isset($data['nom']) || !isset($data['prenom']) || !isset($data['groupe']) || !isset($data['classe']) || !isset($data['sexe'])){
        throw new Exception("Les données sont invalides");
    }

    $user->setId($data['id']);
    $user->setNom($data['nom']);
    $user->setPrenom($data['prenom']);
    $user->setGroupe($data['groupe']);
    $user->setClasse($data['classe']);
    $user->setSexe($data['sexe']);

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