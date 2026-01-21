import { 
  TrendingUp, Users, FileCheck, AlertCircle, 
  ArrowUpRight, Calendar, BarChart3, PieChart,
  Target, Zap, Activity
} from "lucide-react";

export default function DashboardDivision() {
  
  // Stats fictives pour le design
  const stats = [
    { label: "Projets Actifs", value: "12", growth: "+2", icon: <Activity className="text-emerald-500" />, color: "bg-emerald-50" },
    { label: "Chercheurs", value: "08", growth: "Stable", icon: <Users className="text-blue-500" />, color: "bg-blue-50" },
    { label: "Taux de Validation", value: "94%", growth: "+5%", icon: <FileCheck className="text-violet-500" />, color: "bg-violet-50" },
    { label: "Alertes Retards", value: "02", growth: "-1", icon: <AlertCircle className="text-rose-500" />, color: "bg-rose-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase">
            Reporting <span className="text-emerald-600 underline decoration-emerald-200 decoration-8 underline-offset-[-2px]">Division</span>
          </h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">
            Performance analytique • Période Janv - Juin 2024
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
          <Calendar size={14} /> Exporter le Bilan
        </button>
      </div>

      {/* --- GRID DE KPIS (TOP) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${stat.growth.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                {stat.growth}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 italic tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* --- BENTO SECTION : ANALYTICS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Graphique d'activité (Simulation) */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter">
                <BarChart3 size={20} className="text-emerald-500" /> Progression des Travaux
              </h3>
              <p className="text-xs text-slate-400 font-medium">Évolution mensuelle des livrables par équipe</p>
            </div>
          </div>
          <div className="h-72 w-full bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden">
             {/* Ici viendrait votre composant de graphique (LineChart ou BarChart) */}
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest z-10">Area Chart Integration</p>
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
          </div>
        </div>

        {/* Répartition par thématique */}
        <div className="lg:col-span-4 bg-slate-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter mb-8">
              <PieChart size={20} className="text-emerald-400" /> Focus Axes
            </h3>
            
            <div className="space-y-6">
              {[
                { label: "Intelligence Artificielle", val: 65, color: "bg-emerald-500" },
                { label: "Cybersécurité", val: 20, color: "bg-blue-500" },
                { label: "Big Data", val: 15, color: "bg-indigo-500" },
              ].map((axe, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{axe.label}</span>
                    <span className="text-emerald-400">{axe.val}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${axe.color} rounded-full`} style={{ width: `${axe.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Zap className="absolute -right-6 -bottom-6 w-32 h-32 text-white/5 rotate-12" />
        </div>

      </div>

      {/* --- DERNIÈRES ACTIONS DE L'ÉQUIPE --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 uppercase tracking-tighter mb-8">
          <TrendingUp size={20} className="text-emerald-500" /> Activité Récente
        </h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <UserIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">Bilan semestriel soumis</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Par Dr. Ahmed Benali • Il y a 45 min</p>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-emerald-600 transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Petit composant helper pour l'icône utilisateur
function UserIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  );
}