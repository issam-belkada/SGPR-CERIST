import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { 
  Users2, Globe, Mail, MapPin, Target, 
  ShieldCheck, Loader2, Sparkles
} from "lucide-react";

export default function MaDivision() {
  const [division, setDivision] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDivisionData = async () => {
      try {
        const { data } = await axiosClient.get("/mon-entite-division");
        setDivision(data);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchDivisionData();
  }, []);

  if (loading) return (
    <div className="h-[50vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={30} />
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
      
      {/* --- HERO SECTION : PLUS COMPACTE --- */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30">
              <Sparkles size={12} className="text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-indigo-100">Structure</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
              Division <span className="text-indigo-400">{division?.acronyme}</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium border-l border-indigo-500/30 pl-4">
              {division?.nom}
            </p>
          </div>
          <div className="w-28 h-28 bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-white/10 backdrop-blur-sm">
              <span className="text-5xl font-black text-indigo-500 uppercase">{division?.acronyme?.charAt(0)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LISTE DES MEMBRES --- */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users2 size={18} className="text-indigo-600" /> Membres
              </h3>
              <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
                {division?.users?.length || 0} CHERCHEURS
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {division?.users?.map((membre) => (
                <div key={membre.id} className="p-4 bg-slate-50/50 rounded-[1.2rem] flex items-center gap-4 border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                  <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center font-black text-sm text-white">
                    {membre.nom?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm leading-none truncate uppercase">
                        {membre.nom} {membre.prenom}
                    </h4>
                    <p className="text-[9px] text-indigo-600 font-bold uppercase mt-1.5 tracking-wider">
                        {membre.grade || "Chercheur"}
                    </p>
                  </div>
                  <a href={`mailto:${membre.email}`} className="p-2 text-slate-300 hover:text-indigo-600">
                    <Mail size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RESPONSABLE ET INFOS --- */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
               <ShieldCheck size={16} className="text-indigo-600"/> Responsable
            </h3>
            <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-[1.2rem] border border-indigo-100">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white uppercase">
                  {division?.chef?.nom?.charAt(0) || "?"}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-900 text-sm truncate uppercase">{division?.chef?.nom}</p>
                  <p className="text-[9px] text-indigo-600 font-bold uppercase">Chef de Division</p>
                </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-lg">
            <h3 className="text-xs font-black mb-4 flex items-center gap-2 uppercase tracking-widest">
              <Target size={16} className="text-indigo-400" /> Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Recherche", "Innovation", "CERIST", "Lab"].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-tighter border border-white/5">
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