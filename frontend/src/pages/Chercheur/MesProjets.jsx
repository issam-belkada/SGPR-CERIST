import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { useStateContext } from "../../context/ContextProvider";
import { 
  FolderRoot, Search, Plus, 
  Calendar, ArrowUpRight, Loader2,
  User, Users
} from "lucide-react";

export default function MesProjets() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useStateContext(); // Pour comparer l'ID de l'utilisateur

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    try {
      const { data } = await axiosClient.get("/mes-projets");
      setProjets(data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjets = projets.filter(p => 
    p.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.acronyme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portefeuille Projets</h1>
          <p className="text-slate-500 font-medium">Projets auxquels vous contribuez au CERIST.</p>
        </div>
        <Link 
          to="/chercheur/proposer-projet" 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all"
        >
          <Plus size={16} /> Soumettre une idée
        </Link>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Filtrer mes projets..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRILLE DE PROJETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjets.map((projet) => (
          <div key={projet.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <FolderRoot size={24} />
              </div>
              
              {/* Badge Rôle : Chef vs Participant */}
              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                projet.chef_projet_id === user.id 
                ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
              }`}>
                {projet.chef_projet_id === user.id ? <User size={10} /> : <Users size={10} />}
                {projet.chef_projet_id === user.id ? 'Chef de projet' : 'Participant'}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-black text-slate-800 text-lg leading-tight mb-2 uppercase">{projet.titre}</h3>
              <span className="text-indigo-600 text-[11px] font-black tracking-[0.2em]">{projet.acronyme}</span>
              
              <div className="mt-4 flex items-center gap-4 text-slate-400 text-[10px] font-bold uppercase">
                 <div className="flex items-center gap-1">
                    <Calendar size={12} /> {new Date(projet.date_debut).getFullYear()}
                 </div>
                 <div className="flex items-center gap-1">
                    <Users size={12} /> {projet.membres_count} membres
                 </div>
              </div>

              {/* Barre de Progression */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-400">Avancement Physique</span>
                  <span className="text-slate-700">{projet.progression || 0}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-700" 
                    style={{ width: `${projet.progression || 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50">
              <Link 
                to={`/chercheur/projet/${projet.id}`}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl hover:bg-indigo-600 transition-all text-[10px] font-black uppercase tracking-widest"
              >
                Suivre le projet <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}