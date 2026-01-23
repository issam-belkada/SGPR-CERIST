import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { 
  CheckCircle, X, ChevronRight, Loader2, Calendar, 
  AlertCircle, Download, FileText, 
  CheckCircle2, Clock, Users, BookOpen, Cpu, Microscope, Shield,
  GraduationCap, ExternalLink, Briefcase
} from "lucide-react";
import Swal from "sweetalert2";

export default function SuiviBilans() {
  const [bilans, setBilans] = useState([]);
  const [selectedBilan, setSelectedBilan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchBilansSoumis = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/division/bilans-a-valider");
      setBilans(data);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBilansSoumis(); }, []);

  const handleDownloadPDF = async (bilanId, titreProjet) => {
    try {
        const response = await axiosClient.get(`/bilans/${bilanId}/pdf`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Bilan_${titreProjet || bilanId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        Swal.fire('Erreur', 'Impossible de générer le PDF.', 'error');
    }
  };

  const handleAction = async (id, actionLabel) => {
    const dbValue = actionLabel === 'Validé' ? 'Valide' : 'Rejete';

    const result = await Swal.fire({
      title: `Confirmer la décision ?`,
      text: `Voulez-vous marquer ce bilan comme "${actionLabel}" ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: actionLabel === 'Validé' ? '#4f46e5' : '#ef4444',
      confirmButtonText: 'Confirmer',
    });

    if (!result.isConfirmed) return;

    setProcessing(true);
    try {
      await axiosClient.put(`/bilans/${id}/valider`, { etat_validation: dbValue });
      Swal.fire("Succès", "Action enregistrée", "success");
      setSelectedBilan(null);
      fetchBilansSoumis();
    } catch (err) {
      Swal.fire("Erreur", "Le serveur a rencontré un problème.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 px-4">
      
      {/* HEADER PAGE */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex justify-between items-end">
        <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Suivi des <span className="text-indigo-600">Bilans</span></h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                <Clock size={14} className="text-indigo-500"/> {bilans.length} bilans en attente de validation
            </p>
        </div>
      </div>

      {/* LISTE DES BILANS */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Chargement...</span>
          </div>
        ) : (
          bilans.map((bilan) => (
            <div key={bilan.id} onClick={() => setSelectedBilan(bilan)} className="group bg-white rounded-[2.5rem] border border-slate-100 p-6 flex items-center gap-6 cursor-pointer hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-indigo-400">
                <FileText size={20} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">{bilan.projet?.titre}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">Bilan Année {bilan.annee} — Chef: {bilan.projet?.chef_projet?.nom}</p>
              </div>
              <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>
          ))
        )}
      </div>

      {/* DRAWER DÉTAILS */}
      {selectedBilan && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]" onClick={() => setSelectedBilan(null)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-6xl bg-slate-50 z-[70] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
            
            {/* BARRE D'ACTION */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center">
                <button onClick={() => setSelectedBilan(null)} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 transition-colors">
                    <X size={18} /> Fermer
                </button>
                <div className="flex gap-4">
                    <button onClick={() => handleDownloadPDF(selectedBilan.id, selectedBilan.projet?.titre)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] hover:bg-slate-800 transition-all shadow-lg">
                        <Download size={16} /> PDF
                    </button>
                    <button onClick={() => handleAction(selectedBilan.id, 'Rejeté')} disabled={processing} className="px-6 py-3 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black uppercase text-[10px] hover:bg-rose-50 transition-all">
                        Rejeter
                    </button>
                    <button onClick={() => handleAction(selectedBilan.id, 'Validé')} disabled={processing} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] hover:bg-indigo-700 shadow-lg flex items-center gap-2">
                        {processing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} Approuver
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-8 max-w-5xl mx-auto pb-24">
                
                {/* 1. Identification du Projet */}
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden text-left">
                    <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
                        <div className="space-y-2">
                            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              <Microscope size={14}/> ID: {selectedBilan.projet?.id} • {selectedBilan.projet?.nature}
                            </p>
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{selectedBilan.projet?.titre}</h2>
                            <p className="text-slate-400 text-[10px] font-bold uppercase italic">Chef: {selectedBilan.projet?.chef_projet?.nom} {selectedBilan.projet?.chef_projet?.prenom} ({selectedBilan.projet?.chef_projet?.grade})</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-black text-indigo-400 leading-none">{selectedBilan.annee}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Exercice Annuel</p>
                        </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div><h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-2"><Briefcase size={14}/> Division</h4><p className="text-xs font-bold text-slate-700 uppercase tracking-tight">{selectedBilan.projet?.division?.nom}</p></div>
                        <div><h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-2"><Shield size={14}/> Type/Code</h4><p className="text-xs font-bold text-slate-700">{selectedBilan.projet?.type} / 2026-CERIST</p></div>
                        <div><h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-2"><Calendar size={14}/> Début</h4><p className="text-xs font-bold text-slate-700">{new Date(selectedBilan.projet?.date_debut).toLocaleDateString()}</p></div>
                        <div><h4 className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-2"><Clock size={14}/> Durée</h4><p className="text-xs font-bold text-slate-700">{selectedBilan.projet?.duree_mois} Mois</p></div>
                    </div>
                </div>

                {/* 2. Équipe de Recherche */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-left">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6 italic"><Users size={18} className="text-indigo-600" /> Équipe de recherche ({selectedBilan.projet?.membres?.length})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedBilan.projet?.membres?.map((membre, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-indigo-600 italic">
                            {membre.grade}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{membre.nom} {membre.prenom}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase italic">{membre.pivot?.qualite} — {membre.pivot?.pourcentage_participation}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                </div>

                {/* 3. Objectifs & Avancement */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-4 text-left">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={18} /> Objectifs Réalisés</h3>
                    <p className="text-slate-600 text-sm leading-relaxed italic border-l-4 border-indigo-100 pl-4 py-2">"{selectedBilan.objectifs_realises}"</p>
                    <div className="pt-4">
                        <div className="flex justify-between items-end mb-2">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux d'avancement physique</h4>
                           <p className="font-black text-indigo-600 text-xl italic">{selectedBilan.avancement_physique}%</p>
                        </div>
                        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-1">
                            <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{width: `${selectedBilan.avancement_physique}%`}}></div>
                        </div>
                    </div>
                </div>

                {/* 4. Productions & Livrables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Scientifiques */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 text-left">
                        <h3 className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><BookOpen size={18} /> Productions Scientifiques</h3>
                        <div className="space-y-4">
                            {selectedBilan.productions_scientifiques?.length > 0 ? selectedBilan.productions_scientifiques.map((pub, i) => (
                                <div key={i} className="group p-4 bg-emerald-50/30 rounded-[2rem] border border-emerald-100 hover:bg-emerald-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="px-2 py-1 bg-emerald-600 text-white text-[8px] font-black uppercase rounded-lg tracking-widest">{pub.type}</span>
                                      <span className="text-[9px] font-bold text-emerald-700">{pub.date_parution}</span>
                                    </div>
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{pub.titre}</p>
                                    <p className="text-[10px] font-bold text-slate-500 italic mb-2">{pub.revue_ou_conference}</p>
                                    <p className="text-[9px] text-emerald-800 font-bold uppercase tracking-tighter">Auteurs: {pub.auteurs}</p>
                                </div>
                            )) : <p className="text-xs text-slate-400 italic text-center py-10">Aucune production répertoriée.</p>}
                        </div>
                    </div>
                    {/* Technologiques */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 text-left">
                        <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"><Cpu size={18} /> Livrables Technologiques</h3>
                        <div className="space-y-4">
                            {selectedBilan.productions_technologiques?.length > 0 ? selectedBilan.productions_technologiques.map((tech, i) => (
                                <div key={i} className="p-4 bg-amber-50/30 rounded-[2rem] border border-amber-100 hover:bg-amber-50 transition-colors">
                                    <span className="px-2 py-1 bg-amber-600 text-white text-[8px] font-black uppercase rounded-lg tracking-widest mb-3 inline-block">{tech.type}</span>
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight mb-1">{tech.intitule}</p>
                                    <p className="text-[10px] text-slate-600 leading-tight mb-3 italic">"{tech.description}"</p>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-amber-800 uppercase italic border-t border-amber-100 pt-2">
                                      <ExternalLink size={10} /> Réf: {tech.reference || "Interne Cerist"}
                                    </div>
                                </div>
                            )) : <p className="text-xs text-slate-400 italic text-center py-10">Aucun livrable technologique.</p>}
                        </div>
                    </div>
                </div>

                {/* 5. Encadrements Étudiants */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-left">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 mb-6"><GraduationCap size={20} /> Encadrements & Thèses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedBilan.encadrements?.length > 0 ? selectedBilan.encadrements.map((enc, i) => (
                        <div key={i} className="flex flex-col p-5 bg-indigo-50/30 rounded-[2.5rem] border border-indigo-100">
                          <div className="flex justify-between items-center mb-2">
                             <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{enc.nom_etudiant}</p>
                             <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${enc.etat_avancement === 'Soutenu' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                                {enc.etat_avancement}
                             </span>
                          </div>
                          <p className="text-[10px] font-bold text-indigo-700 uppercase mb-1">{enc.type_diplome} — {enc.etablissement}</p>
                          <p className="text-[10px] text-slate-500 italic">Sujet: {enc.sujet}</p>
                        </div>
                      )) : <p className="text-xs text-slate-400 italic text-center w-full py-4">Aucun encadrement.</p>}
                    </div>
                </div>

                {/* 6. Difficultés & Contraintes */}
                <div className="bg-rose-50 p-10 rounded-[4rem] border border-rose-100 text-left">
                    <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest mb-6 flex items-center gap-2"><AlertCircle size={22} /> Contraintes & Difficultés Rencontrées</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/50 p-4 rounded-3xl border border-rose-100">
                          <p className="text-[9px] font-black text-rose-500 uppercase mb-2 italic">Scientifiques</p>
                          <p className="text-xs text-rose-900 leading-relaxed">{selectedBilan.difficultes_scientifiques || "Aucun obstacle scientifique majeur signalé."}</p>
                        </div>
                        <div className="bg-white/50 p-4 rounded-3xl border border-rose-100">
                          <p className="text-[9px] font-black text-rose-500 uppercase mb-2 italic">Matérielles</p>
                          <p className="text-xs text-rose-900 leading-relaxed">{selectedBilan.difficultes_materielles || "Ressources logistiques suffisantes."}</p>
                        </div>
                        <div className="bg-white/50 p-4 rounded-3xl border border-rose-100">
                          <p className="text-[9px] font-black text-rose-500 uppercase mb-2 italic">Humaines</p>
                          <p className="text-xs text-rose-900 leading-relaxed">{selectedBilan.difficultes_humaines || "Équipe complète et opérationnelle."}</p>
                        </div>
                    </div>
                </div>

                {/* 7. Collaborations & Autres Résultats */}
                <div className="bg-slate-900 p-10 rounded-[4rem] text-white text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                        <div className="space-y-4">
                            <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/10 pb-2">Collaborations Externes</h4>
                            <p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-line">{selectedBilan.collaborations || "Aucune collaboration externe signalée."}</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/10 pb-2">Autres Résultats & Impacts</h4>
                            <p className="text-sm text-slate-300 leading-relaxed italic">{selectedBilan.autres_resultats || "Néant."}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}