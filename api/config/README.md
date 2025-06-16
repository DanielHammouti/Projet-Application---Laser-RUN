# Projet Application Laser RUN

## Prérequis

- PHP 7.4 ou supérieur
- Composer
- PostgreSQL
- Serveur web (Apache/Nginx) ou serveur de développement PHP

## Installation

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd Projet-Application---Laser-RUN
```

### 2. Installer les dépendances PHP avec Composer
```bash
composer install
composer require vlucas/phpdoenv
```

### 3. Configuration de la base de données PostgreSQL

#### Vérifier que PostgreSQL est installé et en cours d'exécution
```bash
sudo systemctl status postgresql
```

Si PostgreSQL n'est pas installé :
```bash
sudo apt install postgresql postgresql-server
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

#### Créer la base de données
```bash
sudo -u postgres createdb lazertrack
```

#### Vérifier les bases de données existantes
```bash
sudo -u postgres psql -c "\l"
```

#### Créer l'utilisateur

Accéder au l'interface pour créer un utilisateur

```bash
sudo -i -u postgres
psql
```

Puis

```bash
CREATE ROLE admin WITH LOGIN PASSWORD 'azerty';
ALTER ROLE admin WITH SUPERUSER;
```

```bash
\q
exit
```

### 4. Configuration des variables d'environnement

#### Créer le fichier .env
À la racine du projet, créer un fichier `.env` avec le contenu suivant :

```env
# Configuration PostgreSQL
DB_HOST=localhost
DB_NAME=lazertrack
DB_USER=admin
DB_PASS=azerty
DB_PORT=5432

# Autres variables d'environnement
APP_ENV=development
APP_DEBUG=true
```

### 5. Modifier la méthode de connexion
```bash
sudo nano /var/lib/pgsql/data/pg_hba.conf
```

Cherche la ligne suivante (ou similaire) :
```bash
local   all             all                                    ident
```

Et remplace ident par md5 :

```bash
local   all             all                                     md5
```

Et si tu trouves aussi une ligne comme celle-ci (connexion via IPv4) :
```bash
host    all             all             127.0.0.1/32           ident
```

Remplace-la aussi par :
```bash
host    all             all             127.0.0.1/32            md5
```

### 6. Tester la connexion

#### Via le navigateur
Accéder à : `http://localhost/api/config/database.php`

## Structure du projet

```
Projet-Application---Laser-RUN/
├── api/
│   └── config/
│       └── database.php      # Configuration de la base de données
├── vendor/                   # Dépendances Composer
├── composer.json            # Configuration Composer
├── composer.lock           # Verrouillage des versions
├── .env                    # Variables d'environnement (à créer)
└── README.md              # Ce fichier
```

## Dépendances principales

- **vlucas/phpdotenv** : Chargement des variables d'environnement depuis le fichier .env
```