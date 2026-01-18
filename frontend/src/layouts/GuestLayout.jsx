import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function GuestLayout() {
  const { user, token } = useStateContext();

  // Si l'utilisateur est déjà connecté, on le redirige vers son espace
  if (token && user) {
    if (user.roles?.includes("Admin")) return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/chercheur" replace />; 
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}