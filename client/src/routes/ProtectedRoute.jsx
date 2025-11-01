import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FullPageSpinner from "../components/FullPageSpinner";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageSpinner />;

  if (!user || !token) {
    console.warn("[Guard] ➡️ to /login (no user/token)", { user, token });
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.isVerified === false) {
    console.warn("[Guard] ➡️ to /login (isVerified === false)");
    return <Navigate to="/login" replace />;
  }

  const allowed = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
    ? [requiredRole]
    : null;

  if (allowed && !user.roles?.some((r) => allowed.includes(r))) {
    console.warn("[Guard] ➡️ to /forbidden (role mismatch)", {
      requiredRole: allowed,
      roles: user.roles,
    });
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
