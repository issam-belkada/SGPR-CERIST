import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { 
  CheckCircle2, Clock, AlertCircle, 
  Calendar, ArrowRight, Loader2, Filter
} from "lucide-react";

export default function MesTaches() {
  const [taches, setTaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("toutes");

  useEffect(() => {
    fetchTaches();
  }, []);

  const fetchTaches = async () => {
    try {
      const { data } = await axiosClient.get("/mes-taches");
      setTaches(data);
    } catch (err) {
      console.error("Erreur chargement tâches", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axiosClient.put(`/taches/${id}`, { etat: newStatus });
      fetchTaches();
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const filteredTaches = taches.filter(t => 
    filter === "toutes" ? true : t.etat === filter
  );

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Mes Tâches</h1>
          <p className="text-slate-500 text-sm font-medium">Suivi de vos responsabilités sur l'ensemble des projets.</p>
        </div>

        {/* Filtres Rapides */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          {["toutes", "A faire", "En cours", "Terminé"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f === "toutes" ? "Toutes" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTaches.length > 0 ? filteredTaches.map((tache) => (
          <div key={tache.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6">
            
            {/* Statut Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              tache.etat === 'Terminé' ? 'bg-emerald-50 text-emerald-500' : 
              tache.etat === 'En cours' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-300'
            }`}>
              {tache.etat === 'Terminé' ? <CheckCircle2 size={24}/> : <Clock size={24}/>}
            </div>

            {/* Infos Tâche */}
            <div className="flex-1 space-y-1 text-center md:text-left">
              <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">
                {tache.work_package?.projet?.titre || "Projet"}
              </span>
              <h3 className="font-black text-slate-800 text-lg leading-tight">{tache.nom}</h3>
              <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400">
                <span className="text-[10px] font-bold flex items-center gap-1">
                  <Calendar size={12}/> Échéance : {tache.date_fin}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-md">
                  {tache.work_package?.code_wp}
                </span>
              </div>
            </div>

            {/* Actions Rapides */}
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
              <select 
                value={tache.etat}
                onChange={(e) => updateStatus(tache.id, e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"
              >
                <option value="A faire">À faire</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
              </select>
              <div className="w-px h-4 bg-slate-200" />
              <button 
                onClick={() => window.location.href = `/projets/${tache.work_package.projet_id}`}
                className="p-2 hover:bg-white rounded-xl text-indigo-600 transition-all"
                title="Voir le projet"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold italic">Aucune tâche ne correspond à ce filtre.</p>
          </div>
        )}
      </div>
    </div>
  );
}