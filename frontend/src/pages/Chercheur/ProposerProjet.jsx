import { useState } from "react";
import { 
  Send, FileText, Users, Calendar,
  Info, Upload, CheckCircle2, AlertCircle
} from "lucide-react";

export default function ProposerProjet() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation d'envoi API
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-100">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Proposition envoyée !</h2>
        <p className="text-slate-500 mt-2 text-center max-w-sm">
          Votre projet a été transmis à la commission scientifique. Vous recevrez une notification après examen.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all"
        >
          Nouvelle proposition
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Soumettre un nouveau projet</h1>
        <p className="text-slate-500 text-sm">Veuillez remplir les détails techniques de votre recherche.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne de gauche : Champs principaux */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            
            {/* Titre du projet */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre Complet du Projet</label>
              <input 
                required
                type="text" 
                placeholder="Ex: Analyse de la résilience urbaine face aux séismes..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-bold text-slate-700"
              />
            </div>

            {/* Résumé */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Résumé / Objectifs</label>
              <textarea 
                rows="5"
                placeholder="Décrivez brièvement les objectifs de la recherche..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium text-slate-600"
              ></textarea>
            </div>

            {/* Grid Budget / Durée */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type de financement</label>
                <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700">
                  <option>PRFU</option>
                  <option>PNR</option>
                  <option>Projet Interne</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Durée estimée (mois)</label>
                <input type="number" placeholder="24" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" />
              </div>
            </div>
          </div>

          {/* Upload de fichier */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              <Upload size={18} className="text-indigo-500" /> Document de recherche (PDF)
            </h3>
            <div className="border-2 border-dashed border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <p className="text-xs font-bold text-slate-500">Glissez votre plan de travail ici</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase">Max 10MB • Format PDF uniquement</p>
            </div>
          </div>
        </div>

        {/* Colonne de droite : Info / Sidebar */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
            <Info className="mb-4 opacity-50" size={32} />
            <h3 className="font-black text-lg mb-2 leading-tight">Consignes de soumission</h3>
            <ul className="text-xs text-indigo-100 space-y-3 font-medium">
              <li className="flex gap-2"><span>•</span> Vérifiez que tous les membres de l'équipe sont inscrits.</li>
              <li className="flex gap-2"><span>•</span> Le document PDF doit inclure le budget détaillé.</li>
              <li className="flex gap-2"><span>•</span> La validation peut prendre jusqu'à 15 jours ouvrables.</li>
            </ul>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
            {loading ? "Envoi en cours..." : "Soumettre le projet"}
          </button>
        </div>

      </form>
    </div>
  );
}