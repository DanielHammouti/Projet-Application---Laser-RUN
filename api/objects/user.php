<?php

class User{

    private $conn;
    private $table = "User";


    private $id;
    private $nom;
    private $prenom;
    private $groupe;
    private $classe;
    private $sexe;

    public function __construct($db){
        $this->conn = $db;
    }

    function read(){
        $sql = "SELECT * FROM \"$this->table\" ORDER BY id_user DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        return $stmt;
    }

    function read_single(){
        $sql = "SELECT * FROM \"$this->table\" WHERE id_user = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();
        return $stmt;
    }

    function create(){
        if($this->isAlreadyExist()){
            return false;
        }

        $sql = "INSERT INTO \"$this->table\" (nom, prenom, groupe, classe, sexe) VALUES (:nom, :prenom, :groupe, :classe, :sexe)";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':nom', $this->nom);
        $stmt->bindParam(':prenom', $this->prenom);
        $stmt->bindParam(':groupe', $this->groupe);
        $stmt->bindParam(':classe', $this->classe);
        $stmt->bindParam(':sexe', $this->sexe);

        return $stmt->execute();
    }

    function isAlreadyExist(){
        $sql = "SELECT * FROM \"$this->table\" WHERE nom = :nom AND prenom = :prenom";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':nom', $this->nom);
        $stmt->bindParam(':prenom', $this->prenom);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    function setId($id){
        $this->id = $id;
    }

    function setNom($nom){
        $this->nom = $nom;
    }

    function setPrenom($prenom){
        $this->prenom = $prenom;
    }

    function setGroupe($groupe){
        $this->groupe = $groupe;
    }

    function setClasse($classe){
        $this->classe = $classe;
    }

    function setSexe($sexe){
        $this->sexe = $sexe;
    }
}