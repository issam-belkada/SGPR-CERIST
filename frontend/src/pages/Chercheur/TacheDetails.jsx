import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { 
  ArrowLeft, FilePlus, Calendar, CheckCircle2, 
  Download, Loader2, User, FileText, Layout, 
  Briefcase, Play, RotateCcw, AlertCircle, Lock, UploadCloud
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
  
  const userString = localStorage.getItem('USER');
  const currentUser = userString ? JSON.parse(userString) : null;

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(`/taches/${id}`);
      setTache(data);
    } catch (err) {
      console.error("Erreur lors de la récupération :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, [id]);

  // --- LOGIQUE DE SÉCURITÉ ET ÉTATS ---
  const myId = currentUser?.id ? String(currentUser.id) : null;
  const taskOwnerId = tache?.responsable_id ? String(tache.responsable_id) : (tache?.responsable?.id ? String(tache.responsable.id) : null);
  
  const isResponsable = myId && taskOwnerId && myId === taskOwnerId;
  const isProjectActive = tache?.work_package?.projet?.statut === 'enCours';
  const isTerminee = tache?.etat === 'Terminé';
  const isEnCours = tache?.etat === 'En cours';

  // Détection des livrables "placeholders" créés à la naissance de la tâche
  const livrablesManquants = tache?.livrables?.filter(l => l.fichier_path === 'waiting_upload') || [];
  const hasMissingLivrables = livrablesManquants.length > 0;

  const handleToggleStatus = async () => {
    if (!isResponsable || !isProjectActive) return;

    let nouveauStatut = "";
    
    if (tache.etat === "A faire") {
        nouveauStatut = "En cours";
    } else if (tache.etat === "En cours") {
        // Blocage si des livrables pré-créés n'ont pas encore de fichier
        if (hasMissingLivrables) {
            alert(`Action refusée : Vous devez uploader les ${livrablesManquants.length} livrable(s) obligatoire(s) avant de terminer cette tâche.`);
            return;
        }
        nouveauStatut = "Terminé";
    } else {
        nouveauStatut = "En cours";
    }

    setUpdatingStatus(true);
    try {
      await axiosClient.post(`/taches/${id}/update-status`, { etat: nouveauStatut });
      fetchData(); 
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors du changement de statut");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDownload = async (livrableId, originalTitle) => {
    setDownloadingId(livrableId);
    try {
      const response = await axiosClient.get(`/livrables/${livrableId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalTitle.includes('.') ? originalTitle : `${originalTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Erreur lors du téléchargement");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Chargement...</p>
    </div>
  );

  if (!tache) return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl text-center shadow-xl border border-slate-100">
      <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
      <h2 className="text-xl font-black text-slate-800 uppercase">Tâche introuvable</h2>
      <button onClick={() => navigate(-1)} className="w-full mt-6 py-3 bg-slate-900 text-white rounded-2xl font-bold uppercase text-xs">Retour</button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16}/> Retour
        </button>
        
        <div className="flex gap-3 w-full md:w-auto">
          {isProjectActive ? (
            isResponsable ? (
              <>
                <button 
                  onClick={handleToggleStatus}
                  disabled={updatingStatus}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                    tache.etat === 'A faire' ? 'bg-indigo-600 text-white' : 
                    tache.etat === 'En cours' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}
                >
                  {updatingStatus ? <Loader2 className="animate-spin" size={18}/> : 
                    (tache.etat === 'A faire' ? <Play size={18}/> : 
                     tache.etat === 'En cours' ? <CheckCircle2 size={18}/> : <RotateCcw size={18}/>)
                  }
                  {tache.etat === 'A faire' && "Lancer la tâche"}
                  {tache.etat === 'En cours' && "Terminer la tâche"}
                  {tache.etat === 'Terminé' && "Réouvrir la tâche"}
                </button>

                {isEnCours && (
                    <button 
                        onClick={() => setShowModal(true)} 
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
                    >
                        <FilePlus size={18}/> Livrable imprévu
                    </button>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3 px-6 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500">
                <Lock size={16} />
                <span className="font-black text-[10px] uppercase tracking-widest">Consultation uniquement</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 font-black text-[10px] uppercase">
              <AlertCircle size={18} /> Projet {tache?.work_package?.projet?.statut}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2 h-full ${isTerminee ? 'bg-emerald-500' : isEnCours ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isTerminee ? 'bg-emerald-100 text-emerald-600' : isEnCours ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                {tache.etat}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4">{tache.nom}</h1>
            <p className="text-slate-500 font-medium mb-8">{tache.description || "Aucune description."}</p>
            
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 inline-flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600"><User size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsable</p>
                    <p className="text-sm font-bold text-slate-700">{tache.responsable?.prenom} {tache.responsable?.nom}</p>
                 </div>
            </div>
          </div>

          {/* Liste des Livrables */}
          <div className="space-y-4">
            <h3 className="px-4 font-black text-slate-800 text-xs uppercase tracking-widest flex items-center justify-between">
              <span>Livrables ({tache.livrables?.length || 0})</span>
              {hasMissingLivrables && <span className="text-amber-600 text-[10px] bg-amber-50 px-3 py-1 rounded-full border border-amber-100 animate-pulse">Action requise : {livrablesManquants.length} fichier(s) à uploader</span>}
            </h3>
            
            {tache.livrables && tache.livrables.length > 0 ? (
              <div className="grid gap-3">
                {tache.livrables.map(l => {
                  const isWaiting = l.fichier_path === 'waiting_upload';
                  return (
                    <div key={l.id} className={`flex items-center justify-between p-5 rounded-[2rem] border transition-all ${isWaiting ? 'bg-amber-50/30 border-amber-200 border-dashed' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl ${isWaiting ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                          <FileText size={24}/>
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm mb-1">
                            {l.titre}
                          </p>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-md">{l.type.replace('_', ' ')}</span>
                             <span className={`text-[9px] font-black uppercase ${isWaiting ? 'text-amber-500' : 'text-emerald-500'}`}>
                               • {isWaiting ? "En attente de fichier" : "Complété"}
                             </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {isWaiting ? (
                          isResponsable && isEnCours && (
                            <button 
                              onClick={() => setShowModal({ specificLivrable: l })} 
                              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-amber-600 shadow-md transition-all active:scale-95"
                            >
                              <UploadCloud size={16}/> Uploader
                            </button>
                          )
                        ) : (
                          <button 
                            onClick={() => handleDownload(l.id, l.titre)} 
                            disabled={downloadingId === l.id}
                            className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          >
                            {downloadingId === l.id ? <Loader2 size={20} className="animate-spin" /> : <Download size={20}/>}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-10 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Aucun livrable défini</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-indigo-500"><Layout size={20}/><h4 className="font-black text-xs uppercase tracking-widest">Work Package</h4></div>
            <p className="font-bold text-slate-800 text-sm">{tache.work_package?.titre}</p>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-400"><Briefcase size={20}/><h4 className="font-black text-xs uppercase tracking-widest">Projet</h4></div>
            <p className="font-black text-lg tracking-tight leading-tight">{tache.work_package?.projet?.titre}</p>
          </div>
        </div>
      </div>

      {showModal && (
        <LivrableModal 
          tacheId={tache.id} 
          tacheNom={tache.nom}
          // Si on clique sur "Uploader", on passe l'objet livrable existant au modal
          editLivrable={showModal.specificLivrable || null} 
          onClose={() => setShowModal(false)} 
          onRefresh={fetchData} 
        />
      )}
    </div>
  );
}