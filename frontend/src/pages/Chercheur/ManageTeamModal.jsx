import React, { useState, useEffect } from 'react';
import { X, Users, Search, UserPlus, UserMinus, Loader2, ShieldCheck } from 'lucide-react';
import axiosClient from '../../api/axios';

export default function ManageTeamModal({ projet, onClose, onRefresh }) {
    const [search, setSearch] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    // Charger les chercheurs disponibles via la route /users/search
    const fetchAvailableUsers = async () => {
        setLoading(true);
        try {
            // Correspond à votre route Laravel: Route::get('/users/search', [ProjetController::class, 'searchUsers']);
            // Utilise 'q' pour le texte et 'exclude_project' pour filtrer les membres actuels
            const { data } = await axiosClient.get(`/users/search?exclude_project=${projet.id}&q=${search}`);
            setAvailableUsers(data);
        } catch (err) {
            console.error("Erreur lors du chargement des chercheurs:", err);
        } finally {
            setLoading(false);
        }
    };

    // Déclencher la recherche quand le texte change
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchAvailableUsers();
        }, 300); // Délai de 300ms pour ne pas harceler le serveur à chaque lettre

        return () => clearTimeout(delayDebounceFn);
    }, [search, projet.id]);

    const handleAddMember = async (userId) => {
        setActionLoading(userId);
        try {
            // Utilise votre route: Route::post('/projets/{projet}/membres', [ProjetController::class, 'ajouterMembre']);
            await axiosClient.post(`/projets/${projet.id}/membres`, { 
                user_id: userId,
                pourcentage_participation: 20, // Valeur par défaut requise par votre validation
                qualite: 'permanent'           // Valeur par défaut requise par votre validation
            });
            
            await onRefresh(); // Met à jour le composant parent (ProjectDetails)
            fetchAvailableUsers(); // Rafraîchit la liste de recherche pour faire disparaître l'ajouté
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Erreur lors de l'ajout";
            alert(errorMsg);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!window.confirm("Retirer ce membre du projet ?")) return;
        setActionLoading(userId);
        try {
            // Utilise votre route: Route::delete('/projets/{projet}/membres/{user}', [ProjetController::class, 'retirerMembre']);
            await axiosClient.delete(`/projets/${projet.id}/membres/${userId}`);
            await onRefresh();
            fetchAvailableUsers();
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Erreur lors du retrait";
            alert(errorMsg);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Gestion de l'équipe</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{projet.membres?.length || 0} membres actifs</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    
                    {/* Section 1: Membres Actuels */}
                    <section>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Membres Actuels</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {projet.membres?.map(membre => (
                                <div key={membre.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 border border-slate-200">
                                            {membre.nom ? membre.nom[0] : '?'}{membre.prenom ? membre.prenom[0] : '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{membre.prenom} {membre.nom}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">{membre.grade || 'Chercheur'}</p>
                                        </div>
                                    </div>
                                    
                                    {Number(membre.id) === Number(projet.chef_projet_id) ? (
                                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase">
                                            <ShieldCheck size={12}/> Responsable
                                        </span>
                                    ) : (
                                        <button 
                                            disabled={actionLoading === membre.id}
                                            onClick={() => handleRemoveMember(membre.id)}
                                            className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-30"
                                        >
                                            {actionLoading === membre.id ? <Loader2 className="animate-spin" size={18}/> : <UserMinus size={18} />}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 2: Rechercher et Ajouter */}
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Ajouter des chercheurs</h3>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="Rechercher par nom..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {loading ? (
                                <div className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" /></div>
                            ) : availableUsers.length > 0 ? (
                                availableUsers.map(u => (
                                    <div key={u.id} className="flex items-center justify-between p-4 hover:bg-indigo-50/50 rounded-2xl transition-colors border border-transparent hover:border-indigo-100 group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                <Users size={16} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-800">{u.prenom} {u.nom}</p>
                                                <p className="text-[10px] text-indigo-500 font-black uppercase">{u.division?.nom || 'Sans division'}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleAddMember(u.id)}
                                            disabled={actionLoading === u.id}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {actionLoading === u.id ? <Loader2 className="animate-spin" size={14}/> : <UserPlus size={14} />} Ajouter
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-6 text-slate-400 text-xs font-bold italic">
                                    {search.length > 0 ? "Aucun chercheur trouvé" : "Tapez un nom pour rechercher"}
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}