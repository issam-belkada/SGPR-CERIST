import { useState } from "react";
import axiosClient from "../../api/axios";
import { X, Upload, Loader2, FileCheck } from "lucide-react";

export default function LivrableModal({ projetId, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titre: "",
    type: "Rapport_Technique",
    fichier: null,
    tache_id: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Utilisation de FormData pour l'envoi de fichier
    const data = new FormData();
    data.append("titre", formData.titre);
    data.append("type", formData.type);
    data.append("fichier", formData.fichier);
    if (formData.tache_id) data.append("tache_id", formData.tache_id);

    try {
      await axiosClient.post(`/projets/${projetId}/livrables`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onRefresh(); // Recharge la liste dans le parent
      onClose();
    } catch (err) {
      alert("Erreur lors du dépôt : " + (err.response?.data?.message || "Vérifiez le format"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Nouveau Livrable</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre du document</label>
            <input 
              required
              className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold"
              onChange={e => setFormData({...formData, titre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
              <select 
                className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl font-bold"
                onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="Rapport_Technique">Rapport Technique</option>
                <option value="Code_Source">Code Source</option>
                <option value="Manuel_Utilisateur">Manuel Utilisateur</option>
                <option value="Synthese_Biblio">Synthèse</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fichier (PDF, ZIP...)</label>
              <label className="w-full flex items-center justify-center px-5 py-3 bg-indigo-50 text-indigo-600 rounded-2xl cursor-pointer hover:bg-indigo-600 hover:text-white transition-all font-bold text-xs truncate">
                <Upload size={16} className="mr-2" />
                {formData.fichier ? formData.fichier.name : "Choisir"}
                <input type="file" className="hidden" onChange={e => setFormData({...formData, fichier: e.target.files[0]})} />
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : <FileCheck size={18}/>}
            Déposer le livrable
          </button>
        </form>
      </div>
    </div>
  );
}