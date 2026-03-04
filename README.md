# SGPR-CERIST 🚀
### Système de Gestion des Projets de Recherche - CERIST

![Version](https://img.shields.io/badge/version-2.0.4-blue)
![Laravel](https://img.shields.io/badge/Backend-Laravel%2011-red)
![React](https://img.shields.io/badge/Frontend-React%2018-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-teal)

## 📌 Présentation du Projet
Le **SGPR-CERIST** (Système de Gestion des Projets de Recherche) est une plateforme web "Full-Stack" développée pour moderniser le suivi des activités scientifiques au sein du **CERIST**. 

L'application répond à une problématique centrale : automatiser la collecte des bilans périodiques et centraliser le suivi des **Work Packages (WP)** et des livrables, tâches qui étaient auparavant gérées manuellement.



## ✨ Fonctionnalités Clés

### 👨‍🔬 Espace Chercheur
- **Dashboard Personnel** : Indicateurs clés sur les projets assignés et taux de complétion global.
- **Timeline des Travaux** : Calendrier dynamique des échéances à venir.
- **Soumission de Livrables** : Interface de dépôt et de suivi des tâches liées aux Work Packages.
- **Proposition de Projets** : Formulaire fluide pour soumettre de nouvelles thématiques de recherche.

### 👨‍💼 Espace Chef de Division
- **Pilotage de Division** : Vue panoramique sur l'état d'avancement de tous les projets de l'entité.
- **Gestion des Effectifs** : Répertoire interactif des chercheurs avec filtres par grade et spécialité.
- **Validation** : Monitoring des livrables déposés par les équipes de recherche.

### 🛡️ Administration & Sécurité
- **RBAC (Role-Based Access Control)** : Gestion granulaire des accès via le package **Spatie**.
- **Architecture API** : Communication sécurisée entre React et Laravel via Sanctum/Axios.



## 🛠️ Stack Technique

**Frontend :**
- **React.js (Vite)** : Pour une interface fluide et réactive (Single Page Application).
- **Tailwind CSS** : Design système moderne, responsive et épuré.
- **Lucide Icons** : Pack d'icônes optimisé pour l'UX.

**Backend :**
- **Laravel 12** : Moteur de l'API REST, gestion des migrations et de la logique métier.
- **PostgreSQL** : Gestion rigoureuse des données relationnelles complexes.
- **Spatie Laravel-Permission** : Gestion des rôles (Admin, Chef de Division, Chercheur).

## 📂 Architecture de la Solution
Le projet suit une architecture découplée permettant une maintenance facilitée et une scalabilité accrue :
1. **Couche Présentation** : React gère l'état de l'UI et la navigation.
2. **Couche Service (API)** : Laravel traite les requêtes, applique les politiques de sécurité et interagit avec la base de données.



## 🚀 Installation et Configuration

### Prérequis
- PHP >= 8.2
- Node.js & NPM
- Composer
- PostgreSQL ou MySQL

### Installation
1. **Cloner le projet** :
   ```bash
   git clone [https://github.com/issam-belkada/SGPR-CERIST.git](https://github.com/issam-belkada/SGPR-CERIST.git)
   cd SGPR-CERIST


### Configuration Backend :

cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

### Configuration Frontend :

cd frontend
npm install
npm run dev
