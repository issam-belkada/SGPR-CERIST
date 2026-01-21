import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { 
  Users2, Mail, LayoutGrid, CheckCircle2, 
  Clock, ArrowUpRight, Search, Filter,
  TrendingUp, Award, Zap
} from "lucide-react";

export default function MembresDivision() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const { data } = await axiosClient.get("/mon-entite-division");
        setMembres(data.users || []);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchMembres();
  }, []);

  const filteredMembres = membres.filter(m => 
    m.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* --- ENTÊTE & RECHERCHE --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <Users2 size={12} className="text-emerald-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Ressources Humaines</span>
          </div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tighter italic leading-none uppercase">
            Équipe de <span className="text-emerald-600">Recherche</span>
          </h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-tight">Gestion des effectifs et suivi des performances</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un chercheur..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm w-full md:w-80 focus:ring-4 focus:ring-emerald-50 outline-none transition-all font-bold shadow-sm"
          />
        </div>
      </div>

      {/* --- GRILLE DES MEMBRES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse" />
          ))
        ) : (
          filteredMembres.map((membre) => (
            <div key={membre.id} className="group relative bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500">
              
              {/* Badge Grade */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-[8px] font-black uppercase text-slate-400 tracking-widest group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                {membre.grade || "Chercheur"}
              </div>

              {/* Profil Info */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-slate-950 rounded-3xl flex items-center justify-center text-xl font-black text-white shadow-xl group-hover:rotate-6 transition-transform">
                  {membre.nom?.charAt(0)}{membre.prenom?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-950 text-lg leading-tight uppercase truncate">
                    {membre.nom} <br/> {membre.prenom}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-emerald-600 italic font-bold text-xs uppercase tracking-tighter">
                     <Award size={12} /> Expert Rank A
                  </div>
                </div>
              </div>

              {/* Stats Bento Style */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-50 flex flex-col items-center text-center">
                   <LayoutGrid size={16} className="text-slate-400 mb-2" />
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Projets</p>
                   <p className="text-lg font-black text-slate-900 italic">0{Math.floor(Math.random() * 5) + 1}</p>
                </div>
                <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-50 flex flex-col items-center text-center">
                   <TrendingUp size={16} className="text-emerald-500 mb-2" />
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                   <p className="text-lg font-black text-slate-900 italic">8.5</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <a 
                  href={`mailto:${membre.email}`}
                  className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-950 hover:text-white transition-all"
                >
                  <Mail size={14} /> Envoyer Email
                </a>
                <button className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                   <ArrowUpRight size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- QUICK ACTION SECTION --- */}
      <div className="bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/20 to-transparent"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
               <h2 className="text-3xl font-black tracking-tighter italic">Besoin de réorganiser l'équipe ?</h2>
               <p className="text-slate-400 font-medium max-w-md">Vous pouvez assigner des membres à de nouveaux projets ou modifier les responsabilités de chacun.</p>
            </div>
            <button className="px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95">
               Gérer les affectations
            </button>
         </div>
      </div>

    </div>
  );
}