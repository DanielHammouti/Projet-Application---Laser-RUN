<?php

include_once '../config/database.php';
include_once '../objects/session.php';
include_once '../objects/user.php';
include_once '../verify_api_key.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try{
    if(!$database->isAlreadyConnected()){
        $database->getConnection();
    }

    $session = new Session($database->conn);

    if(!isset($_GET['id_user'])){
        throw new Exception("L'identifiant de l'utilisateur est requis");
    }

    // Vérification de l'API key (doit correspondre à l'utilisateur demandé)
    if(isset($_GET['id_user'])){
        $verify = verifyApiKey($database->conn, $_GET['id_user']);
    }
    else{
        throw new Exception("L'identifiant de l'utilisateur est requis");
    }
    
    if(!$verify){
        http_response_code(401);
        echo json_encode(array("message" => "invalid api key"));
        return;
    }

    $session->setIdUser($_GET['id_user']);
    $stmt = $session->read();
    $num = $stmt->rowCount();

    if($num > 0){
        $session_arr = array();
        $session_arr["sessions"] = array();

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
            array_push($session_arr["sessions"], $session_item);
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
        "message" => "Erreur lors de la lecture des sessions",
        "error" => $e->getMessage()
    ));
}

?>