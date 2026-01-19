import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axios";
import LivrableModal from "./LivrableModal"; // Assurez-vous de créer ce fichier
import { 
  Users, FolderKanban, FileCheck, Info, 
  Calendar, CheckCircle2, Clock, Plus,
  ChevronRight, FileText, User as UserIcon,
  AlertCircle, Loader2, Download, RefreshCw
} from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLivrableModalOpen, setIsLivrableModalOpen] = useState(false);

  // Fonction de récupération des données (mémoïsée pour être réutilisée)
  const fetchProjet = useCallback(async () => {
    try {
      const { data } = await axiosClient.get(`/projets/${id}`);
      setProjet(data);
    } catch (err) {
      console.error("Erreur projet:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjet();
  }, [fetchProjet]);

  // Mise à jour rapide de l'état d'une tâche
  const handleUpdateTaskStatus = async (tacheId, newStatus) => {
    try {
      await axiosClient.put(`/taches/${tacheId}`, { etat: newStatus });
      fetchProjet(); // Rafraîchir les données pour voir les changements
    } catch (err) {
      alert("Erreur: Vous n'avez peut-être pas les droits pour modifier cette tâche.");
    }
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Initialisation des données...</p>
    </div>
  );

  if (!projet) return (
    <div className="bg-red-50 p-8 rounded-[2rem] text-red-600 flex items-center gap-4">
      <AlertCircle /> <p className="font-bold">Projet introuvable.</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                {projet.nature}
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                {projet.type}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 leading-tight">{projet.titre}</h1>
            <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
               <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl">
                 <Calendar size={14} className="text-indigo-500" />
                 <span>{projet.date_debut || "Non démarré"}</span>
                 <ChevronRight size={12} />
                 <span>{projet.date_fin || "Non défini"}</span>
               </div>
               <div className="flex items-center gap-2">
                 <UserIcon size={14} className="text-indigo-500" />
                 <span>Chef: {projet.chef_projet?.nom}</span>
               </div>
            </div>
          </div>
          <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg ${
            projet.statut === 'enCours' ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-slate-800 text-white'
          }`}>
            {projet.statut}
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex gap-10 mt-12 border-b border-slate-50">
          {[
            { id: "overview", label: "Résumé", icon: <Info size={18}/> },
            { id: "team", label: "Équipe", icon: <Users size={18}/> },
            { id: "tasks", label: "Plan de Travail", icon: <FolderKanban size={18}/> },
            { id: "deliverables", label: "Livrables", icon: <FileCheck size={18}/> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-indigo-600"
              }`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[400px]">
        
        {/* Résumé */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-4">Problématique</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{projet.problematique || "Aucun détail fourni."}</p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-4">Objectifs visés</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{projet.objectifs || "Aucun objectif listé."}</p>
              </div>
            </div>
            <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] h-fit">
               <h3 className="font-black text-xs uppercase tracking-widest text-indigo-400 mb-6">Récapitulatif</h3>
               <div className="space-y-4">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-xs text-white/50">Division</span>
                    <span className="text-xs font-black">{projet.division?.acronyme}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-xs text-white/50">Membres</span>
                    <span className="text-xs font-black">{projet.membres?.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/50">Durée Totale</span>
                    <span className="text-xs font-black">{projet.duree_mois} Mois</span>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Équipe */}
        {activeTab === "team" && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm animate-in fade-in">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400">Chercheur</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400">Qualité</th>
                  <th className="px-10 py-5 text-[10px] font-black uppercase text-slate-400">Participation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                {projet.membres?.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/50">
                    <td className="px-10 py-5 flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black">{m.nom.charAt(0)}</div>
                      {m.nom} {m.prenom}
                    </td>
                    <td className="px-10 py-5 uppercase text-[10px] tracking-widest text-slate-400">{m.pivot.qualite}</td>
                    <td className="px-10 py-5 text-indigo-600 font-black">{m.pivot.pourcentage_participation}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Plan de Travail (WPs & Tâches) */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
            {projet.work_packages?.map(wp => (
              <div key={wp.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="px-8 py-5 bg-slate-50 flex justify-between items-center border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase">{wp.code_wp}</span>
                    <h4 className="font-black text-slate-800 tracking-tight">{wp.titre}</h4>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  {wp.taches?.map(tache => (
                    <div key={tache.id} className="flex items-center justify-between p-5 bg-white border border-slate-50 rounded-[1.5rem] hover:border-indigo-100 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${tache.etat === 'Terminé' ? 'bg-emerald-500' : tache.etat === 'En cours' ? 'bg-amber-400 animate-pulse' : 'bg-slate-200'}`} />
                        <div>
                          <p className="text-sm font-black text-slate-800">{tache.nom}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Responsable: {tache.responsable?.nom}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-300 uppercase">Échéance</p>
                          <p className="text-[10px] font-black text-slate-600">{tache.date_fin}</p>
                        </div>
                        {/* Sélecteur d'état rapide */}
                        <select 
                          value={tache.etat}
                          onChange={(e) => handleUpdateTaskStatus(tache.id, e.target.value)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border-none transition-all ${
                            tache.etat === 'Terminé' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                          }`}
                        >
                          <option value="A faire">À faire</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminé">Terminé</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Livrables */}
        {activeTab === "deliverables" && (
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm animate-in fade-in">
            <div className="flex justify-between items-center mb-10">
               <h3 className="font-black text-slate-800">Documents & Livrables</h3>
               <button 
                  onClick={() => setIsLivrableModalOpen(true)}
                  className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all"
                >
                  <Plus size={16} /> Déposer un fichier
               </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projet.livrables?.map(l => (
                <div key={l.id} className="p-6 border border-slate-50 rounded-[2rem] flex flex-col gap-5 hover:border-indigo-100 hover:shadow-lg transition-all group">
                   <div className="flex justify-between items-start">
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                       <FileCheck size={24} />
                     </div>
                     <button className="text-slate-300 hover:text-indigo-600 transition-colors"><Download size={20} /></button>
                   </div>
                   <div>
                     <h5 className="font-black text-slate-800 text-sm line-clamp-1">{l.titre}</h5>
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">{l.type.replace('_', ' ')}</p>
                   </div>
                   <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase">
                     <span>{new Date(l.date_depot).toLocaleDateString()}</span>
                     <span>Par: {l.depositaire?.nom}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE DÉPÔT */}
      {isLivrableModalOpen && (
        <LivrableModal 
          projetId={projet.id} 
          onClose={() => setIsLivrableModalOpen(false)} 
          onRefresh={fetchProjet}
        />
      )}
    </div>
  );
}