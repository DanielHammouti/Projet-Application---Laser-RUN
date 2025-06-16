-- Création de la table User
CREATE TABLE IF NOT EXISTS "User" (
    id_user SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    groupe VARCHAR(100),
    classe VARCHAR(100),
    prof BOOLEAN,
    langue VARCHAR(100)
);

-- Création de la table Session
CREATE TABLE IF NOT EXISTS "Session" (
    id_session SERIAL PRIMARY KEY,
    dateHeure TIMESTAMP NOT NULL,
    id_user INTEGER REFERENCES "User"(id_user)
);

-- Création de la table Performance
CREATE TABLE IF NOT EXISTS "Performance" (
    id_perf SERIAL PRIMARY KEY,
    TempsTot REAL,
    PourcentageTirReussi REAL,
    Meneur BOOLEAN,
    id_session INTEGER REFERENCES "Session"(id_session),
    id_tir INTEGER,
    id_course INTEGER
);

-- Création de la table Tir
CREATE TABLE IF NOT EXISTS "Tir" (
    id_tir SERIAL PRIMARY KEY,
    nb_tir INTEGER,
    id_perf INTEGER REFERENCES "Performance"(id_perf)
);

-- Création de la table Course
CREATE TABLE IF NOT EXISTS "Course" (
    id_course SERIAL PRIMARY KEY,
    distance REAL,
    temps_course REAL,
    id_perf INTEGER REFERENCES "Performance"(id_perf)
);

-- Ajout des clés étrangères manquantes dans Performance
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_perf_tir'
    ) THEN
        ALTER TABLE "Performance"
            ADD CONSTRAINT fk_perf_tir FOREIGN KEY (id_tir) REFERENCES "Tir"(id_tir);
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'fk_perf_course'
    ) THEN
        ALTER TABLE "Performance"
            ADD CONSTRAINT fk_perf_course FOREIGN KEY (id_course) REFERENCES "Course"(id_course);
    END IF;
END
$$;

-- Création de la table Historique
CREATE TABLE IF NOT EXISTS "Historique" (
    id_hist SERIAL PRIMARY KEY,
    id_user INTEGER REFERENCES "User"(id_user),
    id_session INTEGER REFERENCES "Session"(id_session),
    id_perf INTEGER REFERENCES "Performance"(id_perf)
);
