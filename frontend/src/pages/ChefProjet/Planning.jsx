import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axios";
import { 
  Plus, Layers, CheckSquare, UserPlus, 
  Calendar, ChevronDown, ChevronRight, Loader2 
} from "lucide-react";

export default function ProjectPlanning() {
  const { id } = useParams(); // ID du projet
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeWp, setActiveWp] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const { data } = await axiosClient.get(`/projets/${id}`);
      setProject(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addWorkPackage = async () => {
    const nom = window.prompt("Nom du nouveau Work Package (ex: Étude de l'existant) :");
    if (!nom) return;
    try {
      await axiosClient.post(`/projets/${id}/work-packages`, { nom });
      fetchProjectDetails();
    } catch (error) {
      alert("Erreur lors de l'ajout du WP");
    }
  };

  const addTask = async (wpId) => {
    const titre = window.prompt("Titre de la tâche :");
    if (!titre) return;
    try {
      await axiosClient.post(`/work-packages/${wpId}/taches`, { 
        titre,
        description: "À définir",
        date_fin_prevue: project.date_fin_prevue // Par défaut
      });
      fetchProjectDetails();
    } catch (error) {
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{project?.titre}</h1>
          <p className="text-slate-500 text-sm italic">Planification des Work Packages et Tâches</p>
        </div>
        <button 
          onClick={addWorkPackage}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
        >
          <Plus size={18} /> Ajouter un WP
        </button>
      </div>

      <div className="grid gap-4">
        {project?.work_packages?.length > 0 ? project.work_packages.map((wp) => (
          <div key={wp.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Header du WP */}
            <div 
              className="p-4 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition"
              onClick={() => setActiveWp(activeWp === wp.id ? null : wp.id)}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Layers size={18} />
                </div>
                <h3 className="font-bold text-slate-700">{wp.nom}</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase">{wp.taches?.length || 0} Tâches</span>
                {activeWp === wp.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            </div>

            {/* Liste des tâches du WP (Accordéon) */}
            {activeWp === wp.id && (
              <div className="p-4 border-t border-slate-100 space-y-2 bg-white">
                {wp.taches?.map((tache) => (
                  <div key={tache.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-indigo-200 transition group">
                    <div className="flex items-center gap-3">
                      <CheckSquare size={16} className="text-slate-300" />
                      <span className="text-sm font-medium text-slate-600">{tache.titre}</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Assigner</button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => addTask(wp.id)}
                  className="w-full py-2 mt-2 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-sm hover:border-indigo-200 hover:text-indigo-400 transition flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Nouvelle tâche dans {wp.nom}
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">Aucun Work Package défini. Commencez par en créer un.</p>
          </div>
        )}
      </div>
    </div>
  );
} 
