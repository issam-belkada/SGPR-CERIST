import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { CheckCircle2, XCircle, Loader2, Globe } from "lucide-react";

export default function NationalApprovals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      // On récupère les projets dont le statut est 'Valide_Division'
      const { data } = await axiosClient.get("/projets?statut=Valide_Division");
      setProposals(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveProject = async (id) => {
    if (!window.confirm("Approuver ce projet pour le CERIST ?")) return;
    try {
      await axiosClient.patch(`/projets/${id}/approuver-cs`);
      setProposals(proposals.filter(p => p.id !== id));
    } catch (error) {
      alert("Erreur lors de l'approbation.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-cyan-100 text-cyan-700 rounded-2xl">
          <Globe size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Approbations Nationales</h1>
          <p className="text-slate-500 text-sm">Décision finale pour les propositions validées par les divisions.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cyan-600" size={40} /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-sm font-bold text-slate-600">Projet</th>
                <th className="p-4 text-sm font-bold text-slate-600">Division d'Origine</th>
                <th className="p-4 text-sm font-bold text-slate-600">Chef de Projet</th>
                <th className="p-4 text-sm font-bold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proposals.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{p.titre}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{p.resume}</p>
                  </td>
                  <td className="p-4 text-sm text-slate-600 font-medium">{p.division?.acronyme}</td>
                  <td className="p-4 text-sm text-slate-600">{p.chef_projet?.nom}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => approveProject(p.id)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition">
                      <CheckCircle2 size={16} /> Approuver
                    </button>
                  </td>
                </tr>
              ))}
              {proposals.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-slate-400 italic">Aucun projet en attente d'approbation nationale.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}