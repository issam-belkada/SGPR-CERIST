import React, { useState } from 'react';
import { X, ClipboardList, Save, Loader2, Plus, Trash2, FileText, User, AlignLeft } from 'lucide-react';
import axiosClient from '../../api/axios';

export default function TacheModal({ wp, membres, onClose, onRefresh }) {
    const [loading, setLoading] = useState(false);
    
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

    const [livrablesAttendu, setLivrablesAttendu] = useState([{ titre: '', type: 'Rapport_Technique' }]);
    
    const [formData, setFormData] = useState({
        nom: '',
        description: '', 
        responsable_id: '', // Ce champ causait l'erreur car il restait vide
        work_package_id: wp.id
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosClient.post('/taches', { 
                ...formData, 
                livrables: livrablesAttendu 
            });
            onRefresh();
            onClose();
        } catch (err) {
            // Affiche l'erreur précise venant de Laravel si elle existe
            const errorMsg = err.response?.data?.message || "Erreur lors de la création";
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in">
                <div className="sticky top-0 bg-white/90 backdrop-blur-md p-8 border-b border-slate-100 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><ClipboardList size={20} /></div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Nouvelle Tâche</h2>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase">Lot: {wp.code_wp}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Nom de la tâche */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Nom de la mission</label>
                        <input type="text" required placeholder="Ex: Développement du module auth" value={formData.nom} 
                            onChange={(e)=>setFormData({...formData, nom: e.target.value})}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black focus:ring-2 focus:ring-indigo-500 outline-none"/>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 flex items-center gap-1"><AlignLeft size={10}/> Description</label>
                        <textarea required placeholder="Détails de la tâche..." value={formData.description}
                            onChange={(e)=>setFormData({...formData, description: e.target.value})}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none h-24 resize-none"/>
                    </div>

                    {/* Sélection du Responsable (RÉAJOUTÉ ICI) */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 flex items-center gap-1"><User size={10}/> Responsable de la tâche</label>
                        <select required value={formData.responsable_id} 
                            onChange={(e)=>setFormData({...formData, responsable_id: e.target.value})}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none appearance-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">Choisir un membre...</option>
                            {membres?.map(m => (
                                <option key={m.id} value={m.id}>{m.prenom} {m.nom}</option>
                            ))}
                        </select>
                    </div>

                    {/* Section Livrables */}
                    <div className="pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Livrables à fournir</h3>
                            <button type="button" onClick={() => setLivrablesAttendu([...livrablesAttendu, { titre: '', type: 'Rapport_Technique' }])} 
                                className="text-indigo-600 text-[10px] font-black hover:underline">+ AJOUTER</button>
                        </div>
                        {livrablesAttendu.map((liv, idx) => (
                            <div key={idx} className="flex gap-2 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <FileText size={16} className="text-indigo-400 shrink-0" />
                                <input type="text" placeholder="Titre..." required value={liv.titre}
                                    onChange={(e) => {
                                        const nl = [...livrablesAttendu]; nl[idx].titre = e.target.value; setLivrablesAttendu(nl);
                                    }}
                                    className="flex-1 bg-transparent border-none text-xs font-bold outline-none" />
                                <select value={liv.type} onChange={(e) => {
                                        const nl = [...livrablesAttendu]; nl[idx].type = e.target.value; setLivrablesAttendu(nl);
                                    }}
                                    className="bg-white border border-slate-200 rounded-xl text-[10px] font-black px-2 py-1 outline-none">
                                    {typesLivrables.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                </select>
                                <button type="button" onClick={() => setLivrablesAttendu(livrablesAttendu.filter((_,i)=>i!==idx))} className="text-rose-400 p-1"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} Enregistrer la tâche
                    </button>
                </form>
            </div>
        </div>
    );
}