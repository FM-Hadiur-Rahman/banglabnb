import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isLoggedIn = user && token && user.isVerified;

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef();

  const getDashboardPath = () => {
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "host") return "/host/dashboard";
    return "/dashboard";
  };

  const getRoleInfo = () => {
    switch (user.role) {
      case "admin":
        return { icon: "🛡️", badgeColor: "bg-red-100 text-red-800" };
      case "host":
        return { icon: "🏠", badgeColor: "bg-indigo-100 text-indigo-800" };
      default:
        return { icon: "🙋‍♂️", badgeColor: "bg-green-100 text-green-800" };
    }
  };

  const handleRoleSwitch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/auth/switch-role`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newRole = res.data.newRole;

      // ✅ Update localStorage user
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...currentUser, role: newRole };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ Show correct toast
      toast.success(`✅ Switched to ${newRole.toUpperCase()} role`);

      // ✅ Redirect to correct dashboard
      if (newRole === "admin") navigate("/admin/dashboard");
      else if (newRole === "host") navigate("/host/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      console.error("Role switch error:", err);
      toast.error("❌ Failed to switch role");
    }
  };

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav className="space-x-4 flex items-center relative">
      <Link to="/" className="text-gray-700 hover:text-green-600">
        Home
      </Link>

      {isLoggedIn ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-gray-700 hover:text-green-600 font-medium flex items-center space-x-2"
          >
            <span className="text-xl">{getRoleInfo().icon}</span>
            <span>{user.name}</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 min-w-[13rem] bg-white border rounded shadow-lg z-50 whitespace-nowrap">
              <div
                className={`px-4 py-2 text-sm font-semibold ${
                  getRoleInfo().badgeColor
                }`}
              >
                {user.role.toUpperCase()}
              </div>
              {user.role !== "admin" && (
                <button
                  onClick={handleRoleSwitch}
                  className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                >
                  🔄 Switch to {user?.role === "host" ? "User" : "Host"} Mode
                </button>
              )}
              <Link
                to={getDashboardPath()}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Dashboard
              </Link>

              {user.role === "host" && (
                <Link
                  to="/host/create"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  ➕ Create Listing
                </Link>
              )}

              {user.role === "user" && (
                <Link
                  to="/my-bookings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  My Bookings
                </Link>
              )}
              <Link to="/profile" className="text-blue-600 hover:underline">
                🙍 Edit Profile
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  setDropdownOpen(false);
                  navigate("/login");
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <Link to="/login" className="text-gray-700 hover:text-green-600">
            Login
          </Link>
          <Link to="/register" className="text-gray-700 hover:text-green-600">
            Register
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
