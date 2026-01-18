import { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { CalendarPlus, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CSSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/sessions-cs").then(({ data }) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sessions du Conseil Scientifique</h1>
          <p className="text-slate-500 text-sm">Planifiez les réunions et enregistrez les décisions collectives.</p>
        </div>
        <button className="flex items-center gap-2 bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-cyan-800 transition shadow-lg shadow-cyan-100">
          <CalendarPlus size={20} /> Nouvelle Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 text-cyan-700">
                <Calendar size={20} />
                <span className="font-bold">{new Date(session.date_session).toLocaleDateString()}</span>
              </div>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">Session #{session.id}</span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-2">{session.lieu}</h3>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2">{session.ordre_du_jour}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-4 text-slate-400">
                <div className="flex items-center gap-1 text-xs font-medium">
                  <MapPin size={14} /> {session.lieu}
                </div>
              </div>
              <Link to={`/cs/sessions/${session.id}`} className="flex items-center gap-1 text-cyan-700 font-bold text-sm hover:underline">
                Ouvrir la session <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}