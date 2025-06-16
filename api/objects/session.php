<?php

class Session{

    private $conn;
    private $table = "Session";

    private $id_session;
    private $dateheure;
    private $id_user;
    
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $sql = "SELECT * FROM \"$this->table\" WHERE id_user = :id_user ORDER BY id_session DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_user', $this->id_user);
        $stmt->execute();
        return $stmt;
    }

    function read_single(){
        $sql = "SELECT * FROM \"$this->table\" WHERE id_user = :id_user AND id_session = :id_session";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_user', $this->id_user);
        $stmt->bindParam(':id_session', $this->id_session);
        $stmt->execute();
        return $stmt;
    }

    function create(){
        try {
            $sql = "INSERT INTO \"$this->table\" (dateheure, id_user) VALUES (:dateheure, :id_user)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':dateheure', $this->dateheure);
            $stmt->bindParam(':id_user', $this->id_user);
            return $stmt->execute();
        } catch(PDOException $e) {
            throw new Exception("Erreur lors de la création de la session: " . $e->getMessage());
        }
    }

    function getLastSession(){
        $sql = "SELECT * FROM \"$this->table\" WHERE id_user = :id_user ORDER BY id_session DESC LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_user', $this->id_user);
        $stmt->execute();
        return $stmt;
    }

    function setIdSession($id_session){
        $this->id_session = $id_session;
    }

    function setDateHeure($dateheure){
        $this->dateheure = $dateheure;
    }
    
    function setIdUser($id_user){
        $this->id_user = $id_user;
    }

    function getIdSession(){
        return $this->id_session;
    }

    function getDateHeure(){
        return $this->dateheure;
    }

    function getIdUser(){
        return $this->id_user;
    }

}