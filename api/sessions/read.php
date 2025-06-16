<?php

include_once '../config/database.php';
include_once '../objects/session.php';
include_once '../objects/user.php';


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try{
    if(!$database->isAlreadyConnected()){
        $database->getConnection();
    }

    $session = new Session($database->conn);

    if(!isset($_GET['id_user'])){
        throw new Exception("L'identifiant de l'utilisateur est requis");
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
                "id_user" => $row['id_user']
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