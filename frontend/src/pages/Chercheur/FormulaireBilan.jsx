import React, { useState, useEffect } from 'react';
import { 
    Save, Send, Plus, Trash2, FileText, Users, 
    BarChart3, AlertCircle, CheckCircle, XCircle 
} from 'lucide-react';
import axios from 'axios';

const FormulaireBilan = ({ projetId, initialData = null }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    
    // État initial basé sur la structure du canevas [cite: 1, 23, 51]
    const [formData, setFormData] = useState({
        annee: new Date().getFullYear(),
        avancement_physique: 0,
        objectifs_realises: '',
        collaborations: '',
        diff_scientifiques: '',
        diff_materielles: '',
        diff_humaines: '',
        autres_resultats: '',
        productions_sci: [],
        productions_tech: [],
        encadrements: []
    });

    // Chargement des données existantes (si modification d'un brouillon)
    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- Logique des Tableaux Dynamiques (Section 4 du canevas) ---
    const addRow = (section, initialObj) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], initialObj]
        }));
    };

    const removeRow = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const handleDynamicChange = (section, index, field, value) => {
        const newArray = [...formData[section]];
        newArray[index][field] = value;
        setFormData(prev => ({ ...prev, [section]: newArray }));
    };

    // Action : Enregistrer le Brouillon
    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/projets/${projetId}/bilans`, formData);
            alert("Brouillon enregistré avec succès !");
            if (response.data.bilan) setFormData(response.data.bilan);
        } catch (error) {
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    // Action : Soumission Finale
    const handleFinalSubmit = async () => {
        setLoading(true);
        try {
            await axios.post(`/api/bilans/${formData.id}/soumettre`);
            alert("Bilan soumis officiellement à la division.");
            setShowConfirmModal(false);
            window.location.reload(); // Recharger pour passer en mode lecture seule
        } catch (error) {
            alert("Erreur lors de la soumission.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
            {/* --- HEADER --- */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="text-blue-400" /> Bilan Annuel {formData.annee}
                    </h1>
                    <p className="text-slate-400 text-sm">Canevas de suivi des activités de recherche</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-slate-700 hover:bg-slate-600 px-5 py-2 rounded-lg flex items-center gap-2 transition font-medium border border-slate-600"
                    >
                        <Save size={18} /> {loading ? '...' : 'Enregistrer Brouillon'}
                    </button>
                    <button 
                        onClick={() => setShowConfirmModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg flex items-center gap-2 transition font-bold shadow-lg shadow-blue-900/20"
                    >
                        <Send size={18} /> Soumettre
                    </button>
                </div>
            </div>

            {/* --- NAVIGATION --- */}
            <div className="flex border-b bg-slate-50 overflow-x-auto">
                {[
                    { id: 'general', label: '1-3. Identification & Objectifs', icon: <FileText size={18}/> },
                    { id: 'resultats', label: '4.1-4.2 Résultats Prod.', icon: <BarChart3 size={18}/> },
                    { id: 'formation', label: '4.3 Formation & Encadrement', icon: <Users size={18}/> },
                    { id: 'difficultes', label: '5-6. Difficultés & Collab.', icon: <AlertCircle size={18}/> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-all ${
                            activeTab === tab.id 
                            ? 'border-b-4 border-blue-600 text-blue-600 bg-white' 
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* --- CONTENU --- */}
            <div className="p-8 min-h-[500px]">
                
                {/* Section 1-3 : Identification & Objectifs [cite: 5, 22] */}
                {activeTab === 'general' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <label className="block text-blue-800 font-bold mb-2">
                                1.9 Estimation de l'état d'avancement du projet (%) 
                            </label>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="range" name="avancement_physique" min="0" max="100"
                                    value={formData.avancement_physique} onChange={handleChange}
                                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-2xl font-black text-blue-600 w-16">{formData.avancement_physique}%</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-700 font-bold mb-2 uppercase text-xs tracking-wider">
                                3. Objectifs du Projet (Réalisés) [cite: 22]
                            </label>
                            <textarea 
                                name="objectifs_realises" rows="8"
                                value={formData.objectifs_realises} onChange={handleChange}
                                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 transition"
                                placeholder="Détaillez ici les objectifs atteints durant cette année civile..."
                            ></textarea>
                        </div>
                    </div>
                )}

                {/* Section 4.1 & 4.2 : Productions [cite: 24, 25] */}
                {activeTab === 'resultats' && (
                    <div className="space-y-10 animate-in fade-in duration-300">
                        {/* 4.1 Scientifique */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">4.1 Production Scientifique [cite: 24]</h3>
                                <button 
                                    onClick={() => addRow('productions_sci', { type: 'Publication_Inter', titre: '', revue_ou_conference: '', date_parution: '' })}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1"
                                >
                                    <Plus size={16}/> Ajouter une ligne
                                </button>
                            </div>
                            <div className="overflow-hidden border border-slate-200 rounded-xl">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="p-3 text-left">Type [cite: 24]</th>
                                            <th className="p-3 text-left">Titre de l'ouvrage / article</th>
                                            <th className="p-3 text-left">Revue / Conférence</th>
                                            <th className="p-3 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {formData.productions_sci.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50">
                                                <td className="p-3">
                                                    <select 
                                                        value={item.type} 
                                                        onChange={(e) => handleDynamicChange('productions_sci', idx, 'type', e.target.value)}
                                                        className="w-full border-slate-200 rounded-lg text-xs"
                                                    >
                                                        <option value="Publication_Inter">Publication Inter.</option>
                                                        <option value="Communication_Nat">Communication Nat.</option>
                                                        <option value="Livre">Livre / Chapitre</option>
                                                    </select>
                                                </td>
                                                <td className="p-3">
                                                    <input type="text" value={item.titre} onChange={(e) => handleDynamicChange('productions_sci', idx, 'titre', e.target.value)} className="w-full border-slate-200 rounded-lg" />
                                                </td>
                                                <td className="p-3">
                                                    <input type="text" value={item.revue_ou_conference} onChange={(e) => handleDynamicChange('productions_sci', idx, 'revue_ou_conference', e.target.value)} className="w-full border-slate-200 rounded-lg" />
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button onClick={() => removeRow('productions_sci', idx)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section 4.3 : Formation [cite: 35] */}
                {activeTab === 'formation' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800">4.3 Formation pour la recherche (Encadrement) [cite: 35]</h3>
                            <button 
                                onClick={() => addRow('encadrements', { nom_etudiant: '', type_diplome: 'Doctorat', sujet: '', etat_avancement: 'En cours' })}
                                className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                            >
                                <Plus size={16}/> Inscrire un étudiant
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.encadrements.map((item, idx) => (
                                <div key={idx} className="p-4 border-2 border-slate-100 rounded-xl bg-slate-50 relative">
                                    <button 
                                        onClick={() => removeRow('encadrements', idx)}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400">Nom & Prénom Étudiant [cite: 14]</label>
                                            <input type="text" value={item.nom_etudiant} onChange={(e) => handleDynamicChange('encadrements', idx, 'nom_etudiant', e.target.value)} className="w-full border-slate-200 rounded-lg mt-1" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">Diplôme préparé [cite: 18, 42]</label>
                                            <select value={item.type_diplome} onChange={(e) => handleDynamicChange('encadrements', idx, 'type_diplome', e.target.value)} className="w-full border-slate-200 rounded-lg mt-1 text-sm">
                                                <option value="Doctorat">Doctorat</option>
                                                <option value="Master">Master / Magister</option>
                                                <option value="PFE">PFE (Ingéniorat/TS)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black uppercase text-slate-400">État [cite: 42]</label>
                                            <select value={item.etat_avancement} onChange={(e) => handleDynamicChange('encadrements', idx, 'etat_avancement', e.target.value)} className="w-full border-slate-200 rounded-lg mt-1 text-sm">
                                                <option value="En cours">En cours</option>
                                                <option value="Soutenu">Soutenu</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 5 & 6 : Difficultés [cite: 48, 51] */}
                {activeTab === 'difficultes' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                         <div>
                            <label className="block text-slate-700 font-bold mb-2 uppercase text-xs">5. Collaborations (Scientifiques / Industrielles) [cite: 48]</label>
                            <textarea name="collaborations" value={formData.collaborations} onChange={handleChange} className="w-full p-3 border-2 border-slate-200 rounded-lg" rows="3"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                <label className="block text-red-800 font-bold mb-2 text-sm italic underline">6.1 Plan Scientifique [cite: 52]</label>
                                <textarea name="diff_scientifiques" value={formData.diff_scientifiques} onChange={handleChange} className="w-full p-2 border-red-200 rounded-lg text-sm" rows="4"></textarea>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <label className="block text-orange-800 font-bold mb-2 text-sm italic underline">6.2 Plan Matériel [cite: 55]</label>
                                <textarea name="diff_materielles" value={formData.diff_materielles} onChange={handleChange} className="w-full p-2 border-orange-200 rounded-lg text-sm" rows="4"></textarea>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <label className="block text-blue-800 font-bold mb-2 text-sm italic underline">6.3 Ressources Humaines [cite: 58]</label>
                                <textarea name="diff_humaines" value={formData.diff_humaines} onChange={handleChange} className="w-full p-2 border-blue-200 rounded-lg text-sm" rows="4"></textarea>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* --- MODAL DE CONFIRMATION --- */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <AlertCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 text-center mb-2">Soumettre le Bilan ?</h3>
                        <p className="text-slate-500 text-center mb-8 leading-relaxed">
                            Cette action est définitive. Le bilan sera transmis à votre Chef de Division et vous ne pourrez plus le modifier.
                        </p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition"
                            >
                                Revoir
                            </button>
                            <button 
                                onClick={handleFinalSubmit}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-blue-200 transition"
                            >
                                {loading ? 'Envoi...' : <><Send size={18}/> Confirmer</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormulaireBilan;