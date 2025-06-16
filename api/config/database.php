<?php

require_once __DIR__ . '/../../vendor/autoload.php'; // chemin corrigé vers la racine du projet

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../'); // chemin corrigé vers la racine du projet
$dotenv->load();

class Database{
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    public $conn;

    public function __construct() {
        $this->host = $_ENV['DB_HOST'];
        $this->db_name = $_ENV['DB_NAME'];
        $this->username = $_ENV['DB_USER'];
        $this->password = $_ENV['DB_PASS'];
        $this->port = $_ENV['DB_PORT'];
    }

    public function getConnection(){
        $this->conn = null;
        try{
            $connectionString = "host={$this->host} port={$this->port} dbname={$this->db_name} user={$this->username} password={$this->password}";
            $this->conn = pg_connect($connectionString);
            
            if (!$this->conn) {
                throw new Exception("Impossible de se connecter à la base de données PostgreSQL");
            }
            
            echo "Connexion à PostgreSQL réussie !";
            return $this->conn;
        } catch(Exception $exception){
            echo "Erreur de connexion : " . $exception->getMessage();
            return false;
        }
    }
}

$database = new Database();
$connection = $database->getConnection();

if ($connection) {
    echo "\nConnexion établie avec succès !";
} else {
    echo "\nÉchec de la connexion.";
}

?>