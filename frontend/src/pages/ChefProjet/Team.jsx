import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../api/axios";
import { UserPlus, UserMinus, Search, Mail, Shield, Loader2, Users } from "lucide-react";

export default function TeamManagement() {
  const { id } = useParams(); // ID du projet
  const [members, setMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [id]);

  const fetchMembers = async () => {
    try {
      const { data } = await axiosClient.get(`/projets/${id}/membres`);
      setMembers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des membres", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data } = await axiosClient.get(`/chercheurs/search?q=${query}`);
      // Filtrer pour ne pas afficher ceux qui sont déjà membres
      const filtered = data.filter(res => !members.some(m => m.id === res.id));
      setSearchResults(filtered);
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const addMember = async (userId) => {
    try {
      await axiosClient.post(`/projets/${id}/membres`, { user_id: userId });
      setSearchQuery("");
      setSearchResults([]);
      fetchMembers();
    } catch (error) {
      alert("Erreur lors de l'ajout du membre");
    }
  };

  const removeMember = async (userId) => {
    if (!window.confirm("Retirer ce membre du projet ?")) return;
    try {
      await axiosClient.delete(`/projets/${id}/membres/${userId}`);
      fetchMembers();
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Users className="text-indigo-600" /> Équipe du Projet
        </h1>
        <p className="text-slate-500 text-sm mt-1">Gérez les collaborateurs et chercheurs impliqués dans les travaux.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : RECHERCHE ET AJOUT */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <UserPlus size={18} className="text-indigo-500" /> Ajouter un membre
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Nom ou Email du chercheur..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {/* RÉSULTATS DE RECHERCHE */}
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
              {searching && <div className="text-center py-4"><Loader2 className="animate-spin mx-auto text-indigo-500" /></div>}
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-transparent hover:border-indigo-200 transition">
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.nom} {user.prenom}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.division?.acronyme}</p>
                  </div>
                  <button 
                    onClick={() => addMember(user.id)}
                    className="p-2 bg-white text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-600 hover:text-white transition"
                  >
                    <UserPlus size={16} />
                  </button>
                </div>
              ))}
              {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
                <p className="text-xs text-center text-slate-400 py-4">Aucun chercheur trouvé.</p>
              )}
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : LISTE DES MEMBRES ACTUELS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Membre</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase">Rôle Projet</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((member) => (
                  <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200">
                          {member.nom.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.nom} {member.prenom}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Mail size={10} /> {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {member.pivot?.role === 'Chef' ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">
                          <Shield size={12} /> Responsable
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full w-fit">
                          Collaborateur
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {member.pivot?.role !== 'Chef' && (
                        <button 
                          onClick={() => removeMember(member.id)}
                          className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Retirer du projet"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}