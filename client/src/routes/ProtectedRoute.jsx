import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FullPageSpinner from "../components/FullPageSpinner";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageSpinner />;

  // Not authenticated → go login (keep "from" for nice return)
  if (!user || !token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Optional gate: unverified users back to login/verify
  if (user.isVerified === false) {
    return <Navigate to="/login" replace />;
  }

  // Normalize to array: supports role="admin" OR role={["user","host",...]}
  const allowed = Array.isArray(requiredRole)
    ? requiredRole
    : requiredRole
    ? [requiredRole]
    : null;

  if (allowed && !user.roles?.some((r) => allowed.includes(r))) {
    // Forbidden (don’t send to /login; that looks like an auth loop)
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
