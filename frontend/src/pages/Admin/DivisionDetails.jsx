import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { ArrowLeft, User, Mail, Loader2, Crown, UserCheck } from "lucide-react";

export default function DivisionDetails() {
  const { id } = useParams();
  const [division, setDivision] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDivisionData = () => {
    setLoading(true);
    axiosClient.get(`/divisions/${id}`)
      .then(({ data }) => {
        setDivision(data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchDivisionData(); }, [id]);

  const handleAssignChef = (userId) => {
    if (window.confirm("Désigner ce chercheur comme responsable de la division ?")) {
      axiosClient.put(`/divisions/${id}/assign-chef`, { chef_id: userId })
        .then(() => fetchDivisionData()) // Rafraîchir pour voir le nouveau chef
        .catch(err => alert("Erreur lors de l'assignation"));
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={40} /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/admin/divisions" className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors">
        <ArrowLeft size={20}/> Retour aux divisions
      </Link>

      {/* Header avec badge du Chef */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 bg-slate-900 text-white flex justify-between items-start">
          <div>
            <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-black uppercase mb-4 inline-block tracking-widest">Structure de Recherche</span>
            <h1 className="text-3xl font-black">{division.nom} ({division.acronyme})</h1>
          </div>
          {division.chef_id && (
            <div className="bg-amber-400 text-amber-950 px-4 py-2 rounded-2xl flex items-center gap-2 font-black shadow-lg shadow-amber-900/20">
              <Crown size={20} /> RESPONSABLE NOMMÉ
            </div>
          )}
        </div>
        
        <div className="p-8">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-wider mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed">{division.description || "Aucune description."}</p>
        </div>
      </div>

      {/* Liste des membres avec action de nomination */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2">
          <User size={20} className="text-indigo-500" /> Effectif de la division
        </h2>
        
        <div className="grid grid-cols-1 gap-3">
          {division.users?.map(u => {
            const isChef = division.chef_id === u.id;
            return (
              <div key={u.id} className={`bg-white p-5 rounded-2xl border transition-all flex items-center justify-between ${isChef ? 'border-amber-300 bg-amber-50/30 ring-1 ring-amber-200' : 'border-slate-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${isChef ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {u.nom[0]}{u.prenom[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{u.nom} {u.prenom}</p>
                    <p className="text-xs text-slate-500 font-medium">{u.grade} • {u.email}</p>
                  </div>
                </div>

                {isChef ? (
                  <span className="flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-tighter bg-amber-100 px-3 py-1.5 rounded-full">
                    <UserCheck size={14} /> Chef Actuel
                  </span>
                ) : (
                  <button 
                    onClick={() => handleAssignChef(u.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all group"
                  >
                    <Crown size={14} className="group-hover:rotate-12 transition-transform" />
                    Nommer Chef
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}