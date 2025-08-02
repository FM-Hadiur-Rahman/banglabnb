import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ use context
import FullPageSpinner from "../components/FullPageSpinner"; // ✅ optional loading UI

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <FullPageSpinner />; // or null if no spinner

  // 🔒 No login
  if (!user || !token) return <Navigate to="/login" replace />;

  // 🔒 Not verified (optional)
  if (user.isVerified === false) return <Navigate to="/login" replace />;

  // 🔒 Role-based protection
  if (requiredRole && user.primaryRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
