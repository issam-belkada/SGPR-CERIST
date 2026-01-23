import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { 
  Layers, 
  Search, 
  ArrowUpRight,
  Filter,
  CircleDot,
  LayoutGrid,
  Loader2
} from "lucide-react";

export default function ListeProjetsDivision() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get("/division/projets");
        // On vérifie si la structure est bien { success: true, data: [...] }
        setProjets(data.data || []);
      } catch (err) { 
        console.error("Détails de l'erreur:", err.response?.data || err.message); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchProjets();
  }, []);

  // Filtrage local pour la barre de recherche
  const filteredProjets = projets.filter(p => 
    p.titre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "en cours":
      case "en_cours": return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case "termine": return "text-blue-500 bg-blue-50 border-blue-100";
      case "suspendu": return "text-rose-500 bg-rose-50 border-rose-100";
      default: return "text-slate-400 bg-slate-50 border-slate-100";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 p-4 lg:p-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">
            Portfolio <span className="text-emerald-600">Projets</span>
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 italic flex items-center gap-2">
            <LayoutGrid size={14} /> Surveillance opérationnelle de la division
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-[1.8rem] border border-slate-200 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher par titre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-[11px] font-black uppercase tracking-widest focus:ring-2 focus:ring-emerald-500/20 outline-none w-full lg:w-64 transition-all"
            />
          </div>
          <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* --- GRID DE PROJETS --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {loading ? (
          // Skeleton Loading
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-50 rounded-[2.8rem] border border-slate-100 flex items-center justify-center">
              <Loader2 className="animate-spin text-slate-200" size={32} />
            </div>
          ))
        ) : (
          filteredProjets.map((projet) => (
            <div key={projet.id} className="group bg-white rounded-[2.8rem] border border-slate-200 p-8 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500 relative overflow-hidden">
              
              {/* Statut */}
              <div className={`absolute top-8 right-8 px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.15em] shadow-sm ${getStatusStyle(projet.statut)}`}>
                {projet.statut?.replace('_', ' ') || 'ACTIF'}
              </div>

              <div className="flex flex-col sm:flex-row gap-8">
                {/* Icône Design Bento */}
                <div className="w-20 h-20 shrink-0 bg-slate-950 rounded-[2rem] flex items-center justify-center text-emerald-400 shadow-2xl group-hover:rotate-3 transition-transform duration-500">
                  <Layers size={32} />
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">
                      {projet.type} • {projet.nature}
                    </p>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight group-hover:text-emerald-700 transition-colors uppercase italic">
                      {projet.titre}
                    </h2>
                    {projet.chef_projet && (
                      <p className="text-[11px] font-bold text-slate-500 uppercase">
                        Dirigé par : <span className="text-slate-900">{projet.chef_projet.nom} {projet.chef_projet.prenom}</span>
                      </p>
                    )}
                  </div>

                  {/* Barre de progression (Avancement Physique) */}
                  <div className="bg-[#F8FAFC] p-5 rounded-[1.8rem] border border-slate-50">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                      <span className="text-slate-400">Progression Scientifique</span>
                      <span className="text-slate-950">{projet.avancement_actuel}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(16,185,129,0.4)]" 
                        style={{ width: `${projet.avancement_actuel}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      Référence: PRJ-{projet.id}
                    </span>

                    <Link 
                      to={`/division/projet/${projet.id}`} 
                      className="group/btn flex items-center gap-3 px-6 py-3.5 bg-slate-950 text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-900/20 transition-all duration-300"
                    >
                      Détails & Bilans
                      <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- EMPTY STATE --- */}
      {!loading && filteredProjets.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
           <CircleDot size={48} className="text-slate-200 mb-6" />
           <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Aucun projet actif dans votre division</p>
        </div>
      )}
    </div>
  );
}