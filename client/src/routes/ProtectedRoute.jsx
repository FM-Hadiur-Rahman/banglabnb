import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // 🔒 No login
  if (!user || !token) return <Navigate to="/login" replace />;

  // 🔒 Not verified (optional check)
  if (user.isVerified === false) return <Navigate to="/login" replace />;

  // 🔒 Role-based protection (if requiredRole passed)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
