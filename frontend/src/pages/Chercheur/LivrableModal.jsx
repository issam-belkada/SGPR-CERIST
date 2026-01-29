import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { X, Upload, Loader2, FileCheck, Info, AlertTriangle, Lock } from "lucide-react";

const LIVRABLE_TYPES = [
  { value: "Rapport_Technique", label: "Rapport Technique" },
  { value: "Manuel_Utilisateur", label: "Manuel Utilisateur" },
  { value: "Code_Source", label: "Code Source" },
  { value: "Synthese_Biblio", label: "Synthèse Bibliographique" },
  { value: "Expertise", label: "Expertise" },
  { value: "Logiciel_Code", label: "Logiciel / Code" },
  { value: "Prototype", label: "Prototype" },
  { value: "Publication", label: "Publication" },
  { value: "Brevet", label: "Brevet" },
  { value: "Autre", label: "Autre" },
];

export default function LivrableModal({ tacheId, tacheNom, onClose, onRefresh, editLivrable }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    type: "Rapport_Technique",
    fichier: null,
  });

  // Détermine si on est en mode "remplissage d'un livrable imposé"
  const isReadOnly = !!editLivrable;

  useEffect(() => {
    if (editLivrable) {
      setFormData((prev) => ({
        ...prev,
        titre: editLivrable.titre || "",
        type: editLivrable.type || "Rapport_Technique",
      }));
    }
  }, [editLivrable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fichier) return alert("Veuillez sélectionner un fichier");

    setLoading(true);
    const data = new FormData();
    data.append("fichier", formData.fichier);
    
    // Pour la route upload-missing, on n'a besoin que du fichier, 
    // mais on garde la structure pour le store classique
    if (!isReadOnly) {
        data.append("titre", formData.titre);
        data.append("type", formData.type);
        data.append("tache_id", tacheId);
    }

    try {
      const url = isReadOnly 
        ? `/livrables/${editLivrable.id}/upload-missing`
        : '/livrables/store-tache';

      await axiosClient.post(url, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (onRefresh) onRefresh(); 
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors du dépôt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden border border-white/20">
        
        <div className={`p-8 border-b border-slate-50 flex justify-between items-center ${isReadOnly ? 'bg-amber-50/50' : 'bg-slate-50/50'}`}>
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
              {isReadOnly ? "Compléter le livrable" : "Nouveau livrable"}
            </h3>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-2">
              Mission : {tacheNom}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors">
            <X size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {isReadOnly && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-700 leading-tight">
                Les informations ci-dessous ont été fixées par le <strong>Chef de projet</strong>. Vous pouvez uniquement joindre le fichier correspondant.
              </p>
            </div>
          )}

          {/* Champ Titre - Désactivé si isReadOnly */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                Titre du livrable {isReadOnly && <Lock size={12}/>}
            </label>
            <input 
              required
              disabled={isReadOnly}
              type="text"
              className={`w-full px-5 py-4 border-2 border-transparent rounded-2xl outline-none font-bold transition-all ${isReadOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 focus:border-indigo-500/20 focus:bg-white text-slate-700'}`}
              value={formData.titre}
              onChange={e => setFormData({...formData, titre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Champ Type - Désactivé si isReadOnly */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                Catégorie {isReadOnly && <Lock size={12}/>}
              </label>
              <select 
                disabled={isReadOnly}
                className={`w-full px-5 py-4 border-none rounded-2xl font-bold cursor-pointer focus:ring-2 focus:ring-indigo-500/10 ${isReadOnly ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50 text-slate-600'}`}
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                {LIVRABLE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            {/* Zone d'upload - Toujours active */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fichier (Max 20Mo)</label>
              <label className={`w-full flex items-center justify-center h-[56px] px-5 rounded-2xl cursor-pointer transition-all font-black text-[10px] uppercase border-2 border-dashed overflow-hidden ${formData.fichier ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'}`}>
                <Upload size={16} className="mr-2 shrink-0" />
                <span className="truncate">{formData.fichier ? formData.fichier.name : "Choisir le fichier"}</span>
                <input type="file" className="hidden" onChange={e => setFormData({...formData, fichier: e.target.files[0]})} />
              </label>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`flex-[2] py-4 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${isReadOnly ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-indigo-600'}`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20}/>
              ) : (
                <>
                  <FileCheck size={18}/>
                  <span>{isReadOnly ? "Finaliser l'envoi" : "Enregistrer"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}