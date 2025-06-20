<?php

class User{

    private $conn;
    private $table = "User";


    private $id;
    private $nom;
    private $prenom;
    private $classe;
    private $sexe;
    // Clé API unique attribuée à l'utilisateur lors de sa création
    private $api_key;

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

        // Insertion incluant la clé API
        $sql = "INSERT INTO \"$this->table\" (id_user, nom, prenom, classe, sexe, api_key) VALUES (:id_user, :nom, :prenom, :classe, :sexe, :api_key)";
        $stmt = $this->conn->prepare($sql);

        $stmt->bindParam(':id_user', $this->id);
        $stmt->bindParam(':nom', $this->nom);
        $stmt->bindParam(':prenom', $this->prenom);
        $stmt->bindParam(':classe', $this->classe);
        $stmt->bindParam(':sexe', $this->sexe);
        $stmt->bindParam(':api_key', $this->api_key);

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

    function setClasse($classe){
        $this->classe = $classe;
    }

    function setSexe($sexe){
        $this->sexe = $sexe;
    }

    /*
     * Génère une clé API aléatoire et l'assigne à l'utilisateur
     */
    function generateApiKey(){
        $this->api_key = bin2hex(random_bytes(16)); // 32 caractères hexadécimaux
    }

    function getApiKey(){
        return $this->api_key;
    }
}