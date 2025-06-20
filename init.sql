-- Suppression des tables si elles existent
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Création de la table User
CREATE TABLE IF NOT EXISTS "User" (
    id_user VARCHAR(50) PRIMARY KEY,  
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    classe VARCHAR(100),
    sexe VARCHAR(100),
    api_key VARCHAR(64) UNIQUE
);

-- Création de la table Session
CREATE TABLE IF NOT EXISTS "Session" (
    id_session SERIAL PRIMARY KEY,
    six INTEGER,
    quatre INTEGER,
    deux INTEGER,
    nb_tirs INTEGER,
    meneur BOOLEAN,
    dateheure TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_user VARCHAR(50) REFERENCES "User"(id_user)
);
