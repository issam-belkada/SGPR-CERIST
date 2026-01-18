import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider"; // Import mis à jour
import Sidebar from "../components/Sidebar";
import { ClipboardList, CheckCircle2, FileStack, Users2, Loader2 } from "lucide-react";

export default function ChefDivisionLayout() {
  // Utilisation de votre nouveau contexte (user et token)
  const { user, token } = useStateContext();

  // 1. Protection : Si aucun jeton n'existe, redirection vers login
  if (!token) return <Navigate to="/login" />;

  // 2. Attente du chargement des données utilisateur
  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-slate-900" size={40} />
      </div>
    );
  }

  // 3. Vérification du rôle spécifique
  if (user.role !== "ChefDivision") return <Navigate to="/unauthorized" />;

  const links = [
    { label: "Propositions", path: "/division/propositions", icon: <ClipboardList size={18} /> },
    { label: "Validation Bilans", path: "/division/suivi-bilans", icon: <CheckCircle2 size={18} /> },
    { label: "Rapport Division", path: "/division/rapport-division", icon: <FileStack size={18} /> },
    { label: "Membres & Projets", path: "/division/membres-structures", icon: <Users2 size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar adaptée au Chef de Division */}
      <Sidebar 
        title="Chef de Division" 
        links={links} 
        colorClass="bg-slate-900" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header optionnel pour le contexte de la division */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Espace Structure
            </h2>
            {user.division && (
              <span className="text-[10px] text-blue-600 font-bold uppercase">
                Division: {user.division.acronyme}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{user.nom} {user.prenom}</p>
              <p className="text-[10px] text-slate-400 font-medium">Responsable Division</p>
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