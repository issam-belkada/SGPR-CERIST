import { useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../api/axios";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import logoCerist from "../../assets/logo.png"; // Import du logo

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const { data } = await axiosClient.post("/login", payload);
      
      // IMPORTANT: Utilisation de data.access_token comme dans votre JSON
      setUser(data.user);
      setToken(data.access_token);
      
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setErrors(response.data.errors);
      } else {
        setErrors({ main: [response?.data?.message || "Identifiants incorrects ou erreur serveur."] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10 animate-in fade-in zoom-in duration-300">
      {/* HEADER AVEC LOGO ET NOM DU SYSTÈME */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <img 
            src={logoCerist} 
            alt="Logo CERIST" 
            className="h-20 w-auto object-contain drop-shadow-md"
            onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=CERIST"; }} 
          />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          SGPR <span className="text-blue-600">.</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Système de Gestion des Projets de Recherche
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Affichage des erreurs générales */}
        {errors?.main && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm border border-red-100 animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-medium">{errors.main[0]}</p>
          </div>
        )}

        {/* Champ Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">
            Email Professionnel
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              ref={emailRef}
              type="email"
              placeholder="nom.p@cerist.dz"
              className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors?.email ? 'border-red-400' : 'border-slate-200'} rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all`}
              required
            />
          </div>
          {errors?.email && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.email[0]}</p>}
        </div>

        {/* Champ Mot de passe */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              ref={passwordRef}
              type="password"
              placeholder="••••••••"
              className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors?.password ? 'border-red-400' : 'border-slate-200'} rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all`}
              required
            />
          </div>
          {errors?.password && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{errors.password[0]}</p>}
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Authentification...</span>
            </>
          ) : (
            "Accéder à mon espace"
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-10 pt-6 border-t border-slate-50 text-center">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          © 2026 CERIST • Division de Recherche
        </p>
      </div>
    </div>
  );
}