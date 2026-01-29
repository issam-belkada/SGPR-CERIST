<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=220&section=header&text=SGPR%20-%20CERIST&fontSize=70&animation=fadeIn&fontAlignY=35" width="100%" />

  <h3> 📊 Research Project Management System (SGPR) </h3>
  <p><i>A premium Full-Stack solution for the digital transformation of research lifecycles at CERIST.</i></p>

  <p align="center">
    <img src="https://img.shields.io/badge/Internship-Software%20Engineer-blueviolet?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Architecture-RESTful%20API-blue?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql" />
  </p>
</div>

---

## 📖 Project Overview
The **SGPR** (Système de Gestion des Projets de Recherche) is a centralized web platform developed for **CERIST** (Center for Research on Scientific and Technical Information) to automate the entire lifecycle of research projects. 

By replacing manual, fragmented processes (Word/Excel/Paper), this system ensures full traceability of scientific production, from the initial proposal to the final annual report.

---

## 🚀 Key Features

### 1. Advanced Security & RBAC
- **Auth Service:** Secured via **Laravel Sanctum** using stateful/token-based authentication.
- **Granular Permissions:** Implemented **Spatie Laravel Permission** to manage 5 distinct roles:
    - *Researcher, Project Lead, Division Head, Scientific Council, and Administrator.*

### 2. Project Lifecycle & Workflow
- **Digital Proposals:** A streamlined module for submitting research objectives and methodologies.
- **Dynamic Validation:** A multi-step workflow (Proposed → Validated → Active → Closed) with real-time status tracking.
- **Operational Planning:** Breaking down projects into **Work Packages (WP)** and specific tasks.

### 3. Monitoring & Scientific Tracking
- **Deliverable Management:** Secure file upload system for scientific proof (Articles, Code, Technical Reports).
- **Auto-Progress Calculation:** Logic-driven progress bars based on task completion and deliverable validation.
- **Team Coordination:** Management of researchers and PhD students assigned to specific WPs.

