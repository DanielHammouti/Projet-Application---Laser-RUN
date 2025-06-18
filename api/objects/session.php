<?php

class Session{

    private $conn;
    private $table = "Session";

    private $id_session;
    private $six;
    private $quatre;
    private $deux;
    private $nb_tirs;
    private $meneur;
    private $dateheure;
    private $id_user;
    
    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        try {
            $sql = "SELECT * FROM \"$this->table\" WHERE id_user = :id_user ORDER BY id_session DESC";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':id_user', $this->id_user);
            $stmt->execute();
            return $stmt;
        } catch(PDOException $e) {
            throw new Exception("Erreur lors de la lecture des sessions: " . $e->getMessage());
        }
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
        $sql = "INSERT INTO \"$this->table\" (six, quatre, deux, nb_tirs, meneur, dateheure, id_user) VALUES (:six, :quatre, :deux, :nb_tirs, :meneur, :dateheure, :id_user)";
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindParam(':six', $this->six);
        $stmt->bindParam(':quatre', $this->quatre);
        $stmt->bindParam(':deux', $this->deux);
        $stmt->bindParam(':nb_tirs', $this->nb_tirs);
        $stmt->bindParam(':meneur', $this->meneur);
        $stmt->bindParam(':dateheure', $this->dateheure);
        $stmt->bindParam(':id_user', $this->id_user);
        
        return $stmt->execute();
    }

    function getLastSession(){
        $sql = "SELECT * FROM \"$this->table\" WHERE id_user = :id_user ORDER BY id_session DESC LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_user', $this->id_user);
        $stmt->execute();
        return $stmt;
    }

    function setDateHeure($dateheure){
        $this->dateheure = $dateheure;
    }
    
    function setIdUser($id_user){
        $this->id_user = $id_user;
    }

    function setSix($six){
        $this->six = $six;
    }

    function setQuatre($quatre){
        $this->quatre = $quatre;
    }

    function setDeux($deux){
        $this->deux = $deux;
    }

    function setNbTirs($nb_tirs){
        $this->nb_tirs = $nb_tirs;
    }

    function setMeneur($meneur){
        $this->meneur = $meneur;
    }

    function setIdSession($id_session){
        $this->id_session = $id_session;
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

    function getSix(){
        return $this->six;
    }

    function getQuatre(){
        return $this->quatre;
    }
    
    function getDeux(){
        return $this->deux;
    }

    function getNbTirs(){
        return $this->nb_tirs;
    }
    
    function getMeneur(){
        return $this->meneur;
    }
}