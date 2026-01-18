import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../api/axios";
import { 
  Users, Building2, ShieldCheck, LayoutDashboard, 
  LogOut, Bell, Search, UserCircle, Menu, X 
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const { user, token, setUser, setToken } = useStateContext();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <div className="h-screen flex items-center justify-center font-medium italic">Chargement...</div>;

  const onLogout = (e) => {
    e.preventDefault();
    axiosClient.post("/logout").then(() => {
      setUser(null);
      setToken(null);
      navigate("/login");
    });
  };

  const navLinks = [
    { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Utilisateurs", path: "/admin/users", icon: <Users size={20} /> },
    { label: "Divisions", path: "/admin/divisions", icon: <Building2 size={20} /> },
    { label: "Logs Système", path: "/admin/logs", icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-900">
      
      {/* SIDEBAR */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shadow-xl`}>
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          {isSidebarOpen && <span className="font-black tracking-tighter text-xl text-white">SGPR <span className="text-blue-500">ADMIN</span></span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'hover:bg-slate-800 hover:text-white'}
              `}
            >
              <span className="shrink-0">{link.icon}</span>
              {isSidebarOpen && <span className="font-medium text-sm">{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Footer Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-sm uppercase tracking-wider">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">{user.nom} {user.prenom}</p>
                <p className="text-xs font-medium text-blue-600 uppercase tracking-tighter">Administrateur Principal</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
                {user.nom?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {/* C'est ici que vos pages (Dashboard, UserList) s'injectent */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}