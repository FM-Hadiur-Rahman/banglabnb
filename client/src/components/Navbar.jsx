import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [maintenance, setMaintenance] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const token = localStorage.getItem("token");
  const isLoggedIn = user && token && user.isVerified;
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
  };

  const getDashboardPath = () => {
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "host") return "/host/dashboard";
    if (user.role === "driver") return "/dashboard/driver";
    return "/dashboard";
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/config`)
      .then((res) => res.json())
      .then((data) => setMaintenance(data.maintenanceMode));
  }, []);

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
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/auth/switch-role`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newRole = res.data.newRole;
      const updatedUser = { ...user, role: newRole };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success(`✅ ${t("switch_role")} → ${newRole.toUpperCase()}`);
      if (newRole === "admin") navigate("/admin/dashboard");
      else if (newRole === "host") navigate("/host/dashboard");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(t("error_switch_role"));
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

  useEffect(() => {
    const scrollHandler = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      if (maintenance) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notifications/unread-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUnreadCount(res.data.unread || 0);
      } catch (err) {
        console.error("🔔 Failed to fetch unread count", err);
      }
    };
    if (isLoggedIn) fetchUnread();
  }, [isLoggedIn]);

  return (
    <header
      className={`sticky top-0 z-50 px-4 py-3 transition-all duration-300 backdrop-blur-md ${
        isScrolled ? "bg-white/80 shadow-sm" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <nav className="hidden sm:flex items-center space-x-6 text-gray-700">
          {isLoggedIn && (
            <Link to="/notifications" className="relative group">
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
          <div className="ml-4">
            <select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value="en">🇬🇧 English</option>
              <option value="bn">🇧🇩 বাংলা</option>
            </select>
          </div>
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="hover:text-green-600 font-medium flex items-center space-x-2"
              >
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span>{user.name}</span>
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
                      🔄 {t("switch_role")}
                    </button>
                  )}
                  <Link
                    to={getDashboardPath()}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    {t("dashboard")}
                  </Link>
                  <Link
                    to="/my-account"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    👤 {t("my_account")}
                  </Link>
                  {user.role === "host" && (
                    <Link
                      to="/host/create"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      ➕ {t("create_listing")}
                    </Link>
                  )}
                  {user.role === "user" && (
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      📅 {t("my_bookings")}
                    </Link>
                  )}
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    ❤️ Wishlist
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    🙍 {t("edit_profile")}
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    {t("logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-600">
                {t("login")}
              </Link>
              <Link to="/register" className="hover:text-green-600">
                {t("register")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
