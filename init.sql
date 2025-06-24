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

-- Insertion des utilisateurs
INSERT INTO "User" (id_user, nom, prenom, classe, sexe, api_key) VALUES
('L4iXbUG6eKPdn14mO8ObMqKM8jp1', 'VAUKAN', 'Sylvain', 'Administrateur', 'Non spécifié', 'e263986828ae1868396da6ab8a556625'),
('kk2qenwE1EaMmV85Y0ItqcE4I3r1', 'STADLER', 'Valentin', 'STI', 'Homme', 'cd5f9c4fcbcd0d531c0a6a3be2328173');


-- Insertion des sessions pour Julien Martageix
INSERT INTO "Session" (six, quatre, deux, nb_tirs, meneur, dateheure, id_user) VALUES
(180, 120, 60, 15, true,  '2025-06-01 10:00:00', 'kk2qenwE1EaMmV85Y0ItqcE4I3r1'),
(120, 80, 30, 13, false, '2025-06-08 15:30:00', 'kk2qenwE1EaMmV85Y0ItqcE4I3r1'),
(150, 100, 50, 7, true,  '2025-06-15 09:45:00', 'kk2qenwE1EaMmV85Y0ItqcE4I3r1');