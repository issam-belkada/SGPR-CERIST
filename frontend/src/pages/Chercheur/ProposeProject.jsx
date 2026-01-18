import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Send, AlertCircle, Loader2, ChevronLeft } from "lucide-react";

export default function ProposeProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    titre: "",
    resume: "",
    objectifs: "",
    date_debut_prevue: "",
    duree_mois: 12
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await axiosClient.post("/projets", formData);
      navigate("/chercheur/mes-projets");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else if (err.response?.status === 403) {
        alert(err.response.data.message); // Cas où le chercheur a déjà un projet actif
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition text-sm font-medium">
        <ChevronLeft size={20} /> Retour
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-xl font-bold text-slate-800">Soumettre une nouvelle proposition</h1>
          <p className="text-slate-500 text-sm">Ce projet sera soumis à la validation de votre chef de division.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Titre du Projet</label>
            <input 
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Entrez le titre complet du projet de recherche..."
              value={formData.titre}
              onChange={(e) => setFormData({...formData, titre: e.target.value})}
            />
            {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Résumé / Contexte</label>
            <textarea 
              rows="4"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Décrivez brièvement le projet..."
              value={formData.resume}
              onChange={(e) => setFormData({...formData, resume: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Objectifs Scientifiques</label>
            <textarea 
              rows="3"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Quels sont les résultats attendus ?"
              value={formData.objectifs}
              onChange={(e) => setFormData({...formData, objectifs: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Date de début souhaitée</label>
              <input 
                type="date"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.date_debut_prevue}
                onChange={(e) => setFormData({...formData, date_debut_prevue: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Durée (en mois)</label>
              <input 
                type="number"
                min="6" max="60"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.duree_mois}
                onChange={(e) => setFormData({...formData, duree_mois: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Envoyer la proposition</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}