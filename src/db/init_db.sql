-- Création de la table User
CREATE TABLE IF NOT EXISTS "User" (
    id_user SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    groupe VARCHAR(100),
    classe VARCHAR(100),
    prof BOOLEAN,
    sexe VARCHAR(100)
);

-- Création de la table Session
CREATE TABLE IF NOT EXISTS "Session" (
    id_session SERIAL PRIMARY KEY,
    six INTEGER,
    quatre INTEGER,
    deux INTEGER,
    nb_tir INTEGER,
    meneur BOOLEAN,
    dateheure TIMESTAMP NOT NULL,
    id_user INTEGER REFERENCES "User"(id_user)
);
