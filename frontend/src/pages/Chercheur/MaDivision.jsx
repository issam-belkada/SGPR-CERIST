import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { 
  Users2, Beaker, Globe, Mail, 
  MapPin, Target, ShieldCheck, Loader2 
} from "lucide-react";

export default function MaDivision() {
  const [division, setDivision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDivisionData = async () => {
      try {
        setLoading(true);
        // Appel à la route corrigée dans AdminController
        const { data } = await axiosClient.get("/mon-entite-division");
        setDivision(data);
      } catch (err) {
        console.error("Erreur division:", err);
        setError(err.response?.data?.message || "Impossible de charger les données de la division.");
      } finally {
        setLoading(false);
      }
    };
    fetchDivisionData();
  }, []);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  );

  if (error) return (
    <div className="h-96 flex flex-col items-center justify-center text-slate-500 bg-white rounded-[3rem] border border-dashed border-slate-200">
      <ShieldCheck size={48} className="mb-4 opacity-10" />
      <p className="font-bold text-slate-800">{error}</p>
      <p className="text-xs mt-1">Contactez votre administrateur si cela semble être une erreur.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- SECTION HERO : INFOS GÉNÉRALES --- */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 rounded-full border border-indigo-500/30">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Structure de Recherche</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">{division?.nom}</h1>
            <p className="text-slate-400 max-w-xl font-medium leading-relaxed italic">
              "{division?.description || "Cette division œuvre pour l'excellence dans la recherche scientifique au sein du CERIST."}"
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <MapPin size={16} className="text-indigo-500" /> CERIST, Alger
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Globe size={16} className="text-indigo-500" /> {division?.acronyme?.toLowerCase()}.cerist.dz
              </div>
            </div>
          </div>
          <div className="hidden lg:flex w-40 h-40 bg-white/5 rounded-[2.5rem] items-center justify-center border border-white/10 backdrop-blur-sm">
             <span className="text-6xl font-black text-indigo-500 opacity-50 uppercase">{division?.acronyme?.charAt(0)}</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LISTE DES UTILISATEURS / CHERCHEURS --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-800 flex items-center gap-3">
                <Users2 className="text-indigo-500" size={22} /> Membres de l'équipe
                </h3>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                    {division?.users?.length || 0} Chercheurs
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CORRECTION : On utilise division.users au lieu de division.membres */}
              {division?.users?.map((membre) => (
                <div key={membre.id} className="p-4 bg-slate-50/50 rounded-2xl flex items-center gap-4 border border-transparent hover:border-indigo-100 transition-all group">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-indigo-600 group-hover:scale-110 transition-transform">
                    {membre.nom?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm leading-none truncate uppercase">
                        {membre.nom} {membre.prenom}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5 tracking-wider">
                        {membre.grade || "Chercheur"}
                    </p>
                  </div>
                  <a href={`mailto:${membre.email}`} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                    <Mail size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- INFOS RESPONSABLE --- */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <ShieldCheck className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="font-black text-lg mb-2 relative z-10">Chef de Division</h3>
            <p className="text-indigo-100 text-xs mb-6 relative z-10 font-medium">Responsable de la validation des projets et de la coordination scientifique.</p>
            <div className="flex items-center gap-4 relative z-10 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
               <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 uppercase">
                 {division?.chef?.nom?.charAt(0) || "?"}
               </div>
               <div className="min-w-0">
                 <p className="font-black text-sm truncate uppercase">{division?.chef?.nom} {division?.chef?.prenom}</p>
                 <p className="text-[10px] text-indigo-200 uppercase font-bold tracking-tighter">Chef de Division</p>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="font-black text-slate-800 flex items-center gap-3 mb-6">
              <Target className="text-indigo-500" size={20} /> Thématiques
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Recherche Appliquée", "Innovation", "CERIST"].map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase border border-slate-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}