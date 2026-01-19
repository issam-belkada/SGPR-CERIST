export default function StepDescription({ formData, setFormData }) {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
        <span className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">II</span>
        Contenu Scientifique
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Résumé (Canevas I.7)</label>
          <textarea 
            name="resume"
            value={formData.resume}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 border-none h-32 font-medium" 
            placeholder="Décrivez brièvement le projet..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Problématique (Canevas II)</label>
          <textarea 
            name="problematique"
            value={formData.problematique}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 border-none h-32 font-medium" 
            placeholder="Quels sont les verrous scientifiques ?"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-4">Objectifs (Canevas IV.1)</label>
          <textarea 
            name="objectifs"
            value={formData.objectifs}
            onChange={handleChange}
            className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 border-none h-32 font-medium" 
            placeholder="Listez les objectifs principaux..."
          />
        </div>
      </div>
    </div>
  );
}