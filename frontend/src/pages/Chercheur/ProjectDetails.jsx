import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { 
  FolderKanban, FileCheck, Info, Calendar, CheckCircle2, 
  Clock, FileText, User as UserIcon, AlertCircle, 
  Loader2, Lock, LayoutGrid, Download, Eye, ArrowRight
} from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projet, setProjet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const user = JSON.parse(localStorage.getItem('user'));
  const myId = user?.id;

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get(`/projet-details/${id}`);
      setProjet(data);
    } catch (err) {
      console.error("Erreur projet:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  // Fonction pour télécharger le PDF
  const handleDownload = async (livrable) => {
    try {
      const response = await axiosClient.get(`/livrables/${livrable.id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${livrable.titre}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Erreur lors du téléchargement du fichier.");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50/50">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 border-4 border-indigo-100 rounded-full"></div>
        <Loader2 className="animate-spin text-indigo-600 relative" size={32} />
      </div>
      <p className="mt-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Initialisation</p>
    </div>
  );

  if (!projet) return <div className="p-10 text-center"><AlertCircle className="mx-auto text-red-500 mb-4" size={48} /><p>Projet introuvable.</p></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER PREMIUM */}
      <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap justify-between items-start gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
                  {projet.type}
                </span>
                <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${
                  projet.statut === 'enCours' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${projet.statut === 'enCours' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
                  {projet.statut}
                </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {projet.titre}
              </h1>
            </div>

            {/* Statistiques Rapides */}
            <div className="bg-slate-50 p-6 rounded-[2rem] flex gap-8 items-center border border-slate-100">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tâches</p>
                <p className="text-xl font-black text-slate-800">
                  {projet.work_packages?.reduce((acc, wp) => acc + (wp.taches?.length || 0), 0)}
                </p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Livrables</p>
                <p className="text-xl font-black text-slate-800">
                  {projet.all_livrables?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-10 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase">Démarrage</p>
                <p className="text-xs font-bold text-slate-700">{new Date(projet.date_debut).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <UserIcon size={18} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase">Chef de Projet</p>
                <p className="text-xs font-bold text-slate-700">{projet.chef_projet?.nom} {projet.chef_projet?.prenom}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                <LayoutGrid size={18} />
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase">Division</p>
                <p className="text-xs font-bold text-slate-700">{projet.division?.acronyme}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ONGLETS NAVIGATION */}
        <div className="flex gap-10 mt-12 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Vue d'ensemble", icon: <Info size={18}/> },
            { id: "tasks", label: "Plan de Travail", icon: <FolderKanban size={18}/> },
            { id: "deliverables", label: "Livrables PDF", icon: <FileCheck size={18}/> },
          ].map(tab => (
            <button
              key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-indigo-600 rounded-full animate-in zoom-in"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU DYNAMIQUE */}
      <div className="transition-all duration-500">
        
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6">
            <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                <FileText className="text-indigo-500" />
                Problématique & Contexte
              </h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-lg leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
                  {projet.problematique}
                </p>
              </div>
            </div>
            <div className="bg-indigo-900 p-10 rounded-[3rem] text-white flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black mb-4">Objectifs Clés</h3>
                <p className="text-indigo-200 text-sm leading-relaxed">{projet.objectifs || "Aucun objectif spécifique défini."}</p>
              </div>
              <div className="mt-8 pt-8 border-t border-indigo-800">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Nature du projet</p>
                <p className="text-2xl font-black">{projet.nature}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6">
            {projet.work_packages?.map((wp) => (
              <div key={wp.id} className="group">
                <div className="flex items-center gap-4 mb-4 ml-4">
                  <div className="w-12 h-px bg-slate-200"></div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{wp.code_wp} : {wp.titre}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wp.taches?.map((tache) => {
                    const isMyTask = Number(tache.responsable_id) === Number(projet.auth_user_id || myId);
                    return (
                      <div 
                        key={tache.id}
                        onClick={() => isMyTask && navigate(`/chercheur/taches/${tache.id}`)}
                        className={`group p-8 rounded-[2.5rem] border-2 transition-all relative ${
                          isMyTask 
                          ? 'bg-white border-white shadow-xl shadow-slate-200/50 cursor-pointer hover:-translate-y-2 hover:border-indigo-200' 
                          : 'bg-slate-50 border-transparent opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            isMyTask ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-400'
                          }`}>
                            {tache.etat === 'Terminé' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                          </div>
                          {isMyTask && <ArrowRight size={18} className="text-indigo-300 group-hover:text-indigo-600 transition-colors" />}
                          {!isMyTask && <Lock size={16} className="text-slate-300" />}
                        </div>
                        <h5 className={`font-black text-sm mb-2 ${isMyTask ? 'text-slate-800' : 'text-slate-400'}`}>{tache.nom}</h5>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {isMyTask ? "⭐ Ma Responsabilité" : tache.responsable?.nom || "Non assigné"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "deliverables" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6">
            {(projet.all_livrables || []).map((l) => {
              const isMine = Number(l.depose_par) === Number(projet.auth_user_id || myId);
              return (
                <div key={l.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm group hover:shadow-2xl hover:shadow-indigo-100 transition-all border-b-4 hover:border-b-indigo-500">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                      <FileText size={28} />
                    </div>
                    {isMine && <span className="text-[8px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase">Déposé par moi</span>}
                  </div>
                  <h5 className="text-lg font-black text-slate-800 leading-tight mb-4 min-h-[3rem]">{l.titre}</h5>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{l.type.replace('_', ' ')}</span>
                      <span>{new Date(l.date_depot).toLocaleDateString()}</span>
                    </div>
                    
                    {/* BOUTONS D'ACTION */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      
                      <button 
                        onClick={() => handleDownload(l)}
                        className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      >
                        <Download size={14} /> PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {(!projet.all_livrables || projet.all_livrables.length === 0) && (
              <div className="col-span-full py-32 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <FileCheck size={40} />
                </div>
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Aucun livrable disponible pour le moment</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}