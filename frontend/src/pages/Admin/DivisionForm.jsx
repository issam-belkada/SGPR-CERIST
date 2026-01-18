import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import { Save, ArrowLeft, Building2, Tag, AlignLeft } from "lucide-react";

export default function DivisionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [division, setDivision] = useState({ nom: "", acronyme: "", description: "" });

  useEffect(() => {
    if (id) {
      axiosClient.get(`/divisions/${id}`).then(({ data }) => setDivision(data));
    }
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();
    const promise = id 
      ? axiosClient.put(`/divisions/${id}`, division) 
      : axiosClient.post("/divisions", division);

    promise
      .then(() => navigate("/admin/divisions"))
      .catch(err => {
        if (err.response?.status === 422) setErrors(err.response.data.errors);
      });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/divisions" className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-black text-slate-800">
          {id ? "Modifier la division" : "Nouvelle Division"}
        </h1>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Building2 size={16} className="text-slate-400" /> Nom complet de la division
          </label>
          <input 
            value={division.nom}
            onChange={e => setDivision({...division, nom: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Ex: Systèmes d'Information et Technologies à l'Information"
          />
          {errors?.nom && <p className="text-red-500 text-xs font-bold">{errors.nom[0]}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Tag size={16} className="text-slate-400" /> Acronyme
          </label>
          <input 
            value={division.acronyme}
            onChange={e => setDivision({...division, acronyme: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Ex: DSI"
          />
          {errors?.acronyme && <p className="text-red-500 text-xs font-bold">{errors.acronyme[0]}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <AlignLeft size={16} className="text-slate-400" /> Description (Optionnel)
          </label>
          <textarea 
            rows="4"
            value={division.description || ""}
            onChange={e => setDivision({...division, description: e.target.value})}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black transition-all shadow-lg">
          <Save size={20} /> Enregistrer la division
        </button>
      </form>
    </div>
  );
}