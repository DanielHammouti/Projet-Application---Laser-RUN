<?php 

include_once '../config/database.php';
include_once '../objects/user.php';

// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

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

    // Récupération des données POST
    $data = $_POST;
    
    if(!isset($data['id']) || !isset($data['nom']) || !isset($data['prenom']) || !isset($data['classe']) || !isset($data['sexe'])){
        throw new Exception("Les données sont invalides");
    }

    $user->setId($data['id']);
    $user->setNom($data['nom']);
    $user->setPrenom($data['prenom']);
    $user->setClasse($data['classe']);
    $user->setSexe($data['sexe']);

    // Génération d'une clé API unique pour l'utilisateur
    $user->generateApiKey();

    if($user->create()){
        // Stockage de la clé API dans un cookie sécurisé et HTTP-Only (expiration 30 jours)
        setcookie(
            'api_key',
            $user->getApiKey(),
            [
                'expires'  => time() + 60 * 60 * 24, // 1 jour
                'path'     => '/',
                'secure'   => true,   // transmis uniquement via HTTPS
                'httponly' => true,   // inaccessible via JavaScript
                'samesite' => 'Lax'
            ]
        );

        http_response_code(201);
        echo json_encode(array(
            "message" => "Utilisateur créé avec succès",
            "api_key" => $user->getApiKey()
        ));
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