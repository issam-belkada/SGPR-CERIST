import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider"; // Mise à jour vers votre nouveau Context
import Sidebar from "../components/Sidebar";
import { Gavel, History, CalendarDays, FilePieChart, Globe, Loader2 } from "lucide-react";

export default function CSLayout() {
  // Récupération du token et de l'user depuis le nouveau StateContext
  const { user, token } = useStateContext();

  // 1. Protection : Redirection si non connecté
  if (!token) return <Navigate to="/login" />;
  if (user.role !== "ChefCS") return <Navigate to="/unauthorized" />;

  // 2. Sécurité : Attendre que l'objet user soit chargé du localStorage
  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="animate-spin text-cyan-700" size={40} />
      </div>
    );
  }

  // 3. Autorisation : Rôle spécifique ChefCS


  const links = [
    { label: "Propositions Nationales", path: "/cs/propositions-nationales", icon: <Globe size={18} /> },
    { label: "Bilans de Divisions", path: "/cs/bilans-divisions", icon: <FilePieChart size={18} /> },
    { label: "Sessions CS", path: "/cs/sessions", icon: <CalendarDays size={18} /> },
    { label: "Bilan Annuel Final", path: "/cs/bilan-annuel-final", icon: <History size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-stone-50">
      {/* Sidebar institutionnelle Cyan */}
      <Sidebar 
        title="Conseil Scientifique" 
        links={links} 
        colorClass="bg-cyan-950" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header CS Institutionnel */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-50 text-cyan-700 rounded-lg">
              <Gavel size={20} />
            </div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
              Présidence du Conseil Scientifique
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{user.nom} {user.prenom}</p>
              <span className="text-[10px] text-cyan-600 font-black uppercase">Session Active</span>
            </div>
            <div className="w-10 h-10 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center font-bold border border-cyan-200 shadow-inner">
              {user.nom?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Espace de travail décisionnel */}
        <main className="flex-1 overflow-y-auto p-8 bg-stone-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}