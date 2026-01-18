import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider"; // Mise à jour de l'import
import Sidebar from "../components/Sidebar";
import { FolderRoot, CheckSquare, Send, Users2, Loader2 } from "lucide-react";

export default function ChercheurLayout() {
  // On récupère le token et l'utilisateur depuis le nouveau contexte
  const { user, token } = useStateContext();

  // 1. Protection : Si pas de token, redirection login
  if (!token) return <Navigate to="/login" />;

  // 2. Sécurité : Attendre que l'objet user soit chargé depuis le localStorage
  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-slate-900" size={40} />
      </div>
    );
  }

  // 3. Autorisation : Accès permis aux chercheurs et chefs de projet
  const allowedRoles = ["Chercheur", "ChefProjet"];
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  const chercheurLinks = [
    { label: "Mes Projets", path: "/chercheur/mes-projets", icon: <FolderRoot size={18} /> },
    { label: "Mes Tâches", path: "/chercheur/mes-taches", icon: <CheckSquare size={18} /> },
    { label: "Proposer Projet", path: "/chercheur/proposer-projet", icon: <Send size={18} /> },
    { label: "Ma Division", path: "/chercheur/ma-division", icon: <Users2 size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar pour l'espace chercheur */}
      <Sidebar 
        title="Espace Chercheur" 
        links={chercheurLinks} 
        colorClass="bg-slate-900" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec identité de la division */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Portail Recherche
             </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{user.nom} {user.prenom}</p>
              <p className="text-[10px] text-blue-600 font-bold uppercase">
                {user.division?.acronyme || "Membre CERIST"}
              </p>
            </div>
            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center font-bold border border-slate-200">
              {user.nom?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}