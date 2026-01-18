import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axios";
import { 
  FileText, Cpu, Plus, 
  Trash2, Save, Loader2, BookOpen,
} from "lucide-react";

export default function ProjectBilan() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("scientifique");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    scientifiques: [],
    techniques: [],
    encadrements: []
  });

  useEffect(() => {
    fetchBilan();
  }, [id]);

  const fetchBilan = async () => {
    try {
      const { data } = await axiosClient.get(`/projets/${id}/bilan`);
      setData(data);
    } catch (error) {
      console.error("Erreur bilan:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (type) => {
    let endpoint = "";
    let payload = {};

    if (type === "scientifique") {
      const titre = window.prompt("Titre de la publication :");
      if (!titre) return;
      endpoint = `/projets/${id}/productions-scientifiques`;
      payload = { titre, type_publication: "Article", annee: new Date().getFullYear() };
    } 
    else if (type === "technique") {
      const nom = window.prompt("Nom du produit technique / logiciel :");
      if (!nom) return;
      endpoint = `/projets/${id}/productions-techniques`;
      payload = { nom, description: "Description à compléter" };
    } 
    else if (type === "encadrement") {
      const etudiant = window.prompt("Nom de l'étudiant :");
      if (!etudiant) return;
      endpoint = `/projets/${id}/encadrements`;
      payload = { etudiant, type_encadrement: "Master", sujet: "Sujet à définir" };
    }

    try {
      await axiosClient.post(endpoint, payload);
      fetchBilan();
    } catch (error) {
      alert("Erreur lors de l'ajout");
    }
  };

  const deleteItem = async (type, itemId) => {
    if (!window.confirm("Supprimer cet élément ?")) return;
    try {
      await axiosClient.delete(`/${type}/${itemId}`);
      fetchBilan();
    } catch (error) {
      alert("Erreur suppression");
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bilan du Projet</h1>
          <p className="text-slate-500 text-sm">Saisissez les résultats et l'impact de vos travaux.</p>
        </div>
      </div>

      {/* SYSTÈME D'ONGLETS */}
      <div className="flex border-b border-slate-200 gap-8">
        {[
          { id: "scientifique", label: "Prod. Scientifiques", icon: <BookOpen size={18}/> },
          { id: "technique", label: "Prod. Techniques", icon: <Cpu size={18}/> },
          { id: "encadrement", label: "Encadrements", icon: <graduationCap size={18}/> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all ${
              activeTab === tab.id 
              ? "border-b-2 border-blue-600 text-blue-600" 
              : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENU : PRODUCTIONS SCIENTIFIQUES */}
      {activeTab === "scientifique" && (
        <div className="space-y-4">
          <button onClick={() => handleAdd("scientifique")} className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            <Plus size={16} /> Ajouter une Publication (Article, Communication...)
          </button>
          <div className="grid gap-3">
            {data.scientifiques.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center group">
                <div>
                  <p className="font-bold text-slate-800">{item.titre}</p>
                  <p className="text-xs text-slate-400 uppercase font-bold">{item.type_publication} - {item.annee}</p>
                </div>
                <button onClick={() => deleteItem("productions-scientifiques", item.id)} className="text-slate-300 hover:text-red-600 transition opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENU : PRODUCTIONS TECHNIQUES */}
      {activeTab === "technique" && (
        <div className="space-y-4">
          <button onClick={() => handleAdd("technique")} className="flex items-center gap-2 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition">
            <Plus size={16} /> Ajouter une Production Tech (Logiciel, Prototype...)
          </button>
          <div className="grid gap-3">
            {data.techniques.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><lightbulb size={20}/></div>
                  <div>
                    <p className="font-bold text-slate-800">{item.nom}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </div>
                <button onClick={() => deleteItem("productions-techniques", item.id)} className="text-slate-300 hover:text-red-600 transition opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENU : ENCADREMENTS */}
      {activeTab === "encadrement" && (
        <div className="space-y-4">
          <button onClick={() => handleAdd("encadrement")} className="flex items-center gap-2 text-sm bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 transition">
            <Plus size={16} /> Ajouter un Encadrement (Master, PFE, Doctorat...)
          </button>
          <div className="grid gap-3">
            {data.encadrements.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">{item.etudiant.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-slate-800">{item.etudiant}</p>
                    <p className="text-xs text-slate-500">{item.type_encadrement} : {item.sujet}</p>
                  </div>
                </div>
                <button onClick={() => deleteItem("encadrements", item.id)} className="text-slate-300 hover:text-red-600 transition opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}