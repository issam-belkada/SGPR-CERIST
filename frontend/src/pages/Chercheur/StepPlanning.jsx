import React from "react";
import { Plus, Trash2, FileText, ListTodo, Layers, AlertCircle, Tag, Target } from "lucide-react";

export default function StepPlanning({ formData, setFormData }) {
  
  // Types exacts synchronisés avec la contrainte CHECK de PostgreSQL
  const typesLivrables = [
    { value: "Rapport_Technique", label: "Rapport Technique" },
    { value: "Manuel_Utilisateur", label: "Manuel Utilisateur" },
    { value: "Code_Source", label: "Code Source" },
    { value: "Synthese_Biblio", label: "Synthèse Bibliographique" },
    { value: "Expertise", label: "Expertise" },
    { value: "Logiciel_Code", label: "Logiciel / Code" },
    { value: "Prototype", label: "Prototype" },
    { value: "Publication", label: "Publication" },
    { value: "Brevet", label: "Brevet" },
    { value: "Autre", label: "Autre" }
  ];

  const addWP = () => {
    setFormData({
      ...formData,
      wps: [...formData.wps, { 
        id: Date.now(), 
        code_wp: `WP${formData.wps.length + 1}`, 
        titre: "", 
        objectifs: "", 
        taches: [] 
      }]
    });
  };

  const addTache = (wpId) => {
    const newWPs = formData.wps.map(wp => {
      if (wp.id === wpId) {
        return { 
          ...wp, 
          taches: [...wp.taches, { 
            id: Date.now(), 
            nom: "", 
            responsable_id: "", 
            livrables: [] 
          }] 
        };
      }
      return wp;
    });
    setFormData({ ...formData, wps: newWPs });
  };

  const addLivrable = (wpId, tacheId) => {
    const newWPs = formData.wps.map(wp => {
      if (wp.id === wpId) {
        const newTaches = wp.taches.map(t => {
          if (t.id === tacheId) {
            return { 
              ...t, 
              livrables: [...(t.livrables || []), { 
                id: Date.now(), 
                titre: "", 
                type: "Rapport_Technique" 
              }] 
            };
          }
          return t;
        });
        return { ...wp, taches: newTaches };
      }
      return wp;
    });
    setFormData({ ...formData, wps: newWPs });
  };

  const removeWP = (wpId) => {
    setFormData({ ...formData, wps: formData.wps.filter(wp => wp.id !== wpId) });
  };

  const removeTache = (wpId, tacheId) => {
    const newWPs = formData.wps.map(wp => {
      if (wp.id === wpId) {
        return { ...wp, taches: wp.taches.filter(t => t.id !== tacheId) };
      }
      return wp;
    });
    setFormData({ ...formData, wps: newWPs });
  };

  const removeLivrable = (wpId, tacheId, livId) => {
    const newWPs = formData.wps.map(wp => {
      if (wp.id === wpId) {
        const newTaches = wp.taches.map(t => {
          if (t.id === tacheId) {
            return { ...t, livrables: t.livrables.filter(l => l.id !== livId) };
          }
          return t;
        });
        return { ...wp, taches: newTaches };
      }
      return wp;
    });
    setFormData({ ...formData, wps: newWPs });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">V.3 PLANNING</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Lots de travail & Livrables</p>
        </div>
        <button onClick={addWP} className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-xl shadow-slate-200">
          <Layers size={16} /> Nouveau WP
        </button>
      </div>

      {formData.wps.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <AlertCircle className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="text-slate-400 font-bold">Aucun lot de travail défini.</p>
        </div>
      )}

      {formData.wps.map((wp, wpIdx) => (
        <div key={wp.id} className="group relative bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all mb-8">
          <div className="flex gap-4 items-start mb-8">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-xl border border-indigo-100">
              {wpIdx + 1}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-indigo-400">Identification du Lot {wp.code_wp}</label>
                <button onClick={() => removeWP(wp.id)} className="text-rose-400 hover:text-rose-600 p-2"><Trash2 size={18} /></button>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <input 
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 font-black" 
                  placeholder="Titre du lot (ex: Analyse des besoins...)"
                  value={wp.titre}
                  onChange={(e) => {
                    const updatedWps = [...formData.wps];
                    updatedWps[wpIdx].titre = e.target.value;
                    setFormData({...formData, wps: updatedWps});
                  }}
                />

                <div className="relative">
                  <div className="absolute left-4 top-4 text-slate-400">
                    <Target size={16} />
                  </div>
                  <textarea 
                    rows="2"
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 pl-12 text-sm font-bold text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100" 
                    placeholder="Objectifs spécifiques de ce lot de travail..."
                    value={wp.objectifs}
                    onChange={(e) => {
                      const updatedWps = [...formData.wps];
                      updatedWps[wpIdx].objectifs = e.target.value;
                      setFormData({...formData, wps: updatedWps});
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="ml-14 space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400"><ListTodo size={14}/> Tâches associées</h4>
              <button onClick={() => addTache(wp.id)} className="text-indigo-600 text-[10px] font-black hover:underline">+ AJOUTER TÂCHE</button>
            </div>

            {wp.taches.map((tache, tIdx) => (
              <div key={tache.id} className="relative bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4 group/tache">
                <button onClick={() => removeTache(wp.id, tache.id)} className="absolute -right-2 -top-2 bg-white text-rose-400 p-2 rounded-full shadow-sm opacity-0 group-hover/tache:opacity-100 transition-all border border-slate-100"><Trash2 size={14} /></button>

                <div className="flex gap-4">
                  <input 
                    className="flex-1 bg-white border-none rounded-xl p-3 text-sm font-bold shadow-sm" 
                    placeholder="Nom de la tâche..."
                    value={tache.nom}
                    onChange={(e) => {
                      const updatedWps = [...formData.wps];
                      updatedWps[wpIdx].taches[tIdx].nom = e.target.value;
                      setFormData({...formData, wps: updatedWps});
                    }}
                  />
                  <select 
                    className="bg-white border-none rounded-xl text-xs font-bold px-4 shadow-sm"
                    value={tache.responsable_id}
                    onChange={(e) => {
                      const updatedWps = [...formData.wps];
                      updatedWps[wpIdx].taches[tIdx].responsable_id = e.target.value;
                      setFormData({...formData, wps: updatedWps});
                    }}
                  >
                    <option value="">Responsable...</option>
                    {formData.membres.map(m => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.nom} {m.prenom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pl-6 border-l-2 border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    <span>Livrables attendus</span>
                    <button onClick={() => addLivrable(wp.id, tache.id)} className="text-emerald-600 hover:underline">+ NOUVEAU LIVRABLE</button>
                  </div>
                  
                  {tache.livrables?.map((liv, lIdx) => (
                    <div key={liv.id} className="flex gap-3 items-center group/liv bg-white p-2 rounded-xl border border-transparent hover:border-slate-200 transition-all shadow-sm">
                      <FileText size={14} className="text-indigo-400" />
                      <input 
                        className="flex-1 bg-transparent border-none p-1 text-xs font-bold focus:ring-0 outline-none" 
                        placeholder="Intitulé du livrable..."
                        value={liv.titre}
                        onChange={(e) => {
                          const updatedWps = [...formData.wps];
                          updatedWps[wpIdx].taches[tIdx].livrables[lIdx].titre = e.target.value;
                          setFormData({...formData, wps: updatedWps});
                        }}
                      />
                      <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                        <Tag size={10} className="text-slate-400" />
                        <select 
                          className="bg-transparent border-none text-[10px] font-black text-slate-500 p-0 focus:ring-0 cursor-pointer"
                          value={liv.type}
                          onChange={(e) => {
                            const updatedWps = [...formData.wps];
                            updatedWps[wpIdx].taches[tIdx].livrables[lIdx].type = e.target.value;
                            setFormData({...formData, wps: updatedWps});
                          }}
                        >
                          {typesLivrables.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      <button onClick={() => removeLivrable(wp.id, tache.id, liv.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}