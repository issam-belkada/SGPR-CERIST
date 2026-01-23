import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { 
  Users, Globe, BookOpen, Handshake, 
  Plus, X, FileText, ClipboardCheck, Info,
  ChevronRight, Layout
} from "lucide-react";
import Swal from "sweetalert2";

export default function RedigerBilanDivision() {
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [dataPreemplie, setDataPreemplie] = useState({ 
    bilans_projets: [], 
    stats_automatiques: {}, 
    division_nom: "" 
  });
  
  const GRADES_LIST = [
    "PR", "DR", "MCA", "MCB", "MRA", "MRB", "MAA", "MAB", "CR", "AR", "Autre"
  ];

  const [formData, setFormData] = useState({
    annee: new Date().getFullYear(),
    statistiques_personnel: {}, 
    formation_qualifiante: "",
    sejours_etranger: "",
    animation_scientifique: "",
    cooperation_partenariat: "",
    bilans_projets_ids: []
  });

  useEffect(() => { fetchPreparationData(); }, []);

  const fetchPreparationData = async () => {
    try {
      const { data } = await axiosClient.get("/division/pre-remplir-bilan");
      setDataPreemplie(data);
      const initialStats = {};
      GRADES_LIST.forEach(g => { initialStats[g] = data.stats_automatiques[g] || 0; });
      setFormData(prev => ({ 
        ...prev, 
        statistiques_personnel: initialStats,
        annee: data.annee 
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (etatAction) => {
    const isFinal = etatAction === 'Transmis_au_CS';
    const result = await Swal.fire({
      title: isFinal ? 'Transmettre au CS ?' : 'Sauvegarder ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.post("/division/bilan-annuel", { ...formData, etat: etatAction });
        setIsPreview(false);
        Swal.fire("Succès", "Enregistré avec succès", "success");
      } catch (err) {
        Swal.fire("Erreur", "Échec de l'envoi", "error");
      }
    }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-400 animate-pulse tracking-widest">CONSOLIDATION...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 text-left">
      
      {/* --- MINI HEADER --- */}
      <div className="bg-white px-8 py-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Layout size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Bilan Division</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Session Annuelle {formData.annee}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleSubmit('Brouillon')} className="px-5 py-2.5 bg-slate-50 text-slate-500 rounded-xl font-black uppercase text-[10px] hover:bg-slate-100 transition-all">Brouillon</button>
          <button onClick={() => setIsPreview(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px] shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-all">
            <ClipboardCheck size={14} /> Aperçu & Envoi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SECTION RH COMPACTE (Version Horizontale Raffinée) */}
        <div className="lg:col-span-12 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-slate-900 text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <Users size={16} className="text-indigo-600"/> Potentiel Scientifique de la Division
            </h3>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full italic">Modifier les effectifs si nécessaire</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {GRADES_LIST.map((grade) => (
              <div key={grade} className="flex-1 min-w-[100px] group bg-slate-50 p-3 rounded-2xl border border-transparent hover:border-indigo-200 hover:bg-white transition-all">
                <span className="text-[9px] font-black text-slate-400 uppercase block mb-1 group-hover:text-indigo-500 transition-colors">{grade}</span>
                <div className="flex items-end gap-1">
                  <input 
                    type="number" 
                    value={formData.statistiques_personnel[grade]} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      statistiques_personnel: {...formData.statistiques_personnel, [grade]: e.target.value}
                    })}
                    className="w-full bg-transparent border-none p-0 text-slate-900 font-black text-lg focus:ring-0"
                  />
                  <span className="text-[10px] text-slate-300 font-bold mb-1">Pers.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE GAUCHE : SÉLECTION PROJETS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
            <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Info size={16}/> Projets de Recherche
            </h3>
            <div className="space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {dataPreemplie.bilans_projets.map(bp => (
                <label key={bp.id} className={`flex items-start gap-3 p-4 rounded-2xl border border-white/5 cursor-pointer transition-all ${formData.bilans_projets_ids.includes(bp.id) ? 'bg-indigo-600 border-indigo-400' : 'bg-white/5 hover:bg-white/10'}`}>
                  <input 
                    type="checkbox" 
                    className="mt-1 rounded border-none bg-white/20 text-indigo-400 focus:ring-0"
                    checked={formData.bilans_projets_ids.includes(bp.id)}
                    onChange={(e) => {
                      const ids = e.target.checked 
                        ? [...formData.bilans_projets_ids, bp.id]
                        : formData.bilans_projets_ids.filter(id => id !== bp.id);
                      setFormData({...formData, bilans_projets_ids: ids});
                    }}
                  />
                  <div className="text-[10px] font-bold text-white/90 uppercase leading-tight italic">{bp.projet?.titre}</div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : SYNTHÈSE DIVISION */}
        <div className="lg:col-span-8 space-y-4">
          {[
            { id: 'formation_qualifiante', label: 'Formation Qualifiante', icon: <BookOpen />, color: 'text-emerald-600' },
            { id: 'sejours_etranger', label: 'Rayonnement & Mobilité', icon: <Globe />, color: 'text-blue-600' },
            { id: 'animation_scientifique', label: 'Animation Scientifique', icon: <Plus />, color: 'text-purple-600' },
            { id: 'cooperation_partenariat', label: 'Coopération & Partenariats', icon: <Handshake />, color: 'text-amber-600' },
          ].map((sec) => (
            <div key={sec.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <h3 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${sec.color}`}>
                  {sec.icon} {sec.label}
                </h3>
              </div>
              <textarea 
                className="flex-1 bg-slate-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-indigo-100 text-sm text-slate-600 italic leading-relaxed"
                rows="3"
                value={formData[sec.id]}
                onChange={(e) => setFormData({...formData, [sec.id]: e.target.value})}
                placeholder="Faits marquants..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL APERÇU (Version "Papier" élégante) --- */}
      {isPreview && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl h-full rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FileText size={14}/> Visualisation du Rapport Divisionnaire
              </span>
              <div className="flex gap-3">
                <button onClick={() => setIsPreview(false)} className="px-4 py-2 text-[10px] font-black uppercase text-slate-400">Retour</button>
                <button onClick={() => handleSubmit('Transmis_au_CS')} className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-black uppercase text-[10px]">Confirmer l'envoi</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-16 font-serif italic text-slate-800 text-left">
              <div className="text-center mb-16 not-italic font-sans">
                <h2 className="text-3xl font-black mb-1">CERIST</h2>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.6em] mb-10 uppercase">{dataPreemplie.division_nom}</p>
                <h3 className="text-4xl font-serif italic border-y-2 border-slate-900 py-6">Rapport Annuel de Synthèse — {formData.annee}</h3>
              </div>

              {/* RH COMPACT DANS LE RAPPORT */}
              <div className="mb-12 space-y-4">
                <h4 className="text-[11px] font-black uppercase text-indigo-600 not-italic font-sans">1. Ressources Humaines Mobilisées</h4>
                <div className="flex flex-wrap gap-2 not-italic font-sans text-center">
                  {Object.entries(formData.statistiques_personnel).map(([grade, count]) => count > 0 && (
                    <div key={grade} className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl">
                      <div className="text-[9px] font-black text-slate-400">{grade}</div>
                      <div className="text-md font-black text-slate-900">{count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTIONS DE TEXTE */}
              <div className="space-y-12">
                <h4 className="text-[11px] font-black uppercase text-indigo-600 not-italic font-sans mb-6">2. Développements de la Division</h4>
                {[
                  { title: "Formation & Encadrement", value: formData.formation_qualifiante },
                  { title: "Rayonnement & Mobilité internationale", value: formData.sejours_etranger },
                  { title: "Animation Scientifique", value: formData.animation_scientifique },
                  { title: "Coopération & Partenariats", value: formData.cooperation_partenariat }
                ].map((sec, i) => sec.value && (
                  <div key={i} className="space-y-3">
                    <h5 className="font-sans not-italic font-black text-[10px] text-slate-900 uppercase flex items-center gap-2">
                       <ChevronRight size={14} className="text-indigo-600"/> {sec.title}
                    </h5>
                    <p className="text-md leading-relaxed text-justify pl-6 border-l border-slate-100">{sec.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-20 pt-10 border-t border-slate-100 italic text-[11px] text-slate-400">
                Fait à Alger, le {new Date().toLocaleDateString('fr-FR')} <br/>
                Chef de Division : <span className="not-italic font-black text-slate-900 uppercase tracking-tighter">{dataPreemplie.division_nom}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}