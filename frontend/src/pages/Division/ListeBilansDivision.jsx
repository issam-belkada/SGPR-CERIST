import { useState, useEffect } from "react";
import axiosClient from "../../api/axios";
import { Eye, Send, Calendar, Users, Briefcase, ChevronRight, UserCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ListeBilansDivision() {
  const [bilans, setBilans] = useState([]);
  const [filter, setFilter] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get("/division/mes-bilans").then(res => {
      setBilans(res.data);
      setLoading(false);
    });
  }, []);

  const handleTransmettre = async (id) => {
    const result = await Swal.fire({
      title: 'Transmettre au CS ?',
      text: "Cette action verrouille définitivement le bilan pour l'année.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Confirmer la transmission',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await axiosClient.put(`/bilans/${id}/transmettre`);
        Swal.fire('Transmis', 'Le bilan est maintenant au Conseil Scientifique.', 'success');
        // Refresh local data logic...
      } catch (err) {
        Swal.fire('Erreur', 'Impossible de procéder à la transmission.', 'error');
      }
    }
  };

  const filtered = filter === "Tous" ? bilans : bilans.filter(b => b.etat === filter);

  return (
    <div className="min-h-screen bg-white p-8 md:p-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* En-tête Large */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-8 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              REGISTRE DES <span className="text-indigo-600 italic">BILANS</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Division Scientifique — Archivage Centralisé</p>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            {["Tous", "Brouillon", "Transmis_au_CS"].map(e => (
              <button 
                key={e} 
                onClick={() => setFilter(e)} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  filter === e ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-indigo-400'
                }`}
              >
                {e.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Liste Large (Format Ligne) */}
        <div className="space-y-4">
          {filtered.map((b) => (
            <div 
              key={b.id} 
              className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8">
                
                {/* 1. L'Année (Focus Visuel) */}
                <div className="flex flex-col items-center justify-center min-w-[120px] py-4 bg-slate-50 rounded-3xl border border-slate-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                  <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-200 uppercase tracking-widest">Année</span>
                  <span className="text-3xl font-black text-slate-900 group-hover:text-white italic tracking-tighter">{b.annee}</span>
                </div>

                {/* 2. Informations Division & Chef */}
                <div className="flex-1 space-y-2 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      b.etat === 'Brouillon' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {b.etat.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-300 text-xs">|</span>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      Rédigé par <span className="text-slate-900 italic">{b.chef_division?.nom} {b.chef_division?.prenom}</span>
                    </p>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    {b.division?.nom} <span className="text-indigo-600 font-medium">({b.division?.acronyme})</span>
                  </h2>
                </div>

                {/* 3. Statistiques Clés (Alignées) */}
                <div className="flex items-center gap-12 px-8 border-x border-slate-50">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Effectifs</p>
                    <div className="flex items-center gap-2 justify-center text-slate-900 font-black">
                      <Users size={16} className="text-indigo-400"/>
                      <span className="text-xl tracking-tighter">{b.total_personnel}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Projets</p>
                    <div className="flex items-center gap-2 justify-center text-slate-900 font-black">
                      <Briefcase size={16} className="text-indigo-400"/>
                      <span className="text-xl tracking-tighter">{b.bilans_projets_count}</span>
                    </div>
                  </div>
                </div>

                {/* 4. Boutons d'Action (Large) */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/division/bilan-consolide/${b.id}`)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all"
                  >
                    <Eye size={16} /> Détails
                  </button>
                  
                  {b.etat === 'Brouillon' && (
                    <button 
                      onClick={() => handleTransmettre(b.id)}
                      className="group/btn p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:border-indigo-200 hover:text-indigo-600 transition-all"
                      title="Transmettre au CS"
                    >
                      <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"/>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* État vide */}
        {!loading && filtered.length === 0 && (
          <div className="py-32 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
            <FileText size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Aucune archive disponible pour ce filtre</p>
          </div>
        )}
      </div>
    </div>
  );
}