### 4. Automated Reporting (The Core Value)
- **PDF Generation:** Integrated **Laravel DomPDF** to instantly generate official annual reports and Council Minutes (PV), aggregating all annual project data automatically.
- **Analytics Dashboard:** Real-time KPIs for Division Heads to monitor scientific production across their departments.

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
| :--- | :--- |
| **Backend (API)** | ![Laravel](https://img.shields.io/badge/Laravel_12-FF2D20?style=flat-square&logo=laravel&logoColor=white) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-red?style=flat-square) ![Spatie](https://img.shields.io/badge/Spatie-Roles-yellow?style=flat-square) ![DomPDF](https://img.shields.io/badge/DomPDF-Reporting-blue?style=flat-square) |
| **Frontend (UI)** | ![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![Lucide](https://img.shields.io/badge/Lucide_React-Icons-pink?style=flat-square) |
| **Data & DevOps** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) |

</div>

---

## 🏗️ Design & Methodology
The project followed a rigorous **V-Model (Cycle en V)** development process:
- **UML Modeling:** Comprehensive Use Case, Class, and Sequence diagrams to map complex research workflows.
- **Decoupled Architecture:** A clean separation between the **Laravel REST API** and the **React SPA**, ensuring scalability.
- **Data Integrity:** Leveraging PostgreSQL constraints to maintain strict scientific records.

---

## 💻 Installation

### Prerequisites
- PHP 8.2+ & Composer
- Node.js & npm
- PostgreSQL Instance

### 1. Backend Setup
```bash
git clone [https://github.com/issam-belkada/SGPR-CERIST.git](https://github.com/issam-belkada/SGPR-CERIST.git)
cd SGPR-Backend
composer install
cp .env.example .env # Set your PostgreSQL credentials
php artisan key:generate
php artisan migrate --seed # Critical: Initializes Roles and Permissions


cd frontend
npm install
npm run dev

Here is the organized version of your README. It fixes the broken image links at the bottom, cleans up the code blocks for the installation steps, and ensures the formatting is consistent and professional.

Markdown

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=220&section=header&text=SGPR%20-%20CERIST&fontSize=70&animation=fadeIn&fontAlignY=35" width="100%" />

  <h3> 📊 Research Project Management System (SGPR) </h3>
  <p><i>A premium Full-Stack solution for the digital transformation of research lifecycles at CERIST.</i></p>

  <p align="center">
    <img src="https://img.shields.io/badge/Internship-Software%20Engineer-blueviolet?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Architecture-RESTful%20API-blue?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Database-PostgreSQL-316192?style=for-the-badge&logo=postgresql" />
  </p>
</div>

---

## 📖 Project Overview
The **SGPR** (Système de Gestion des Projets de Recherche) is a centralized web platform developed for **CERIST** (Center for Research on Scientific and Technical Information) to automate the entire lifecycle of research projects. 

By replacing manual, fragmented processes (Word/Excel/Paper), this system ensures full traceability of scientific production, from the initial proposal to the final annual report.

---

## 🚀 Key Features

### 1. Advanced Security & RBAC
- **Auth Service:** Secured via **Laravel Sanctum** using stateful/token-based authentication.
- **Granular Permissions:** Implemented **Spatie Laravel Permission** to manage 5 distinct roles:
    - *Researcher, Project Lead, Division Head, Scientific Council, and Administrator.*

### 2. Project Lifecycle & Workflow
- **Digital Proposals:** A streamlined module for submitting research objectives and methodologies.
- **Dynamic Validation:** A multi-step workflow (Proposed → Validated → Active → Closed) with real-time status tracking.
- **Operational Planning:** Breaking down projects into **Work Packages (WP)** and specific tasks.

### 3. Monitoring & Scientific Tracking
- **Deliverable Management:** Secure file upload system for scientific proof (Articles, Code, Technical Reports).
- **Auto-Progress Calculation:** Logic-driven progress bars based on task completion and deliverable validation.
- **Team Coordination:** Management of researchers and PhD students assigned to specific WPs.

### 4. Automated Reporting (The Core Value)
- **PDF Generation:** Integrated **Laravel DomPDF** to instantly generate official annual reports and Council Minutes (PV), aggregating all annual project data automatically.
- **Analytics Dashboard:** Real-time KPIs for Division Heads to monitor scientific production across their departments.

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
| :--- | :--- |
| **Backend (API)** | ![Laravel](https://img.shields.io/badge/Laravel_12-FF2D20?style=flat-square&logo=laravel&logoColor=white) ![Sanctum](https://img.shields.io/badge/Sanctum-Auth-red?style=flat-square) ![Spatie](https://img.shields.io/badge/Spatie-Roles-yellow?style=flat-square) ![DomPDF](https://img.shields.io/badge/DomPDF-Reporting-blue?style=flat-square) |
| **Frontend (UI)** | ![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![Lucide](https://img.shields.io/badge/Lucide_React-Icons-pink?style=flat-square) |
| **Data & DevOps** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white) |

</div>

---

## 🏗️ Design & Methodology
The project followed a rigorous **V-Model (Cycle en V)** development process:
- **UML Modeling:** Comprehensive Use Case, Class, and Sequence diagrams to map complex research workflows.
- **Decoupled Architecture:** A clean separation between the **Laravel REST API** and the **React SPA**, ensuring scalability.
- **Data Integrity:** Leveraging PostgreSQL constraints to maintain strict scientific records.

---

## 💻 Installation

### Prerequisites
- PHP 8.2+ & Composer
- Node.js & npm
- PostgreSQL Instance

### 1. Backend Setup
```bash
git clone [https://github.com/issam-belkada/SGPR-CERIST.git](https://github.com/issam-belkada/SGPR-CERIST.git)
cd SGPR-Backend
composer install
cp .env.example .env # Set your PostgreSQL credentials
php artisan key:generate
php artisan migrate --seed # Critical: Initializes Roles and Permissions


2. Frontend Setup

cd frontend
npm install
npm run dev


👨‍💻 Author
Issam Belkada - Software Engineering Student at ENPO-MA.

<div align="center"> <img src="https://www.google.com/search?q=https://img.shields.io/badge/Status-Completed-success%3Fstyle%3Dflat-square" /> <img src="https://www.google.com/search?q=https://img.shields.io/badge/Academic_Year-2025/2026-lightgrey%3Fstyle%3Dflat-square" /> </div>
