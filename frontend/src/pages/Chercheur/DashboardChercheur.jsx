import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { 
  FolderRoot, CheckSquare, Clock, ArrowUpRight, 
  FileText, Activity, Zap, ChevronRight, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardChercheur() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // En production, vous pouvez créer une route API unique /chercheur-stats
        const resStats = await axiosClient.get("/chercheur-stats");
        const resTasks = await axiosClient.get("/mes-taches?limit=5");
        setStats(resStats.data);
        setRecentTasks(resTasks.data);
      } catch (err) {
        console.error("Erreur Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* --- SALUTATIONS --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vue d'ensemble</h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">Bon retour ! Voici ce qui nécessite votre attention aujourd'hui.</p>
        </div>
        <div className="flex bg-indigo-50 px-4 py-2 rounded-2xl items-center gap-3">
           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
             Session active: {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
           </span>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Projets Actifs", value: stats?.projets_count || 0, icon: <FolderRoot />, color: "bg-blue-500" },
          { label: "Tâches à faire", value: stats?.taches_count || 0, icon: <CheckSquare />, color: "bg-amber-500" },
          { label: "Livrables déposés", value: stats?.livrables_count || 0, icon: <FileText />, color: "bg-emerald-500" },
          { label: "Heures estimées", value: stats?.total_hours || "40h", icon: <Clock />, color: "bg-indigo-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
             <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-slate-100`}>
                {stat.icon}
             </div>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
             <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- TÂCHES URGENTES --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="font-black text-slate-800 flex items-center gap-2">
                 <Activity size={20} className="text-indigo-500" /> Vos prochaines tâches
               </h3>
               <Link to="/chercheur/mes-taches" className="text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                 Tout voir
               </Link>
            </div>
            
            <div className="space-y-3">
              {recentTasks.slice(0, 4).map(tache => (
                <div key={tache.id} className="group flex items-center justify-between p-5 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm rounded-[1.8rem] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-slate-200 group-hover:bg-indigo-500 rounded-full transition-colors" />
                    <div>
                      <p className="font-black text-slate-800 text-sm leading-none">{tache.nom}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{tache.work_package?.projet?.titre?.substring(0, 40)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <p className="text-[9px] font-black text-slate-300 uppercase">Échéance</p>
                      <p className="text-[10px] font-black text-slate-600">{tache.date_fin}</p>
                    </div>
                    <Link to={`/chercheur/projet/${tache.work_package?.projet_id}`} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                      <ArrowUpRight size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- CARTE D'ACTION RAPIDE --- */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden group">
            <Zap className="absolute -right-4 -top-4 text-white/5 w-32 h-32 group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-xl font-black mb-4 relative z-10 leading-tight">Envie de lancer un nouveau projet ?</h3>
            <p className="text-slate-400 text-xs font-medium mb-8 relative z-10 leading-relaxed">
              Soumettez votre idée de recherche à la commission scientifique directement via notre plateforme.
            </p>
            <Link 
              to="/chercheur/proposer-projet" 
              className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest inline-flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all relative z-10"
            >
              Soumettre <ChevronRight size={14} />
            </Link>
          </div>

          <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-xl shadow-indigo-100">
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                 <Activity size={20} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Productivité</span>
             </div>
             <p className="text-2xl font-black italic">"Le savoir est la seule matière qui s'accroît quand on la partage."</p>
             <p className="text-[10px] font-bold text-indigo-200 mt-4">— Socrate</p>
          </div>
        </div>

      </div>
    </div>
  );
}