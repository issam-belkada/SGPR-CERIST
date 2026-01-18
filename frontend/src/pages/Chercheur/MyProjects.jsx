import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Plus, FileText, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function MyProjects() {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/projets")
      .then(({ data }) => setProjets(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'enCours': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Valide_Division': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Nouveau': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Terminé': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Mes Projets</h1>
          <p className="text-slate-500 text-sm">Consultez vos participations et l'état de vos propositions.</p>
        </div>
        <Link 
          to="/chercheur/proposer-projet"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          <span className="font-semibold">Nouvelle Proposition</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projets.length > 0 ? projets.map((projet) => (
            <div key={projet.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(projet.statut)}`}>
                    {projet.statut}
                  </span>
                  <FileText className="text-slate-300" size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
                  {projet.titre}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-3 mb-4">
                  {projet.resume || "Aucun résumé fourni pour ce projet."}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{new Date(projet.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-2xl">
                <Link 
                  to={`/chercheur/projets/${projet.id}`}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Détails du projet <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <AlertCircle className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-500 font-medium">Vous n'avez aucun projet pour le moment.</p>
              <p className="text-slate-400 text-sm">Commencez par soumettre une nouvelle proposition.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}