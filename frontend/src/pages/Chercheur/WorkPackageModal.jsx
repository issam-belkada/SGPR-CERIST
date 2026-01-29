import React, { useState } from 'react';
import { X, LayoutGrid, Save, Loader2, Target } from 'lucide-react';
import axiosClient from '../../api/axios';

export default function WorkPackageModal({ projet, onClose, onRefresh }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titre: '',
        // On génère le code basé sur le nombre actuel de WP
        code_wp: `WP${(projet.work_packages?.length || 0) + 1}`,
        objectifs: '',
        projet_id: projet.id
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Utilisation des backticks (`) pour injecter dynamiquement l'ID du projet
            await axiosClient.post(`/projets/${projet.id}/work-packages`, formData);
            onRefresh();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création du WP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <LayoutGrid size={20} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Nouveau Lot (WP)</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Code</label>
                            <input type="text" value={formData.code_wp} readOnly
                                className="w-full px-4 py-3 bg-slate-100 border border-slate-100 rounded-2xl font-black text-slate-500 outline-none cursor-not-allowed"/>
                        </div>
                        <div className="col-span-3">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Titre du lot</label>
                            <input type="text" required placeholder="ex: Analyse des besoins" value={formData.titre}
                                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-black focus:ring-2 focus:ring-indigo-500 outline-none"/>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Objectifs du lot</label>
                        <div className="relative">
                            <Target className="absolute left-4 top-4 text-slate-300" size={16} />
                            <textarea required rows="4" value={formData.objectifs}
                                onChange={(e) => setFormData({...formData, objectifs: e.target.value})}
                                className="w-full px-4 py-3 pl-12 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Quels sont les résultats attendus ?"/>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} 
                        Créer le WP
                    </button>
                </form>
            </div>
        </div>
    );
}