import { useState } from "react";
import axiosClient from "../../api/axios";
import { X, Upload, Loader2, FileCheck, Info } from "lucide-react";

export default function LivrableModal({ tacheId, tacheNom, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    type: "Rapport_Technique",
    fichier: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations de base
    if (!formData.fichier) return alert("Veuillez sélectionner un fichier");
    if (!formData.titre.trim()) return alert("Veuillez donner un titre au document");

    setLoading(true);
    
    // Préparation des données pour l'upload (Multipart/Form-Data)
    const data = new FormData();
    data.append("titre", formData.titre);
    data.append("type", formData.type);
    data.append("fichier", formData.fichier); // L'objet File
    data.append("tache_id", tacheId); // Clé requise par votre backend storeFromTache

    try {
      // Appel à la route définie dans votre api.php
      await axiosClient.post('/livrables/store-tache', data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Succès : rafraîchir la liste parente et fermer
      if (onRefresh) onRefresh(); 
      onClose();
    } catch (err) {
      console.error("Erreur d'upload:", err);
      const errorMsg = err.response?.data?.message || "Erreur lors du dépôt du fichier";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden border border-white/20">
        
        {/* Header du Modal */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter leading-none">Déposer un livrable</h3>
            {tacheNom && (
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-2">
                Mission : {tacheNom}
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-400 hover:text-slate-600"
          >
            <X size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Note informative */}
          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50">
            <Info size={18} className="text-indigo-500 shrink-0" />
            <p className="text-[11px] text-indigo-700 leading-tight font-medium">
              Ce document sera lié à l'historique de cette tâche et archivé dans le dossier du projet.
            </p>
          </div>

          {/* Champ Titre */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Titre explicite du document
            </label>
            <input 
              required
              type="text"
              placeholder="Ex: Rapport d'analyse de données - Phase 1"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-2xl outline-none font-bold transition-all text-slate-700"
              value={formData.titre}
              onChange={e => setFormData({...formData, titre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Champ Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type de contenu</label>
              <select 
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 cursor-pointer appearance-none focus:ring-2 focus:ring-indigo-500/10"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Rapport_Technique">Rapport Technique</option>
                <option value="Code_Source">Code Source</option>
                <option value="Manuel_Utilisateur">Manuel Utilisateur</option>
                <option value="Synthese_Biblio">Synthèse</option>
                <option value="Expertise">Expertise</option>
              </select>
            </div>
            
            {/* Bouton de sélection de fichier */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fichier</label>
              <label className="w-full flex items-center justify-center h-[56px] px-5 bg-indigo-50 text-indigo-600 rounded-2xl cursor-pointer hover:bg-indigo-100 transition-all font-black text-[10px] uppercase tracking-widest border-2 border-indigo-100 border-dashed overflow-hidden">
                <Upload size={16} className="mr-2 shrink-0" />
                <span className="truncate">
                  {formData.fichier ? formData.fichier.name : "Choisir"}
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.zip,.rar,.doc,.docx"
                  onChange={e => setFormData({...formData, fichier: e.target.files[0]})} 
                />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20}/> 
                  <span>Traitement...</span>
                </>
              ) : (
                <>
                  <FileCheck size={18}/>
                  <span>Valider le dépôt</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}