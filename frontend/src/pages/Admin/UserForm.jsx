import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Save, ArrowLeft, User, Mail, Lock, Shield, Building, BookOpen, GraduationCap, Loader2 } from "lucide-react";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const [errors, setErrors] = useState(null);

  const [user, setUser] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    grade: "",
    specialite: "",
    role: "Chercheur", // Valeur par défaut
    division_id: ""
  });

  useEffect(() => {
    // 1. Charger les divisions pour le Select
    axiosClient.get("/divisions").then(({ data }) => setDivisions(data));

    // 2. Si on est en mode édition, charger l'utilisateur
    if (id) {
      setLoading(true);
      axiosClient.get(`/users/${id}`)
        .then(({ data }) => {
          // Correction cruciale : extraction du nom du rôle depuis le tableau roles
          const currentRole = (data.roles && data.roles.length > 0) 
            ? data.roles[0].name 
            : "Chercheur";

          setUser({ 
            ...data, 
            role: currentRole, // On mappe data.roles[0].name vers user.role
            password: "",
            division_id: data.division_id || "" 
          }); 
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    
    // On prépare les données (on s'assure que division_id est null si vide)
    const payload = {
        ...user,
        division_id: user.division_id === "" ? null : user.division_id
    };

    const promise = id 
      ? axiosClient.put(`/users/${id}`, payload) 
      : axiosClient.post("/users", payload);

    promise
      .then(() => navigate("/admin/users"))
      .catch(err => {
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-medium">Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/users" className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-black text-slate-800">
            {id ? `Modifier: ${user.nom} ${user.prenom}` : "Ajouter un Chercheur"}
          </h1>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nom & Prénom */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <User size={16} className="text-slate-400" /> Nom
            </label>
            <input 
              value={user.nom} 
              onChange={e => setUser({...user, nom: e.target.value.toUpperCase()})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: BENALI"
            />
            {errors?.nom && <p className="text-red-500 text-xs font-bold">{errors.nom[0]}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
               Prénom
            </label>
            <input 
              value={user.prenom} 
              onChange={e => setUser({...user, prenom: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Karim"
            />
          </div>

          {/* Email & Spécialité */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Mail size={16} className="text-slate-400" /> Email Professionnel
            </label>
            <input 
              type="email"
              value={user.email} 
              onChange={e => setUser({...user, email: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors?.email && <p className="text-red-500 text-xs font-bold">{errors.email[0]}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <BookOpen size={16} className="text-slate-400" /> Spécialité
            </label>
            <input 
              value={user.specialite || ""} 
              onChange={e => setUser({...user, specialite: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Intelligence Artificielle"
            />
          </div>

          {/* Grade & Mot de passe */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <GraduationCap size={16} className="text-slate-400" /> Grade
            </label>
            <select 
              value={user.grade}
              onChange={e => setUser({...user, grade: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Sélectionner un grade</option>
              <optgroup label="Recherche">
                <option value="DR">Directeur de Recherche (DR)</option>
                <option value="MRA">Maître de Recherche A (MRA)</option>
                <option value="MRB">Maître de Recherche B (MRB)</option>
                <option value="CR">Chargé de Recherche (CR)</option>
                <option value="AR">Attaché de Recherche (AR)</option>
              </optgroup>
              <optgroup label="Enseignement">
                <option value="PR">Professeur (PR)</option>
                <option value="MCA">Maître de Conférence A (MCA)</option>
                <option value="MCB">Maître de Conférence B (MCB)</option>
              </optgroup>
              <optgroup label="Technique">
                <option value="Ingénieur">Ingénieur</option>
                <option value="TS">Technicien Supérieur (TS)</option>
              </optgroup>
            </select>
            {errors?.grade && <p className="text-red-500 text-xs font-bold">{errors.grade[0]}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Lock size={16} className="text-slate-400" /> Mot de passe
            </label>
            <input 
              type="password"
              value={user.password} 
              onChange={e => setUser({...user, password: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={id ? "Laisser vide pour conserver" : "Minimum 8 caractères"}
            />
          </div>

          {/* Rôle & Division */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Shield size={16} className="text-slate-400" /> Rôle Système
            </label>
            <select 
              value={user.role}
              onChange={e => setUser({...user, role: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Chercheur">Chercheur</option>
              <option value="ChefCS">Chef de Conseil Scientifique</option>
              <option value="Admin">Administrateur</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Building size={16} className="text-slate-400" /> Division
            </label>
            <select 
              value={user.division_id || ""}
              onChange={e => setUser({...user, division_id: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Aucune (Administration)</option>
              {divisions.map(d => (
                <option key={d.id} value={d.id}>{d.nom} ({d.acronyme})</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black transition-all shadow-lg"
        >
          <Save size={20} />
          {id ? "Mettre à jour les informations" : "Enregistrer le chercheur"}
        </button>
      </form>
    </div>
  );
}