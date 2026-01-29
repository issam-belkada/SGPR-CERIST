import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { 
  FolderRoot, CheckSquare, Clock, ArrowUpRight, 
  FileText, Activity, Zap, ChevronRight, Loader2,
  TrendingUp, AlertCircle, Calendar, Target
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardChercheur() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resStats, resTasks] = await Promise.all([
          axiosClient.get("/chercheur-stats"),
          axiosClient.get("/mes-taches")
        ]);
        setStats(resStats.data);
        // On trie les tâches par date de fin la plus proche pour la timeline
        const sortedTasks = resTasks.data.sort((a, b) => new Date(a.date_fin) - new Date(b.date_fin));
        setRecentTasks(sortedTasks);
      } catch (err) {
        console.error("Erreur Dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Initialisation du cockpit...</p>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-sm">Chercheur</span>
            <div className="h-px w-8 bg-slate-200" />
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Système SGPR</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Vue d'ensemble</h1>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
           <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-[1.5rem] flex items-center gap-3">
              <TrendingUp size={18} />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase leading-none">Status</span>
                <span className="text-xs font-bold">Actif sur {stats?.projets_count || 0} projets</span>
              </div>
           </div>
           <div className="pr-6 pl-2 hidden lg:block text-right border-l border-slate-100 ml-2">
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Dernière synchro</p>
              <p className="text-xs font-bold text-slate-700 mt-1">
                {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
              </p>
           </div>
        </div>
      </div>

      {/* --- GRILLE DE STATS PRINCIPALES --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: "Mes Projets", 
            value: stats?.projets_count || 0, 
            icon: <FolderRoot />, 
            color: "bg-indigo-500", 
            trend: "Collaboration active" 
          },
          { 
            label: "Missions", 
            value: stats?.taches_count || 0, 
            icon: <CheckSquare />, 
            color: "bg-amber-500", 
            trend: `${stats?.taches_terminees || 0} terminées` 
          },
          { 
            label: "Livrables", 
            value: stats?.livrables_count || 0, 
            icon: <FileText />, 
            color: "bg-emerald-500", 
            trend: "Documents déposés" 
          },
          { 
            label: "Complétion", 
            value: `${stats?.ratio_completion || 0}%`, 
            icon: <Target />, 
            color: "bg-rose-500", 
            trend: "Objectifs atteints" 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 group relative overflow-hidden">
             <div className="relative z-10">
               <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-6 transform group-hover:rotate-12 transition-transform shadow-lg`}>
                  {stat.icon}
               </div>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
               <h3 className="text-4xl font-black text-slate-900 mt-2">{stat.value}</h3>
               <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-slate-400 italic">
                  <div className="w-1 h-1 rounded-full bg-slate-300" /> {stat.trend}
               </div>
             </div>
             <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform">
                {stat.icon}
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- TIMELINE DES TÂCHES --- */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="font-black text-slate-800 text-xl tracking-tight">Timeline des travaux</h3>
                 <p className="text-slate-400 text-xs font-medium">Vos prochaines échéances prioritaires.</p>
               </div>
               <Link to="/chercheur/mes-taches" className="bg-slate-50 hover:bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                 Voir tout <ChevronRight size={14} />
               </Link>
            </div>
            
            <div className="space-y-4">
              {recentTasks.length > 0 ? recentTasks.slice(0, 5).map((tache) => (
                <div key={tache.id} className="group flex items-center gap-6 p-4 rounded-[2rem] hover:bg-slate-50/80 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex flex-col items-center gap-1 min-w-[50px]">
                    <span className="text-[9px] font-black text-slate-300 uppercase">
                      {new Date(tache.date_fin).toLocaleDateString('fr-FR', {month: 'short'})}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-slate-900 font-black text-sm group-hover:border-indigo-500 transition-colors">
                      {new Date(tache.date_fin).getDate()}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${tache.etat === 'Terminé' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      <p className="font-black text-slate-800 text-sm uppercase tracking-tight truncate max-w-[200px] md:max-w-md">
                        {tache.nom}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[250px]">
                        {tache.work_package?.projet?.titre || 'Projet'}
                      </p>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase tracking-tighter">
                        WP {tache.work_package?.code_wp || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <Link to={`/chercheur/taches/${tache.id}`} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              )) : (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-slate-400 font-bold text-[10px] uppercase">Aucune tâche assignée</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- ACTIONS RAPIDES & INSIGHTS --- */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <Zap className="text-indigo-400 mb-6 group-hover:animate-bounce" size={32} />
            <h3 className="text-2xl font-black mb-4 leading-tight">Nouveau Projet ?</h3>
            <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed italic">
              Proposez une nouvelle thématique de recherche à la direction du CERIST.
            </p>
            <Link 
              to="/chercheur/proposer-projet" 
              className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-slate-950/20"
            >
              Soumettre un projet <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-800 flex items-center gap-2 mb-6 uppercase text-[10px] tracking-widest">
              <Calendar size={14} className="text-indigo-500" /> État des dépôts
            </h4>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-slate-400 uppercase">Progression Globale</p>
                <span className="text-xl font-black text-indigo-600">{stats?.ratio_completion || 0}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-1000" 
                  style={{ width: `${stats?.ratio_completion || 0}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-400 italic">
                Basé sur {stats?.taches_terminees || 0} tâches finalisées sur {stats?.taches_count || 0}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}