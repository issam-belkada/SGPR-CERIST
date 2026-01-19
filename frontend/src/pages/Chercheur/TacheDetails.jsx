import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { 
  ArrowLeft, 
  FilePlus, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  Loader2, 
  Trash2, 
  User,
  FileText,
  Layout,
  Briefcase,
  Play,
  RotateCcw
} from "lucide-react";
import LivrableModal from "./LivrableModal"; 

export default function TacheDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tache, setTache] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const { data } = await axiosClient.get(`/taches/${id}`);
      setTache(data);
    } catch (err) {
      console.error("Erreur lors de la récupération :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  // Logique de changement de statut adaptée à vos règles métier
  const handleToggleStatus = async () => {
    setUpdatingStatus(true);
    
    let nouveauStatut = "";
    if (tache.etat === "À faire") {
      nouveauStatut = "En cours";
    } else if (tache.etat === "En cours") {
      nouveauStatut = "Terminé";
    } else if (tache.etat === "Terminé") {
      nouveauStatut = "En cours"; // Retour possible à "En cours" mais JAMAIS à "À faire"
    }

    try {
      await axiosClient.post(`/taches/${id}/update-status`, { 
        etat: nouveauStatut 
      });
      fetchData(); 
    } catch (err) {
      alert("Erreur lors du changement de statut");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDownload = async (livrableId, originalTitle) => {
    setDownloadingId(livrableId);
    try {
      const response = await axiosClient.get(`/livrables/${livrableId}/download`, { 
        responseType: 'blob' 
      });
      const contentType = response.headers['content-type'];
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      let fileName = originalTitle.includes('.') ? originalTitle : `${originalTitle}.pdf`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erreur lors du téléchargement");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Chargement des données...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-800 transition-colors">
          <ArrowLeft size={16}/> Retour au projet
        </button>
        
        <div className="flex gap-3 w-full md:w-auto">
          {/* Bouton de statut dynamique */}
          <button 
            onClick={handleToggleStatus}
            disabled={updatingStatus}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
              tache.etat === 'À faire' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' 
                : tache.etat === 'En cours'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'
                : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-100'
            }`}
          >
            {updatingStatus ? (
              <Loader2 className="animate-spin" size={18}/>
            ) : (
              tache.etat === 'À faire' ? <Play size={18}/> : 
              tache.etat === 'En cours' ? <CheckCircle2 size={18}/> : <RotateCcw size={18}/>
            )}
            
            {tache.etat === 'À faire' && "Lancer la tâche"}
            {tache.etat === 'En cours' && "Terminer la tâche"}
            {tache.etat === 'Terminé' && "Réouvrir la tâche"}
          </button>

          <button 
            onClick={() => setShowModal(true)} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
          >
            <FilePlus size={18}/> Nouveau Livrable
          </button>
        </div>
      </div>

      {/* Grid d'informations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Gauche : Détails Principaux */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2 h-full ${
              tache.etat === 'Terminé' ? 'bg-emerald-500' : 
              tache.etat === 'En cours' ? 'bg-indigo-500' : 'bg-slate-300'
            }`}></div>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                ID: #{tache.id}
              </span>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                tache.etat === 'Terminé' ? 'bg-emerald-100 text-emerald-600' : 
                tache.etat === 'En cours' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {tache.etat}
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{tache.nom}</h1>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">{tache.description || "Aucune description fournie pour cette tâche."}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center gap-3 mb-3 text-indigo-500">
                    <Calendar size={18}/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Période d'exécution</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">Du {new Date(tache.date_debut).toLocaleDateString()} au {new Date(tache.date_fin).toLocaleDateString()}</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center gap-3 mb-3 text-indigo-500">
                    <User size={18}/>
                    <span className="text-[10px] font-black uppercase tracking-widest">Responsable</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{tache.responsable?.prenom} {tache.responsable?.nom}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{tache.responsable?.email}</p>
               </div>
            </div>
          </div>

          {/* Section Livrables */}
          <div className="space-y-4">
            <h3 className="px-4 font-black text-slate-800 text-xs uppercase tracking-[0.2em]">Documents Déposés ({tache.livrables?.length})</h3>
            {tache.livrables?.length > 0 ? (
              <div className="grid gap-3">
                {tache.livrables.map(l => (
                  <div key={l.id} className="flex items-center justify-between p-5 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 rounded-2xl transition-colors">
                        <FileText size={24}/>
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm mb-1">{l.titre}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Le {new Date(l.date_depot).toLocaleDateString()} par {l.depositaire?.prenom} {l.depositaire?.nom}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload(l.id, l.titre)} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <Download size={20}/>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Aucun document disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Colonne Droite : Contexte WP & Projet */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-indigo-500">
              <Layout size={20}/>
              <h4 className="font-black text-xs uppercase tracking-widest">Lot de Travail (WP)</h4>
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase mb-1">{tache.work_package?.code_wp}</p>
              <p className="font-bold text-slate-800 leading-tight">{tache.work_package?.titre}</p>
            </div>
            <div className="pt-4 border-t border-slate-50">
               <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Objectifs du lot</p>
               <p className="text-xs text-slate-600 leading-relaxed italic">"{tache.work_package?.objectifs}"</p>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-indigo-400">
              <Briefcase size={20}/>
              <h4 className="font-black text-xs uppercase tracking-widest">Projet Parent</h4>
            </div>
            <p className="font-black text-lg leading-tight tracking-tight">{tache.work_package?.projet?.titre}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2 py-1 bg-white/10 rounded text-[9px] font-black uppercase">{tache.work_package?.projet?.type}</span>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-black uppercase">{tache.work_package?.projet?.nature}</span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <LivrableModal 
          tacheId={tache.id} 
          tacheNom={tache.nom}
          onClose={() => setShowModal(false)} 
          onRefresh={fetchData} 
        />
      )}
    </div>
  );
}