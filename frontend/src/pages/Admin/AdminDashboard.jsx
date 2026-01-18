import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { 
  Users, Building2, ShieldAlert, TrendingUp, 
  UserCheck, Activity, Loader2, ArrowUpRight 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à l'API pour récupérer les chiffres globaux
    axiosClient.get("/admin/statistics")
      .then(({ data }) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        // Mode démo si l'API n'est pas encore prête
        setStats({
          totalUsers: 0,
          totalDivisions: 0,
          adminsCount: 0,
          recentUsers: []
        });
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  const cards = [
    { 
      label: "Total Chercheurs", 
      value: stats.totalUsers, 
      icon: <Users size={24} />, 
      color: "bg-blue-600",
      bg: "bg-blue-50" 
    },
    { 
      label: "Divisions Actives", 
      value: stats.totalDivisions, 
      icon: <Building2 size={24} />, 
      color: "bg-emerald-600",
      bg: "bg-emerald-50" 
    },
    { 
      label: "Administrateurs", 
      value: stats.adminsCount, 
      icon: <UserCheck size={24} />, 
      color: "bg-purple-600",
      bg: "bg-purple-50" 
    },
    { 
      label: "Alertes Système", 
      value: "0", 
      icon: <ShieldAlert size={24} />, 
      color: "bg-amber-600",
      bg: "bg-amber-50" 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tableau de bord</h1>
        <p className="text-slate-500 font-medium">Bienvenue dans l'espace de gestion du SGPR.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className={`w-12 h-12 ${card.bg} ${card.color.replace('bg-', 'text-')} rounded-2xl flex items-center justify-center mb-4`}>
              {card.icon}
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{card.label}</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
              <div className="flex items-center text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} /> +2%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Graphique / Activité Récente (Gauche) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Activity className="text-blue-600" /> Activité du Système
            </h3>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-bold py-2 px-4 outline-none">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem]">
             <p className="text-slate-400 font-medium italic">Graphique de progression (Chart.js à intégrer)</p>
          </div>
        </div>

        {/* Derniers inscrits (Droite) */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6">Nouveaux membres</h3>
          <div className="space-y-6">
            {stats.recentUsers?.length > 0 ? stats.recentUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                  {u.nom.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800 leading-none">{u.nom} {u.prenom}</p>
                  <p className="text-xs text-slate-500 mt-1">{u.grade}</p>
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase italic">Nouveau</div>
              </div>
            )) : (
              <p className="text-center py-10 text-slate-400 italic text-sm">Aucun utilisateur récent.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}