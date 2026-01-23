import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { 
  TrendingUp, Users, FileCheck, AlertCircle, 
  ArrowUpRight, Calendar, BarChart3, PieChart,
  Target, Zap, Activity, Loader2
} from "lucide-react";

export default function DashboardDivision() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/division/dashboard-stats')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );

  // Map des icônes pour les stats
  const iconMap = {
    active: { icon: <Activity className="text-emerald-500" />, color: "bg-emerald-50" },
    users: { icon: <Users className="text-blue-500" />, color: "bg-blue-50" },
    rate: { icon: <FileCheck className="text-violet-500" />, color: "bg-violet-50" },
    alerts: { icon: <AlertCircle className="text-rose-500" />, color: "bg-rose-50" },
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase">
            Reporting <span className="text-emerald-600 underline decoration-emerald-200 decoration-8 underline-offset-[-2px]">Division</span>
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">
            Performance analytique • Temps réel
          </p>
        </div>
      </div>

      {/* --- GRID DE KPIS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${iconMap[stat.type].color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {iconMap[stat.type].icon}
              </div>
              <span className="text-[9px] font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                {stat.growth}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 italic tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* --- BENTO SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graphique (Placeholder) */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 p-8">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase mb-10">
                <BarChart3 size={20} className="text-emerald-500" /> Progression
            </h3>
            <div className="h-72 w-full bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Données de progression en attente</span>
            </div>
        </div>

        {/* Axes prioritaires */}
        <div className="lg:col-span-4 bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <h3 className="text-lg font-black flex items-center gap-2 uppercase mb-8">
                <PieChart size={20} className="text-emerald-400" /> Axes Prioritaires
            </h3>
            <div className="space-y-6 relative z-10">
                {[{l: "IA", v: 65, c: "bg-emerald-500"}, {l: "Cyber", v: 35, c: "bg-blue-500"}].map((axe, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>{axe.l}</span>
                            <span>{axe.v}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full">
                            <div className={`h-full ${axe.c} rounded-full`} style={{ width: `${axe.v}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
            <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
        </div>
      </div>

      {/* --- ACTIVITÉ RÉCENTE --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase mb-8">
          <TrendingUp size={20} className="text-emerald-500" /> Activité Récente
        </h3>
        <div className="space-y-4">
          {data.recentActivity.map((act, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                  <UserIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{act.action}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Par {act.user} • {act.time}</p>
                </div>
              </div>
              <ArrowUpRight size={20} className="text-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UserIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}