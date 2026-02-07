import { useEffect, useState, useMemo } from "react";
import axiosClient from "../../api/axios";
import { 
  Users2, Mail, Search, Award, ArrowUpRight, 
  UserCircle, Loader2, Info, ChevronRight
} from "lucide-react";

export default function MembresDivision() {
  const [data, setData] = useState({ division: null, users: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosClient.get("/mon-entite-division");
        setData({
          division: { nom: data.nom, acronyme: data.acronyme, chef: data.chef },
          users: data.users || []
        });
      } catch (err) {
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrage optimisé (insensible à la casse et aux espaces)
  const filteredMembres = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return data.users.filter(m =>
      `${m.nom} ${m.prenom}`.toLowerCase().includes(term) ||
      m.specialite?.toLowerCase().includes(term) ||
      m.grade?.toLowerCase().includes(term)
    );
  }, [searchTerm, data.users]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-[0.2em]">
            <span className="w-8 h-[2px] bg-emerald-600"></span>
            Division de Recherche
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic">
            {data.division?.acronyme}
            <span className="block text-xl md:text-2xl not-italic font-medium text-slate-400 mt-2 normal-case tracking-normal">
              {data.division?.nom}
            </span>
          </h1>
        </div>

        <div className="w-full lg:w-96 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-900 font-bold text-xs">
              {data.division?.chef?.nom[0]}{data.division?.chef?.prenom[0]}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Chef de Division</p>
              <p className="text-sm font-bold text-slate-900">{data.division?.chef?.prenom} {data.division?.chef?.nom}</p>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Nom, grade, spécialité..." 
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredMembres.map((m) => (
          <div key={m.id} className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500">
            
            <div className="flex justify-between items-start mb-8">
              <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-xl group-hover:scale-110 transition-transform duration-500">
                {m.nom[0]}
              </div>
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {m.grade}
              </span>
            </div>

            <div className="space-y-1 mb-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tight">
                {m.nom} <span className="text-emerald-500">{m.prenom}</span>
              </h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{m.specialite || 'Chercheur'}</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-8 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-colors">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail size={16} className="text-emerald-600" />
                <span className="text-xs font-bold truncate">{m.email}</span>
              </div>
            </div>

            <button 
              onClick={() => window.location.href = `mailto:${m.email}`}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-emerald-600/20"
            >
              Contact Direct <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>

      {filteredMembres.length === 0 && (
        <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Info className="mx-auto mb-4 text-slate-300" size={40} />
          <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Aucun résultat trouvé</p>
        </div>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
      <span className="font-black text-[10px] uppercase tracking-[0.3em]">Initialisation du répertoire...</span>
    </div>
  );
}