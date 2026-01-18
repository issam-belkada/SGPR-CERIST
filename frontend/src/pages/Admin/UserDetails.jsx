import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { 
  ArrowLeft, Edit, Mail, Shield, Building, 
  User, Calendar, GraduationCap, BookOpen, Loader2, Trash2 
} from "lucide-react";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosClient.get(`/users/${id}`)
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/users");
      });
  }, [id, navigate]);

  const handleDelete = () => {
    if (window.confirm(`Supprimer définitivement le compte de ${user.nom}?`)) {
      axiosClient.delete(`/users/${id}`)
        .then(() => navigate("/admin/users"))
        .catch(err => alert(err.response?.data?.error || "Erreur"));
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">Chargement du profil...</p>
      </div>
    );
  }

  const roleName = user.roles && user.roles.length > 0 ? user.roles[0].name : "Chercheur";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Barre de navigation haute */}
      <div className="flex items-center justify-between">
        <Link 
          to="/admin/users" 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-colors"
        >
          <ArrowLeft size={20} />
          Retour à la liste
        </Link>
        <div className="flex gap-3">
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-50 transition-all"
          >
            <Trash2 size={18} />
            Supprimer
          </button>
          <Link 
            to={`/admin/users/${id}/edit`}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-slate-200"
          >
            <Edit size={18} />
            Modifier le profil
          </Link>
        </div>
      </div>

      {/* En-tête du profil */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
              <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-400 border border-slate-200">
                {user.nom.charAt(0)}{user.prenom.charAt(0)}
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-200 bg-blue-50 text-blue-700`}>
              {roleName}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-800">{user.nom} {user.prenom}</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
              <BookOpen size={16} /> {user.specialite || "Spécialité non renseignée"}
            </p>
          </div>
        </div>
      </div>

      {/* Grille d'informations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Colonne Gauche: Informations Professionnelles */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-4">Détails Professionnels</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Email</label>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="p-2 bg-slate-50 rounded-lg"><Mail size={18} className="text-blue-500" /></div>
                  {user.email}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Grade Académique</label>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="p-2 bg-slate-50 rounded-lg"><GraduationCap size={18} className="text-amber-500" /></div>
                  {user.grade}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Division de Rattachement</label>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="p-2 bg-slate-50 rounded-lg"><Building size={18} className="text-emerald-500" /></div>
                  {user.division ? `${user.division.nom} (${user.division.acronyme})` : "Non affecté"}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Date d'inscription</label>
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="p-2 bg-slate-50 rounded-lg"><Calendar size={18} className="text-purple-500" /></div>
                  {new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Droite: Sécurité / Rôles */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200 space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="text-blue-400" size={24} />
              <h2 className="text-lg font-black">Accès Système</h2>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-blue-300 mb-1">Rôle Principal</p>
                <p className="font-bold">{roleName}</p>
              </div>
              
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] uppercase font-black text-blue-300 mb-1">Status du compte</p>
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  Actif
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}