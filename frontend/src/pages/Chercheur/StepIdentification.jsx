import { Layers, Clock, Tag } from "lucide-react";

export default function StepIdentification({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
        <span className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">I</span>
        Identification du Projet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Titre Complet du Projet</label>
          <input 
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 font-bold" 
            placeholder="Ex: Analyse des performances des réseaux..." 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Nature (Canevas I.2)</label>
          <select 
            name="nature"
            value={formData.nature}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold appearance-none"
          >
            <option value="Recherche">Recherche</option>
            <option value="Développement">Développement</option>
            <option value="Exploratoire">Exploratoire</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Type (Canevas I.3)</label>
          <input 
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold" 
            placeholder="Interne, Coopération, PNR..." 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Durée (en mois - Canevas I.6)</label>
          <div className="relative">
            <input 
              name="duree_mois"
              type="number"
              value={formData.duree_mois}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold" 
            />
            <Clock className="absolute right-4 top-4 text-slate-300" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}