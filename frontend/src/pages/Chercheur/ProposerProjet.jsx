import { useState } from "react";
import { ChevronRight, ChevronLeft, Save, CheckCircle2, Loader2, AlertCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StepIdentification from "./StepIdentification";
import StepDescription from "./StepDescription";
import StepTeam from "./StepTeam";
import StepPlanning from "./StepPlanning";
import axiosClient from "../../api/axios";

export default function ProposeProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); // État pour stocker le message d'erreur

  const [formData, setFormData] = useState({
    titre: "", nature: "Recherche", type: "", duree_mois: 12,
    resume: "", problematique: "", objectifs: "", 
    membres: [], 
    wps: [{ id: Date.now(), code_wp: "WP1", titre: "", objectifs: "", taches: [] }],
    livrables: []
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Réinitialiser l'erreur avant de tenter
    try {
      await axiosClient.post("/projets", formData);
      setSubmitted(true);
      setTimeout(() => navigate("/chercheur/mes-projets"), 3500);
    } catch (err) {
      console.error(err);
      // On récupère le message d'erreur envoyé par Laravel ou un message générique
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'envoi du dossier.");
    } finally {
      setLoading(false);
    }
  };

  // --- ÉCRAN DE SUCCÈS (Identique au précédent) ---
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center animate-in zoom-in duration-500">
        <div className="bg-white rounded-[3.5rem] p-16 shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 size={48} strokeWidth={3} />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Projet Soumis !</h2>
              <p className="text-slate-500 font-bold text-lg">Votre dossier a été envoyé pour validation.</p>
            </div>
            <div className="pt-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Redirection...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-black italic">NOUVEAU <span className="text-indigo-400">PROJET</span></h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Canevas Officiel de Recherche</p>
          </div>
          <div className="flex gap-2 mt-6 md:mt-0">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`w-12 h-2 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-500 w-16' : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-12 relative overflow-hidden">
        
        {/* --- MESSAGE D'ERREUR STYLISÉ --- */}
        {error && (
          <div className="mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-200">
                <XCircle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-rose-900 font-black text-xs uppercase tracking-widest mb-1">Erreur de soumission</h3>
                <p className="text-rose-600 text-sm font-bold">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-rose-300 hover:text-rose-500 transition-colors">
                <XCircle size={20} />
              </button>
            </div>
          </div>
        )}

        {/* CONTENU DES ÉTAPES */}
        <div className="relative">
          {step === 1 && <StepIdentification formData={formData} setFormData={setFormData} />}
          {step === 2 && <StepDescription formData={formData} setFormData={setFormData} />}
          {step === 3 && <StepTeam formData={formData} setFormData={setFormData} />}
          {step === 4 && <StepPlanning formData={formData} setFormData={setFormData} />}
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between mt-16 pt-8 border-t border-slate-50">
          <button 
            onClick={() => setStep(s => s - 1)} 
            disabled={step === 1 || loading}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
            <ChevronLeft size={16} /> Précédent
          </button>
          
          {step < 4 ? (
            <button 
              onClick={() => { setStep(s => s + 1); setError(null); }} 
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl">
              Suivant <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {loading ? "Traitement en cours..." : "Soumettre le dossier"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}