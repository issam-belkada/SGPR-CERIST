import React, { useState, useEffect } from "react";
import { Search, UserPlus, Trash2, Percent, Users, Building2 } from "lucide-react";
import axiosClient from "../../api/axios";

export default function StepTeam({ formData, setFormData }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (query.length > 2) {
        setLoading(true);
        // Appel à la route filtrée pour les chercheurs avec leur division
        axiosClient.get(`/users/search?q=${query}`)
          .then(({ data }) => {
            setResults(data);
            setLoading(false);
          })
          .catch(err => {
            console.error("Erreur recherche:", err);
            setLoading(false);
          });
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  const addMember = (u) => {
    // Empêcher d'ajouter deux fois la même personne
    if (formData.membres.find(m => m.user_id === u.id)) return;
    
    setFormData({ 
      ...formData, 
      membres: [...formData.membres, { 
        user_id: u.id, 
        nom: u.nom, 
        prenom: u.prenom, 
        grade: u.grade,
        // "division" correspond à la "Structure de rattachement" du canevas 
        division: u.division ? u.division.nom : "N/A", 
        pourcentage: 50, 
        qualite: "permanent" 
      }]
    });
    setQuery(""); 
    setResults([]);
  };

  const updateMember = (id, field, value) => {
    const updated = formData.membres.map(m => 
      m.user_id === id ? { ...m, [field]: value } : m
    );
    setFormData({ ...formData, membres: updated });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Users className="text-indigo-500" size={28} />
          Personnel de recherche
        </h2>
        <p className="text-slate-500 text-sm ml-10">
          Section V.1 : Identifiez les membres intervenant dans l'exécution du projet.
        </p>
      </div>
      
      {/* Barre de Recherche Dynamique */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-indigo-500">
          <Search size={20} className={loading ? "animate-pulse" : ""} />
        </div>
        <input 
          className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none font-bold transition-all shadow-sm" 
          placeholder="Rechercher un chercheur par nom ou prénom..." 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
        />
        
        {/* Liste des résultats (Dropdown) */}
        {results.length > 0 && (
          <div className="absolute w-full bg-white shadow-2xl rounded-2xl mt-2 z-50 border border-slate-100 overflow-hidden">
            {results.map(u => (
              <div 
                key={u.id} 
                onClick={() => addMember(u)} 
                className="p-4 hover:bg-indigo-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-none group"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 group-hover:text-indigo-600">
                    {u.nom} {u.prenom}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase">
                      {u.grade || 'Sans Grade'}
                    </span>
                    <span className="text-[10px] text-indigo-400 font-medium flex items-center gap-1">
                      <Building2 size={10} />
                      {u.division ? u.division.nom : 'Pas de division'}
                    </span>
                  </div>
                </div>
                <UserPlus size={18} className="text-slate-300 group-hover:text-indigo-500" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tableau des membres sélectionnés */}
      <div className="space-y-4">
        {formData.membres.map((m) => (
          <div key={m.user_id} className="flex flex-wrap md:flex-nowrap items-center gap-6 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:border-indigo-100 transition-all">
            <div className="flex-1 min-w-[200px]">
              <p className="font-black text-slate-800 text-lg">{m.nom} {m.prenom}</p>
              <div className="flex gap-3 mt-1">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase">
                  {m.grade}
                </span>
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Building2 size={12} /> {m.division}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Temps consacré (%)  */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Temps (%)</label>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                  <Percent size={12} className="text-indigo-400" />
                  <input 
                    type="number" 
                    className="w-10 bg-transparent border-none p-0 font-black text-indigo-600 outline-none" 
                    value={m.pourcentage} 
                    min="1" max="100"
                    onChange={e => updateMember(m.user_id, 'pourcentage', e.target.value)} 
                  />
                </div>
              </div>

              {/* Qualité (Permanent / Associé) [cite: 28, 30] */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Qualité</label>
                <select 
                  className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 font-bold text-slate-600 outline-none text-sm cursor-pointer"
                  value={m.qualite}
                  onChange={e => updateMember(m.user_id, 'qualite', e.target.value)}
                >
                  <option value="permanent">Permanent</option>
                  <option value="associe">Associé</option>
                </select>
              </div>

              <button 
                onClick={() => setFormData({...formData, membres: formData.membres.filter(x => x.user_id !== m.user_id)})} 
                className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all self-end"
                title="Retirer ce membre"
              >
                <Trash2 size={18}/>
              </button>
            </div>
          </div>
        ))}

        {formData.membres.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
            <Users size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">Aucun membre sélectionné pour l'équipe du projet.</p>
            <p className="text-slate-300 text-xs mt-1">Utilisez la barre de recherche ci-dessus pour ajouter des chercheurs.</p>
          </div>
        )}
      </div>
    </div>
  );
}