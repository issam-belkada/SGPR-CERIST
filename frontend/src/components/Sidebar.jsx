import { Link, useLocation } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider"; // Mise à jour de l'import
import axiosClient from "../api/axios"; // Import du client API pour le logout
import { LogOut, ChevronRight } from "lucide-react";

export default function Sidebar({ title, links, colorClass = "bg-slate-900" }) {
  const location = useLocation();
  const { user, setUser, setToken } = useStateContext(); // Utilisation du nouveau contexte

  const handleLogout = async () => {
    if (!window.confirm("Voulez-vous vraiment vous déconnecter ?")) return;
    
    try {
      // Appel optionnel au backend pour invalider le token
      await axiosClient.post("/logout");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    } finally {
      // Nettoyage impératif du state et du localStorage
      setUser(null);
      setToken(null);
    }
  };

  return (
    <div className={`w-64 h-screen ${colorClass} text-white flex flex-col transition-all shadow-xl`}>
      {/* Header Sidebar */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wider text-blue-400">CERIST</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-tight">{title}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => {
          // Vérification précise du lien actif
          const isActive = location.pathname.startsWith(link.path);
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "hover:bg-white/5 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-white" : "text-slate-400"}>
                  {link.icon}
                </span>
                <span className="text-sm font-medium">{link.label}</span>
              </div>
              {isActive && <ChevronRight size={14} className="animate-in slide-in-from-left-1" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Sidebar / Profil */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
            {user?.nom?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate text-slate-100">
              {user?.nom} {user?.prenom?.charAt(0)}.
            </p>
            <p className="text-[10px] text-slate-400 truncate tracking-tight">
              {user?.email}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 p-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}