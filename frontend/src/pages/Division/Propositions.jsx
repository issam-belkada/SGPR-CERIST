import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { 
  FileText, User, CheckCircle, XCircle, 
  Clock, X, ChevronRight, Target, Zap, Loader2,
  Layers, Users2, LayoutList, Briefcase, GraduationCap
} from "lucide-react";
import Swal from "sweetalert2";

export default function Propositions() {
  const [propositions, setPropositions] = useState([]);
  const [selectedProp, setSelectedProp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchPropositions = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/division/propositions");
      setPropositions(data);
    } catch (err) { 
      console.error("Erreur de récupération:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchPropositions();
  }, []);

  const handleAction = async (id, nouveauStatut) => {
    setProcessing(true);
    try {
      await axiosClient.put(`/projets/${id}/statut`, { statut: nouveauStatut });
      
      Swal.fire({
        icon: 'success',
        title: nouveauStatut === 'Validé' ? 'Projet Approuvé' : 'Projet Refusé',
        text: `Le statut du dossier #${id} a été mis à jour.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });

      setSelectedProp(null); 
      fetchPropositions();
    } catch (err) {
      Swal.fire('Erreur', 'Action impossible', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 px-4">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">
            Flux de <span className="text-emerald-500">Validation</span>
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3 italic flex items-center gap-2">
            <Layers size={14} /> {propositions.length} projets en attente pour la {propositions[0]?.division?.acronyme}
          </p>
        </div>
      </div>

      {/* --- LISTE DES CARTES --- */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4 text-slate-400">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
            <span className="text-[10px] font-black uppercase tracking-widest">Chargement du flux...</span>
          </div>
        ) : propositions.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">Aucune proposition en attente</p>
          </div>
        ) : (
          propositions.map((prop) => (
            <div 
              key={prop.id} 
              onClick={() => setSelectedProp(prop)}
              className="group bg-white rounded-[2.5rem] border border-slate-200 p-6 flex flex-col lg:flex-row items-center gap-8 cursor-pointer hover:border-emerald-500/30 hover:shadow-2xl transition-all duration-500"
            >
              <div className="w-16 h-16 shrink-0 bg-slate-950 rounded-[1.8rem] flex items-center justify-center text-emerald-400 group-hover:rotate-6 transition-transform shadow-lg">
                <FileText size={28} />
              </div>

              <div className="flex-1 space-y-1 text-center lg:text-left">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">{prop.nature} • {prop.type}</p>
                <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-tight group-hover:text-emerald-700 transition-colors">
                  {prop.titre}
                </h2>
                <div className="flex items-center justify-center lg:justify-start gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  <span className="flex items-center gap-1.5"><User size={12}/> {prop.chef_projet?.nom} ({prop.chef_projet?.grade})</span>
                  <span className="flex items-center gap-1.5"><Clock size={12}/> {prop.duree_mois} Mois</span>
                </div>
              </div>

              <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-2xl group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-widest">Examiner</span>
                <ChevronRight size={18} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- DRAWER D'EXAMEN --- */}
      {selectedProp && (
        <>
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]" onClick={() => setSelectedProp(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-4xl bg-white z-[70] animate-in slide-in-from-right duration-500 flex flex-col shadow-2xl">
            
            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <button onClick={() => setSelectedProp(null)} className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-950 transition-all">
                <X size={20} />
              </button>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Division : {selectedProp.division?.acronyme}</p>
                <p className="text-xs font-black text-emerald-600 uppercase italic">Dossier Scientifique #{selectedProp.id}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
              
              {/* TITRE ET RÉSUMÉ */}
              <section className="space-y-6">
                <h2 className="text-4xl font-black text-slate-950 tracking-tighter italic leading-[1.1] uppercase">
                  {selectedProp.titre}
                </h2>
                <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-6 bg-slate-50 py-6 rounded-r-3xl text-lg">
                  {selectedProp.resume}
                </p>
              </section>

              {/* GRILLE D'INFO CHERCHEUR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-950 text-white rounded-[2.5rem] shadow-xl">
                  <User size={20} className="text-emerald-400 mb-4" />
                  <p className="text-[9px] font-black text-emerald-400/60 uppercase tracking-widest">Chef de Projet</p>
                  <p className="text-xl font-black uppercase italic">{selectedProp.chef_projet?.nom} {selectedProp.chef_projet?.prenom}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                    {selectedProp.chef_projet?.grade} • {selectedProp.chef_projet?.specialite}
                  </p>
                </div>
                <div className="p-6 bg-white border-2 border-slate-100 rounded-[2.5rem]">
                  <Briefcase size={20} className="text-emerald-500 mb-4" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cadre du projet</p>
                  <p className="text-xl font-black text-slate-900 uppercase italic">{selectedProp.nature}</p>
                  <p className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-tighter">
                    Type: {selectedProp.type}
                  </p>
                </div>
              </div>

              {/* ÉQUIPE */}
              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Users2 size={16} className="text-emerald-500" /> Membres du consortium
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProp.membres?.map((membre) => (
                    <div key={membre.id} className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-emerald-50/50 transition-colors group">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 font-black text-sm shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
                        {membre.nom.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-black uppercase text-slate-900 leading-none">{membre.nom} {membre.prenom}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic">{membre.grade} • {membre.pivot?.qualite}</p>
                      </div>
                      <div className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
                        {membre.pivot?.pourcentage_participation}%
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* WORK PACKAGES ET TACHES */}
              <section className="space-y-6">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-slate-100 pb-4">
                  <LayoutList size={16} className="text-emerald-500" /> Plan de Travail Prévisionnel
                </h3>
                <div className="space-y-4">
                  {selectedProp.work_packages?.map((wp) => (
                    <div key={wp.id} className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 bg-slate-950 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">{wp.code_wp}</span>
                        <span className="text-[10px] font-black text-emerald-600 uppercase italic">Module Technique</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 uppercase italic mb-4">{wp.titre}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {wp.taches?.map((tache) => (
                          <div key={tache.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-200" />
                              <span className="text-xs text-slate-600 font-bold uppercase tracking-tighter">{tache.nom}</span>
                            </div>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{tache.etat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* PROBLEMATIQUE ET OBJECTIFS */}
              <section className="p-10 bg-slate-950 rounded-[3.5rem] text-white space-y-10 shadow-2xl">
                <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                  <Target size={24} className="text-emerald-400" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] italic">Analyse Scientifique Stratégique</h3>
                </div>
                <div className="space-y-8">
                  <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Zap size={12}/> Problématique identifiée
                    </p>
                    <p className="text-base text-slate-300 italic leading-relaxed font-medium pl-6 border-l-2 border-emerald-500/40">
                      {selectedProp.problematique}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <CheckCircle size={12}/> Objectifs de recherche
                    </p>
                    <p className="text-base text-slate-300 italic leading-relaxed font-medium pl-6 border-l-2 border-emerald-500/40 whitespace-pre-line">
                      {selectedProp.objectifs}
                    </p>
                  </div>
                </div>
              </section>

            </div>

            {/* ACTIONS FOOTER */}
            <div className="p-8 border-t border-slate-100 bg-white/80 backdrop-blur-md sticky bottom-0 z-10">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  disabled={processing}
                  onClick={() => handleAction(selectedProp.id, 'Refusé')}
                  className="flex-1 flex items-center justify-center gap-3 py-6 bg-white border-2 border-slate-100 text-slate-400 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all disabled:opacity-50"
                >
                  <XCircle size={20} /> Refuser Proposition
                </button>

                <button 
                  disabled={processing}
                  onClick={() => handleAction(selectedProp.id, 'Validé')}
                  className="flex-[2] flex items-center justify-center gap-3 py-6 bg-emerald-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:bg-emerald-600 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  {processing ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle size={20} />}
                  {processing ? "Signature Digitale..." : "Approuver pour la Division"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      `}} />
    </div>
  );
}