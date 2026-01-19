import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import Sidebar from "../components/Sidebar";
import { 
  FolderRoot, CheckSquare, Send, Users2, 
  Loader2, Bell, LayoutDashboard, Search,
  LogOut, UserCircle
} from "lucide-react";

export default function ChercheurLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  const location = useLocation();

  // 1. Protection : Si pas de token, redirection login
  if (!token) return <Navigate to="/login" />;

  // 2. Sécurité : Attendre que l'objet user soit chargé
  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Initialisation du profil...</p>
      </div>
    );
  }


  const logout = (e) => {
      e.preventDefault();
      // Logique de déconnexion ici (appel API + reset context)
      setUser({});
      setToken(null);
  };

  const chercheurLinks = [
    { label: "Dashboard", path: "/chercheur/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Mes Projets", path: "/chercheur/mes-projets", icon: <FolderRoot size={18} /> },
    { label: "Mes Tâches", path: "/chercheur/mes-taches", icon: <CheckSquare size={18} /> },
    { label: "Proposer Projet", path: "/chercheur/proposer-projet", icon: <Send size={18} /> },
    { label: "Ma Division", path: "/chercheur/ma-division", icon: <Users2 size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFD]">
      {/* Sidebar - Look Professionnel Slate-900 */}
      <Sidebar 
        title="CERIST Research" 
        links={chercheurLinks} 
        colorClass="bg-slate-900" 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Moderne avec Effet de Verre (Blur) */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 z-10 shrink-0">
          
          {/* Fil d'ariane Dynamique */}
          <div className="flex flex-col">
             <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-0.5">
               Espace de recherche
             </span>
             <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                {chercheurLinks.find(l => location.pathname.includes(l.path))?.label || "Détails du projet"}
             </h2>
          </div>

          {/* Zone d'actions Droite */}
          <div className="flex items-center gap-6">
            {/* Recherche interne */}
            <div className="hidden lg:flex items-center bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
               <Search size={14} className="text-slate-400" />
               <input type="text" placeholder="Rechercher un projet..." className="bg-transparent border-none text-[11px] focus:outline-none px-3 w-44 font-medium" />
            </div>

            {/* Système de Notification */}
            <button className="relative p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
            </button>

            <div className="h-8 w-px bg-slate-100 mx-1"></div>

            {/* Bloc Utilisateur & Menu de déconnexion */}
            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-none">
                  {user.nom} {user.prenom}
                </p>
                <p className="text-[9px] text-indigo-600 font-black uppercase mt-1 tracking-wider">
                  {user.division?.acronyme || "CERIST"} • {user.role === "ChefProjet" ? "Chef de Projet" : "Chercheur"}
                </p>
              </div>
              
              {/* Avatar avec Menu Dropdown au Hover (Simplifié) */}
              <div className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-100 transition-all group-hover:shadow-indigo-200 cursor-pointer">
                  {user.nom?.charAt(0)}{user.prenom?.charAt(0)}
                </div>
                
                {/* Petit badge de statut en ligne */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>

                {/* Dropdown Menu dissimulé */}
                <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-50 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 z-50">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                        <UserCircle size={16} /> Profil
                    </button>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut size={16} /> Déconnexion
                    </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Zone de contenu principale */}
        <main className="flex-1 overflow-y-auto bg-[#FBFCFE] custom-scrollbar">
          <div className="max-w-6xl mx-auto p-8 md:p-12">
             {/* C'est ici que s'affichent ProposerProjet, MesTaches, ou ProjectDetails */}
             <Outlet context={{ user, fetchProjet: () => {} }} />
          </div>
        </main>
      </div>

      {/* Styles CSS Injectés pour la scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}} />
    </div>
  );
}