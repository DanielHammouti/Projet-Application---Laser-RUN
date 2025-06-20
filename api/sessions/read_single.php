<?php

include_once '../config/database.php';
include_once '../objects/session.php';
include_once '../verify_api_key.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

try{
    if(!$database->isAlreadyConnected()){
        $database->getConnection();
    }

    $session = new Session($database->conn);
    if(!isset($_GET['id_user']) || !isset($_GET['id_session'])){
        throw new Exception("L'identifiant de l'utilisateur et de la session sont requis");
    }

    $session->setIdUser($_GET['id_user']);
    $session->setIdSession($_GET['id_session']);

    if(isset($_GET['id_user'])){
        $verify = verifyApiKey($database->conn, $_GET['id_user']);
    } else {
        $verify = verifyApiKey($database->conn, null);
    }

    if(!$verify){
        http_response_code(401);
        echo json_encode(array("message" => "Clé API invalide"));
        return;
    }

    $stmt = $session->read_single();
    $num = $stmt->rowCount();
    
    if($num > 0){
        $session_arr = array();
        $session_arr["session"] = array();

        while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $session_item = array(
                "id_session" => $row['id_session'],
                "dateheure" => $row['dateheure'],
                "id_user" => $row['id_user'],
                "six" => $row['six'],
                "quatre" => $row['quatre'],
                "deux" => $row['deux'],
                "nb_tirs" => $row['nb_tirs'],
                "meneur" => $row['meneur']
            );
            array_push($session_arr["session"], $session_item);
        }

        http_response_code(200);
        echo json_encode($session_arr);
    }else{
        http_response_code(404);
        echo json_encode(array("message" => "Aucune session trouvée"));
    }
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(array(
        "message" => "Erreur lors de la lecture de la session",
        "error" => $e->getMessage()
    ));
}

?>