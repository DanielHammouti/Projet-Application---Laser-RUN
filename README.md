# Application Laser RUN – INSA Centre-Val de Loire (STI 3A)

Ce dépôt contient la réalisation d’un projet d’application web développée dans le cadre de la 3ᵉ année du département **Sécurité et Technologies Informatique (STI)** à l’**INSA Centre-Val de Loire**.  
L’application a pour objectif de suivre et d’analyser les performances d’entraînement à l’épreuve **Laser-Run** (course + tir).

## 🎯 Fonctionnalités principales

* Authentification sécurisée avec **Firebase Auth** (connexion, inscription, mot de passe oublié).
* Chronomètre & timers pour les distances 200 m / 400 m / 600 m.
* Sauvegarde automatique des sessions : temps au tour, nombre de tirs réussis, présence d’un meneur d’allure, date/heure, …
* Tableau de bord d’historique et de statistiques : temps moyens, pourcentages de réussite, notation sur 12, etc.
* Page de paramètres (langue FR/EN, distance de course par défaut, meneur ✔/✘).
* Multilingue (français / anglais) et interface responsive.

## 🗺️ Architecture du dépôt

```
├── api/                 # Backend PHP (REST)
│   ├── config/          # Connexion BD, variables d’environnement
│   ├── objects/         # Modèles métier (User, Session…)
│   └── sessions/ users/ # End-points REST CRUD
├── src/
│   ├── html/            # Pages HTML (index, settings, history…)
│   ├── js/              # Scripts front-end (auth, timers, settings…)
│   ├── css/             # Feuilles de style
│   └── img/             # Ressources graphiques
├── vendor/              # Dépendances PHP installées par Composer
├── .env                 # Exemple de configuration (à copier en .env)
└── README.md            # Vous êtes ici
```

## 🛠️ Technologies utilisées

* **Front-end** : HTML5, CSS3, JavaScript (ES6), jQuery
* **Back-end** : PHP 8.x, **PostgreSQL**, Composer, Dotenv
* **Services** : Firebase Authentication

## 🚀 Mise en route

### 1. Prérequis

* PHP ≥ 8 avec l’extension `pdo_pgsql`
* PostgreSQL ≥ 12
* Node.js (facultatif, seulement pour servir le front plus simplement)
* Composer

### 2. Clonage

```bash
git clone https://github.com/DanielHammouti/Projet-Application---Laser-RUN.git
cd laser-run
```

### 3. Configuration de la base PostgreSQL

```sql
-- Exemple minimal (à adapter)
CREATE TABLE "User" (
  id_user   VARCHAR(64) PRIMARY KEY,
  nom       TEXT NOT NULL,
  prenom    TEXT NOT NULL,
  classe    TEXT,
  sexe      TEXT
);

CREATE TABLE "Session" (
  id_session SERIAL PRIMARY KEY,
  dateheure  TIMESTAMP NOT NULL,
  id_user    VARCHAR(64) REFERENCES "User"(id_user) ON DELETE CASCADE,
  six        INTEGER,
  quatre     INTEGER,
  deux       INTEGER,
  nb_tirs    INTEGER,
  meneur     BOOLEAN
);
```

### 4. Variables d’environnement

Copiez le modèle et renseignez vos valeurs :

```bash
nano .env
```

Contenu minimal :

```ini
DB_HOST=localhost
DB_PORT=5432
DB_NAME=laser_run
DB_USER=postgres
DB_PASS=motdepasse
```

### 5. Installation des dépendances PHP

```bash
composer install
```

### 6. Lancement du front-end

Méthode simple (Node requis) :
```bash
systemctl start apache2
```

Ouvrez directement `https://172.16.100.3` dans votre navigateur (certaines fonctionnalités CORS ou requêtes fetch peuvent alors être limitées).

### 7. Configuration des serveurs de développement

```bash
cp /etc/apache2/sites-available/default--ssl.conf /etc/apache2/site-available/dev1.conf
```

Changer le port d'écoute
```bash
nano etc/apache2/site-available/dev1.conf
```

Changer le port dans le virtual host
```bash
<VirtualHost *:8081>
```

Changer le répertoire source
```bash
DocumentRoot /var/www/html/dev1.conf
```

Activer le site web
```bash
a2ensite dev1.conf
```

Relancer le serveur Apache
```bash
systemctl restart apache2
```

Ouvrez directement `https://172.16.100.3:8081` dans votre navigateur

## 📄 Licence

Projet réalisé à des fins pédagogiques – licence libre au choix de l’équipe (ex. MIT). N’hésitez pas à adapter ce fichier selon vos besoins.

---

© INSA Centre-Val de Loire – Département STI 3A – 2025