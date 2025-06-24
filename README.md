# Application Laser RUN – INSA Centre-Val de Loire (STI 3A)

Ce dépôt contient la réalisation d’un projet d’application web développée dans le cadre de la 3ᵉ année du département **Sécurité et Technologies Informatique (STI)** à l’**INSA Centre-Val de Loire**.  
L’application a pour objectif de suivre et d’analyser les performances d’entraînement à l’épreuve **Laser-Run** (course + tir).

## 🎯 Fonctionnalités principales

* Authentification sécurisée avec **Firebase Auth** (connexion, inscription, mot de passe oublié).
* Chronomètre & timers pour les distances 200 m / 400 m / 600 m.
* Sauvegarde automatique des sessions : temps au tour, nombre de tirs réussis, présence d’un meneur d’allure, date/heure, …
* Tableau de bord d’historique et de statistiques : temps moyens, pourcentages de réussite, notation sur 12, etc.
* Page de paramètres (langue FR/EN, distance de course par défaut, meneur).
* Multilingue (français / anglais) et interface responsive.

## 🗺️ Architecture du dépôt

```
├── apache/              # Configuration Apache & certificats SSL
│   ├── conf/            # VirtualHosts HTTP/HTTPS
│   └── certs/           # Certificats auto-signés (développement)
├── www/                 # Racine exposée par Apache (front + back)
│   ├── api/             # Backend PHP (REST)
│   └── src/             # Front-end (HTML, CSS, JS, images…)
├── docker-compose.yml   # Orchestration Postgres + Apache/PHP
├── Dockerfile           # Image Apache + PHP + Composer
└── README.md            # Vous êtes ici
```

## 🛠️ Technologies utilisées

* **Front-end** : HTML5, CSS3, JavaScript (ES6), jQuery
* **Back-end** : PHP 8.x, **PostgreSQL** 16, Composer, Dotenv
* **Conteneurisation** : Docker, Docker Compose, Apache 2.4 sous Debian
* **Services** : Firebase Authentication

## 🚀 Mise en route avec Docker

### 1. Prérequis

* Docker ≥ 20.10 et l’extension **Docker Compose** (commande `docker compose`).

### 2. Clonage du dépôt

```bash
git clone https://github.com/DanielHammouti/Projet-Application---Laser-RUN.git
cd Projet-Application---Laser-RUN
```

### 3. Configuration facultative

Un fichier `.env` d’exemple est fourni si vous souhaitez surcharger la configuration par défaut (identifiants PostgreSQL, clés Firebase, etc.) :

```bash
cp .env.example .env    # puis éditez à votre convenance
```

Les variables déclarées dans ce fichier sont automatiquement prises en compte par le conteneur Apache/PHP via **php-dotenv**.

### 4. Lancement des services

```bash
docker compose up --build -d
```

Cette commande :

1. construit l’image `apache_debian` (Apache 2.4 + PHP + Composer),
2. démarre les conteneurs :
   * `lasertrack_postgres` (PostgreSQL 16, port 5432),
   * `apache_debian` (Apache + PHP, ports 80/443).

### 5. Accéder à l’application

* Front-end & API :  <http://localhost>  (HTTP)
* Front-end & API :  <https://localhost> (HTTPS, certificat auto-signé ➜ acceptez l’exception de sécurité)

### 6. Gestion des conteneurs

```bash
# Arrêter et supprimer les conteneurs
docker compose down

# Consulter les logs en direct
docker compose logs -f apache
```

---

> **Astuce :** Les fichiers des dossiers `apache/` et `www/` sont montés dans les conteneurs en mode _bind-mount_. Toute modification locale est donc immédiatement reflétée sans reconstruction d’image.

## 📄 Licence

Projet réalisé à des fins pédagogiques – Ce projet est sous la licence [MIT Licence](LICENCE.TXT)

---

© INSA Centre-Val de Loire – Département STI 3A – 2025