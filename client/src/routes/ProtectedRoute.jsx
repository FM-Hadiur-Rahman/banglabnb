import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ use context
import FullPageSpinner from "../components/FullPageSpinner"; // ✅ optional loading UI
const ProtectedRoute = (props) => {
  const { children, requiredRole } = props;
  const { user, token, loading } = useAuth();

  if (loading) return <FullPageSpinner />;

  if (!user || !token) return <Navigate to="/login" replace />;
  if (user.isVerified === false) return <Navigate to="/login" replace />;

  if (requiredRole && !user.roles.includes(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
