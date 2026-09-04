import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useauthstore";

const ProtectedRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

 
  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
