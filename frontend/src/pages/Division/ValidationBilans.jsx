import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { 
  CheckCircle2, XCircle, Clock, FileSearch, 
  ArrowRight, Calendar, BarChart2, MessageSquare,
  AlertCircle, ChevronRight, FileText, Download
} from "lucide-react";

export default function ValidationBilans() {
  const [bilans, setBilans] = useState([]);
  const [selectedBilan, setSelectedBilan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilans = async () => {
      try {
        const { data } = await axiosClient.get("/division/bilans-a-valider");
        setBilans(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchBilans();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase">
            Validation <span className="text-indigo-600">Bilans</span>
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
            <Clock size={14} className="text-indigo-500" /> Examens périodiques des livrables
          </p>
        </div>

        <div className="px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100">
           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-center">
             Bilan Semestriel S1 - 2026
           </p>
        </div>
      </div>

      {/* --- LISTE DES BILANS --- */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 flex justify-center"><Clock className="animate-spin text-indigo-500" /></div>
        ) : (
          bilans.map((bilan) => (
            <div 
              key={bilan.id} 
              onClick={() => setSelectedBilan(bilan)}
              className="group bg-white rounded-[2.5rem] border border-slate-200 p-6 flex flex-col lg:flex-row items-center gap-8 cursor-pointer hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-500"
            >
              {/* Indicateur de Progression Circulaire (Simplifié) */}
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="175.9" strokeDashoffset={175.9 * (1 - (bilan.taux_avancement || 0.7) )} className="text-indigo-600 transition-all duration-1000" />
                </svg>
                <span className="absolute text-[10px] font-black text-slate-900">{(bilan.taux_avancement || 70)}%</span>
              </div>

              <div className="flex-1 space-y-1 text-center lg:text-left">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Projet: {bilan.projet_acronyme || "PRJ-TECH"}</p>
                <h2 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase leading-tight">
                  {bilan.titre_bilan || "Rapport d'activité technique - Phase 1"}
                </h2>
                <div className="flex items-center justify-center lg:justify-start gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span className="flex items-center gap-1.5"><Calendar size={12}/> Soumis le 15 Janv</span>
                  <span className="flex items-center gap-1.5"><FileText size={12}/> 12 Pages</span>
                </div>
              </div>

              <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <span className="text-[10px] font-black uppercase tracking-widest">Examiner</span>
                <ChevronRight size={18} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- DRAWER D'EXAMEN --- */}
      {selectedBilan && (
        <>
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]" onClick={() => setSelectedBilan(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white z-[70] animate-in slide-in-from-right duration-500 flex flex-col shadow-2xl">
            
            {/* Header Drawer */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedBilan(null)} className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                  <ChevronRight className="rotate-180" size={20} />
                </button>
                <h3 className="text-sm font-black uppercase tracking-[0.2em]">Examen du Bilan</h3>
              </div>
              <Download size={20} className="cursor-pointer hover:scale-110 transition-transform" />
            </div>

            {/* Contenu de l'examen */}
            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
              
              {/* Section Header */}
              <div className="space-y-4">
                 <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-md">
                    Livrable #S1-2026
                 </div>
                 <h2 className="text-3xl font-black text-slate-950 tracking-tighter italic uppercase leading-tight">
                    {selectedBilan.titre_bilan}
                 </h2>
              </div>

              {/* Grid Comparaison Bento */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-[#F8FAFC] rounded-[2rem] border-2 border-slate-100 space-y-4">
                   <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                      <Target size={14} /> Objectifs Prévus
                   </div>
                   <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                      Finalisation du prototype Alpha et tests de charge sur 100 utilisateurs.
                   </p>
                </div>
                <div className="p-6 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100 space-y-4">
                   <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                      <BarChart2 size={14} /> Réalisations
                   </div>
                   <p className="text-sm font-bold text-emerald-900 leading-relaxed italic">
                      Prototype terminé. Tests effectués sur 150 utilisateurs avec succès.
                   </p>
                </div>
              </div>

              {/* Analyse Qualitative */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Commentaires du chercheur</h4>
                <div className="p-8 bg-slate-50 rounded-[2.5rem] relative">
                  <MessageSquare className="absolute -top-3 -left-3 text-indigo-200" size={40} />
                  <p className="text-sm text-slate-600 font-medium italic leading-relaxed">
                    "Nous avons rencontré quelques difficultés sur la partie base de données, mais le déploiement a été plus rapide que prévu. Le projet est en avance de 2 semaines."
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
               <button className="flex-1 py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:border-rose-200 hover:text-rose-600 transition-all flex items-center justify-center gap-3">
                  <AlertCircle size={18} /> Demander Révision
               </button>
               <button className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 group">
                  <CheckCircle2 size={18} className="group-hover:scale-125 transition-transform" /> Valider le Bilan
               </button>
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}} />
    </div>
  );
}