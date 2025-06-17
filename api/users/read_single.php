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
    if(!isset($_GET['id'])){
        throw new Exception("L'identifiant de l'utilisateur est requis");
    }
    $user->setId($_GET['id']);

    $stmt = $user->read_single();
    $num = $stmt->rowCount();
    
    if($num > 0){
        $user_arr = array();
        $user_arr["user"] = array();

        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $user_item = array(
                "id" => $row['id_user'],
                "nom" => $row['nom'],
                "prenom" => $row['prenom'],
                "classe" => $row['classe'],
                "sexe" => $row['sexe']
            );
            array_push($user_arr["user"], $user_item);
        }

        http_response_code(200);
        echo json_encode($user_arr);
    }else{
        http_response_code(404);
        echo json_encode(array("message" => "Aucun utilisateur trouvé"));
    }
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(array(
        "message" => "Erreur lors de la lecture de l'utilisateur",
        "error" => $e->getMessage()
    ));
}

?>