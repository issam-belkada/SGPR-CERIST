import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider"; // Mise à jour de l'import
import Sidebar from "../components/Sidebar";
import { LayoutDashboard, Users, GanttChartSquare, FileBarChart, Loader2 } from "lucide-react";

export default function ChefProjetLayout() {
  // Récupération de l'état global via votre nouveau provider
  const { user, token } = useStateContext();

  // 1. Vérification de l'authentification par le token
  if (!token) return <Navigate to="/login" />;

  // 2. Gestion du délai de chargement de l'objet utilisateur
  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  // 3. Vérification du rôle spécifique
  if (user.role !== "ChefProjet") return <Navigate to="/unauthorized" />;

  const links = [
    { label: "Pilotage Projet", path: "/chef-projet/pilotage", icon: <LayoutDashboard size={18} /> },
    { label: "Gestion Équipe", path: "/chef-projet/equipe", icon: <Users size={18} /> },
    { label: "WPs & Tâches", path: "/chef-projet/planning", icon: <GanttChartSquare size={18} /> },
    { label: "Bilan & Productions", path: "/chef-projet/bilan", icon: <FileBarChart size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-blue-50/20">
      {/* Sidebar avec identité visuelle Indigo pour le pilotage */}
      <Sidebar 
        title="Gestion de Projet" 
        links={links} 
        colorClass="bg-indigo-950" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* En-tête du Chef de Projet */}
        <header className="h-16 bg-white border-b border-indigo-100 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 hidden sm:block">
              <GanttChartSquare size={20} />
            </div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
              Espace Chef de Projet
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                {user.nom} {user.prenom}
              </p>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                C.P / {user.division?.acronyme || "CERIST"}
              </span>
            </div>
          </div>
        </header>

        {/* Contenu principal de pilotage */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}