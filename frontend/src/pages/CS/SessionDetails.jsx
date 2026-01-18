import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { 
  Gavel, CheckCircle, XCircle, Clock, 
  ChevronLeft, Loader2, AlertCircle, FileText 
} from "lucide-react";

export default function SessionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [projetsEligibles, setProjetsEligibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [resSession, resEligibles] = await Promise.all([
        axiosClient.get(`/sessions-cs/${id}`),
        axiosClient.get(`/projets-disponibles-cs`) // Les projets qui attendent une décision
      ]);
      setSession(resSession.data);
      setProjetsEligibles(resEligibles.data);
    } catch (error) {
      console.error("Erreur de chargement", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (projetId, typeDecision) => {
    const commentaire = window.prompt("Commentaires ou observations du CS :");
    if (commentaire === null) return;

    setSubmitting(true);
    try {
      await axiosClient.post(`/sessions-cs/${id}/decisions`, {
        projet_id: projetId,
        decision: typeDecision, // 'Terminé', 'En cours', 'Abandonné'
        commentaire: commentaire
      });
      // Rafraîchir pour voir les changements
      fetchData();
    } catch (error) {
      alert("Erreur lors de l'enregistrement de la décision.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-cyan-700" size={40} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Barre de navigation haute */}
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-cyan-700 transition font-medium">
        <ChevronLeft size={20} /> Retour aux sessions
      </button>

      {/* En-tête de la Session */}
      <div className="bg-cyan-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-cyan-700/50 px-3 py-1 rounded-full text-xs font-bold uppercase border border-cyan-500">Session de Décision</span>
            <span className="text-cyan-300 font-medium">#{id}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{session?.lieu}</h1>
          <div className="flex flex-wrap gap-6 text-cyan-100">
            <div className="flex items-center gap-2"><Clock size={18} /> {new Date(session?.date_session).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
        <Gavel className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64 rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne GAUCHE : Projets en attente */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Projets à examiner <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full text-xs">{projetsEligibles.length}</span>
          </h2>
          
          {projetsEligibles.length > 0 ? projetsEligibles.map((projet) => (
            <div key={projet.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-cyan-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{projet.titre}</h3>
                  <p className="text-sm text-slate-500 italic mt-1">Division : {projet.division?.acronyme} | Chef : {projet.chef_projet?.nom}</p>
                </div>
                <button className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition" title="Consulter le bilan">
                  <FileText size={20} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                <button 
                  disabled={submitting}
                  onClick={() => handleDecision(projet.id, 'Terminé')}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-100 transition text-sm"
                >
                  <CheckCircle size={18} /> Valider (Terminé)
                </button>
                <button 
                  disabled={submitting}
                  onClick={() => handleDecision(projet.id, 'Abandonné')}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 border border-red-100 px-4 py-2.5 rounded-xl font-bold hover:bg-red-100 transition text-sm"
                >
                  <XCircle size={18} /> Abandonner
                </button>
              </div>
            </div>
          )) : (
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
              <AlertCircle className="mx-auto text-slate-300 mb-2" size={40} />
              <p className="text-slate-500">Aucun projet n'est actuellement en attente de décision pour cette session.</p>
            </div>
          )}
        </div>

        {/* Colonne DROITE : Résumé de la session */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Ordre du jour</h3>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "{session?.ordre_du_jour || "Aucun détail saisi"}"
            </p>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
            <h3 className="font-bold text-amber-800 mb-2">Décisions Déjà Prises</h3>
            <div className="space-y-3">
              {session?.decisions?.length > 0 ? session.decisions.map(d => (
                <div key={d.id} className="text-xs bg-white/50 p-2 rounded border border-amber-200">
                  <span className="font-bold text-slate-700">{d.projet?.titre}</span>
                  <p className={`font-black mt-1 ${d.decision === 'Terminé' ? 'text-emerald-600' : 'text-red-600'}`}>
                    ➔ {d.decision}
                  </p>
                </div>
              )) : <p className="text-xs text-amber-600 italic">Aucune décision enregistrée.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
