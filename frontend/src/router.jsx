import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import GuestLayout from "./layouts/GuestLayout";
import AdminLayout from "./layouts/AdminLayout";
import CSLayout from "./layouts/CSLayout";
import ChefDivisionLayout from "./layouts/ChefDivisionLayout";
import ChefProjetLayout from "./layouts/ChefProjetLayout";
import ChercheurLayout from "./layouts/ChercheurLayout";

// Pages
import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserList from "./pages/Admin/UserList";
import UserForm from "./pages/Admin/UserForm";
import UserDetails from "./pages/Admin/UserDetails";
import DivisionList from "./pages/Admin/DivisionList";
import DivisionForm from "./pages/Admin/DivisionForm";
import DivisionDetails from "./pages/Admin/DivisionDetails";

const router = createBrowserRouter([

  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: "login", element: <Login /> },
    ],
  },


  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      
      // Gestion des Utilisateurs
      { path: "users", element: <UserList /> },
      { path: "users/create", element: <UserForm /> },
      { path: "users/:id", element: <UserDetails /> },
      { path: "users/:id/edit", element: <UserForm /> },
      
      // Gestion des Divisions
      { path: "divisions", element: <DivisionList /> },
      { path: "divisions/create", element: <DivisionForm /> },
      { path: "divisions/:id", element: <DivisionDetails /> },
      { path: "divisions/:id/edit", element: <DivisionForm /> },
    ],
  },


  {
    path: "/cs",
    element: <CSLayout />,
    children: [
      { index: true, element: <Navigate to="/cs/sessions" replace /> },
      { path: "sessions", element: <div>Sessions CS</div> },
      { path: "propositions-nationales", element: <div>Propositions Nationales</div> },
    ],
  },


  {
    path: "/division",
    element: <ChefDivisionLayout />,
    children: [
      { index: true, element: <Navigate to="/division/propositions" replace /> },
      { path: "propositions", element: <div>Propositions de la Division</div> },
    ],
  },


  {
    path: "/chef-projet",
    element: <ChefProjetLayout />,
    children: [
      { index: true, element: <Navigate to="/chef-projet/pilotage" replace /> },
      { path: "pilotage", element: <div>Pilotage des Projets</div> },
    ],
  },


  {
    path: "/chercheur",
    element: <ChercheurLayout />,
    children: [
      { index: true, element: <Navigate to="/chercheur/mes-projets" replace /> },
      { path: "mes-projets", element: <div>Mes Projets de Recherche</div> },
      { path: "proposer-projet", element: <div>Nouveau Projet</div> },
    ],
  },
    
  
    {
    path: "/unauthorized", 
    element: <div className="h-screen flex items-center justify-center font-bold text-red-600 uppercase tracking-widest">Accès non autorisé</div> 
  },
  { 
    path: "*", 
    element: <div className="h-screen flex items-center justify-center font-bold">404 - Page introuvable</div> 
  },
]);

export default router;