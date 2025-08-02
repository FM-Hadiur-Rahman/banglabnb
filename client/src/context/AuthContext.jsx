// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ⏳ State
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ✅ Universal user setter (after login, register, or switch role)
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // ✅ Universal token setter
  const updateToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // ✅ Logout (safe and reactive)
  const logout = (message = null) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    if (message) toast.error(message);
    window.location.href = "/login"; // or use navigate if preferred
  };

  // ✅ Check session on initial load or token change
  const checkSession = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updateUser(res.data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        logout("🚫 Session expired or account deleted.");
      } else {
        toast.error("⚠️ Failed to validate session.");
        console.error("Session check error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        updateUser,
        updateToken,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Export custom hook
export const useAuth = () => useContext(AuthContext);
