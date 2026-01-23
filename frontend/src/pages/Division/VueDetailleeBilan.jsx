import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { 
  Users, BookOpen, Globe, Briefcase, 
  AlertTriangle, CheckCircle2, FlaskConical,
  GraduationCap, UserCircle, FileBadge, Loader2, 
  Calendar, Target, Rocket, HelpCircle,
  ShieldCheck, MapPin, Microchip, Download, Send
} from "lucide-react";
import Swal from "sweetalert2";

export default function BilanDivisionDetailleFinal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axiosClient.get(`/division/bilan-complet/${id}`)
      .then(res => { setReport(res.data); setLoading(false); })
      .catch(() => {
        Swal.fire("Erreur", "Données introuvables.", "error");
        navigate(-1);
      });
  }, [id, navigate]);

  // --- EXPORT PDF (Appel Route Backend) ---
  const handleExportPDF = async () => {
    try {
      const response = await axiosClient.get(`/division/bilans-consolides/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bilan_Division_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire("Erreur", "Impossible de générer le PDF.", "error");
    }
  };

  // --- SOUMISSION (Route /bilans/{id}/transmettre) ---
  const handleSoumettre = () => {
    Swal.fire({
      title: "Transmettre le bilan ?",
      text: "Cette action est irréversible et validera les données pour l'année en cours.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Oui, transmettre",
      cancelButtonText: "Annuler"
    }).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        axiosClient.put(`/bilans/${id}/transmettre`)
          .then(() => {
            Swal.fire("Transmis !", "Le bilan a été envoyé avec succès.", "success");
            navigate("/dashboard"); 
          })
          .catch(() => {
            Swal.fire("Erreur", "Une erreur est survenue lors de la transmission.", "error");
          })
          .finally(() => setIsSubmitting(false));
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initialisation du rapport...</p>
    </div>
  );

  const { bilan_division, bilans_projets_details } = report;

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-16 animate-in fade-in duration-700">
      
      {/* BARRE D'ACTIONS */}
      <div className="flex justify-end gap-4 mb-8">
        <button 
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          <Download size={16} /> Export PDF
        </button>
        <button 
          onClick={handleSoumettre}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
          Soumettre
        </button>
      </div>

      {/* 1. HEADER & IDENTITÉ */}
      <header className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Rapport de Performance Annuel</p>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">{bilan_division.division?.nom}</h1>
              <p className="text-slate-400 font-bold tracking-widest text-sm underline decoration-indigo-500 decoration-4 underline-offset-8">
                {bilan_division.division?.acronyme} — CERIST
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
              <p className="text-[9px] font-black uppercase text-indigo-300">Année</p>
              <p className="text-3xl font-black">{bilan_division.annee}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <UserCircle className="text-indigo-400" size={32} />
              <div>
                <p className="text-slate-400 text-[9px] font-black uppercase">Chef de Division</p>
                <p className="text-sm font-bold">{bilan_division.chef_division?.prenom} {bilan_division.chef_division?.nom}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-white/10 hidden md:block"></div>
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase">État du Rapport</p>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-black uppercase border border-amber-500/30">
                {bilan_division.etat}
              </span>
            </div>
          </div>
        </div>
        <FileBadge className="absolute -right-10 -bottom-10 text-white/5 w-80 h-80" />
      </header>

      {/* 2. STATISTIQUES PERSONNEL */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
            <Users className="text-indigo-600" size={24} />
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Ressources Humaines & Potentiel</h2>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-6">
          {Object.entries(bilan_division.statistiques_personnel).map(([grade, count]) => (
            <div key={grade} className="text-center p-4 rounded-3xl bg-slate-50 border border-slate-100/50">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{grade}</p>
              <p className="text-2xl font-black text-slate-900">{count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ACTIVITÉS TRANSVERSALES */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
            <Rocket className="text-indigo-600" size={24} />
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Activités de la Division</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {[
            { title: "Formation Qualifiante", content: bilan_division.formation_qualifiante, icon: <GraduationCap size={20}/>, color: "bg-indigo-50 text-indigo-700", border: "border-indigo-100" },
            { title: "Coopération & Partenariats", content: bilan_division.cooperation_partenariat, icon: <Briefcase size={20}/>, color: "bg-blue-50 text-blue-700", border: "border-blue-100" },
            { title: "Animation Scientifique", content: bilan_division.animation_scientifique, icon: <FlaskConical size={20}/>, color: "bg-emerald-50 text-emerald-700", border: "border-emerald-100" },
            { title: "Mobilité & Séjours", content: bilan_division.sejours_etranger, icon: <Globe size={20}/>, color: "bg-purple-50 text-purple-700", border: "border-purple-100" }
          ].map((item, i) => (
            <div key={i} className={`bg-white p-8 rounded-[2.5rem] border ${item.border} shadow-sm flex flex-col md:flex-row gap-6 items-start`}>
              <div className={`${item.color} p-4 rounded-2xl`}>{item.icon}</div>
              <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2">{item.title}</span>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{item.content || "Aucun détail saisi."}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DÉTAILS DES PROJETS */}
      <section className="space-y-12">
        <div className="flex items-center gap-4 px-2">
            <Target className="text-rose-600" size={24} />
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">Projets de Recherche Détails</h2>
        </div>

        {bilans_projets_details.map((bp) => (
          <div key={bp.id} className="relative bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden">
            
            {/* Header Projet */}
            <div className="bg-slate-50 p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase">{bp.projet?.type}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{bp.projet?.nature}</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                  {bp.projet?.titre}
                </h3>
                <div className="flex flex-wrap gap-6 text-[11px] font-bold text-slate-500 pt-2">
                  <span className="flex items-center gap-2"><UserCircle size={14} className="text-indigo-500" /> Chef: {bp.projet?.chef_projet?.nom}</span>
                  <span className="flex items-center gap-2"><Calendar size={14} className="text-indigo-500" /> {bp.projet?.duree_mois} Mois</span>
                  <span className="flex items-center gap-2"><MapPin size={14} className="text-indigo-500" /> {bp.projet?.division?.acronyme}</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center shadow-inner min-w-[140px]">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Avancement Physique</p>
                <div className="text-4xl font-black text-indigo-600">{bp.avancement_physique}%</div>
              </div>
            </div>

            <div className="p-10 space-y-12">
              
              {/* Équipe */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="text-indigo-400" size={18} />
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Composition de l'Équipe</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bp.projet?.membres?.map(m => (
                    <div key={m.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-xs font-black text-slate-800 uppercase">{m.nom} {m.prenom}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{m.grade} • {m.pivot?.qualite}</p>
                      </div>
                      <span className="text-xs font-black text-indigo-600">{m.pivot?.pourcentage_participation}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Objectifs */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={18} />
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">État de Réalisation</h4>
                </div>
                <div className="p-8 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100/50">
                  <p className="text-sm text-slate-700 leading-relaxed italic font-medium">"{bp.objectifs_realises}"</p>
                </div>
              </div>

              {/* Production Scientifique */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-blue-500" size={18} />
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Production Scientifique</h4>
                </div>
                <div className="space-y-3">
                  {bp.productions_scientifiques?.length > 0 ? bp.productions_scientifiques.map(pub => (
                    <div key={pub.id} className="p-6 bg-white rounded-3xl border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-800 uppercase">{pub.titre}</p>
                        <p className="text-xs text-indigo-600 font-bold italic">{pub.revue_ou_conference} ({pub.date_parution})</p>
                        <p className="text-[10px] text-slate-400 font-medium">Auteurs: {pub.auteurs}</p>
                      </div>
                      <span className="h-fit px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-lg border border-blue-100">
                        {pub.type.replace('_', ' ')}
                      </span>
                    </div>
                  )) : <p className="text-xs text-slate-400 italic">Aucune donnée.</p>}
                </div>
              </div>

              {/* Innovation */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Microchip className="text-amber-500" size={18} />
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Innovation & Prototypes</h4>
                </div>
                <div className="space-y-3">
                  {bp.productions_technologiques?.length > 0 ? bp.productions_technologiques.map(tech => (
                    <div key={tech.id} className="p-6 bg-amber-50/20 rounded-3xl border border-amber-100 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-black text-slate-800 uppercase">{tech.intitule}</p>
                        <span className="text-[9px] font-black text-amber-600 bg-white px-2 py-1 rounded-md border">{tech.reference}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{tech.description}</p>
                    </div>
                  )) : <p className="text-xs text-slate-400 italic">Aucune donnée.</p>}
                </div>
              </div>

              {/* Difficultés */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-rose-500" size={18} />
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contraintes</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Scientifiques", content: bp.difficultes_scientifiques },
                    { label: "Matérielles", content: bp.difficultes_materielles },
                    { label: "Humaines", content: bp.difficultes_humaines }
                  ].map((diff, idx) => (
                    <div key={idx} className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
                      <span className="text-[9px] font-black uppercase text-rose-600">{diff.label}</span>
                      <p className="text-[11px] text-slate-700 mt-2">{diff.content || "N/A"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partenariats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                  <div className="flex items-center gap-2 text-indigo-400 mb-4">
                    <ShieldCheck size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Collaborations</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">{bp.collaborations || "Aucune."}</p>
                </div>
                <div className="bg-slate-100 p-8 rounded-[2.5rem]">
                  <div className="flex items-center gap-2 text-slate-500 mb-4">
                    <HelpCircle size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Observations</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">{bp.autres_resultats || "Aucune."}</p>
                </div>
              </div>

            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="text-center pt-8 border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em]">Documentation Technique de Recherche — CERIST 2026</p>
      </footer>
    </div>
  );
}