import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { CheckCircle, XCircle, Eye, Loader2, AlertCircle } from "lucide-react";

export default function DivisionApprovals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      // Le backend doit filtrer par division_id du chef et statut='Proposé'
      const { data } = await axiosClient.get("/projets?statut=Proposé");
      setProposals(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des propositions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const confirmMsg = action === 'valider' 
      ? "Voulez-vous valider cette proposition et l'envoyer au CS ?" 
      : "Voulez-vous rejeter cette proposition ?";
    
    if (!window.confirm(confirmMsg)) return;

    try {
      // Utilisation de votre route Laravel : patch('/projets/{projet}/valider-division')
      await axiosClient.patch(`/projets/${id}/valider-division`, { action });
      setProposals(proposals.filter(p => p.id !== id));
      alert("Action enregistrée avec succès.");
    } catch (error) {
      alert("Une erreur est survenue lors de la validation.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Propositions de Recherche</h1>
        <p className="text-slate-500 text-sm">Examinez et validez les nouveaux projets soumis par votre division.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : proposals.length > 0 ? (
        <div className="grid gap-4">
          {proposals.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">ID: {p.id}</span>
                  <span className="text-xs text-blue-600 font-medium italic">Par: {p.chef_projet?.nom} {p.chef_projet?.prenom}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{p.titre}</h3>
                <p className="text-sm text-slate-500 line-clamp-1">{p.resume}</p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition font-medium border border-slate-200">
                  <Eye size={18} /> Détails
                </button>
                <button 
                  onClick={() => handleAction(p.id, 'rejeter')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition font-medium border border-red-100"
                >
                  <XCircle size={18} /> Rejeter
                </button>
                <button 
                  onClick={() => handleAction(p.id, 'valider')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition font-bold shadow-lg shadow-emerald-100"
                >
                  <CheckCircle size={18} /> Valider
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <AlertCircle className="mx-auto text-slate-300 mb-3" size={48} />
          <p className="text-slate-500 font-medium">Aucune proposition en attente de validation.</p>
        </div>
      )}
    </div>
  );
}