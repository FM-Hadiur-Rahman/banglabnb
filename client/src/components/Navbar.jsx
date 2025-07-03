import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
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

  const getDashboardPath = (role = user.role) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "host") return "/host/dashboard";
    if (role === "driver") return "/dashboard/driver";
    return "/dashboard";
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "bn" : "en";
    i18n.changeLanguage(nextLang);
    localStorage.setItem("lng", nextLang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lng");
    if (savedLang && i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

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
      toast.success(`✅ ${t("switch_role")} ➡ ${newRole.toUpperCase()}`);
      navigate(getDashboardPath(newRole));
    } catch (err) {
      toast.error(t("error.switch_role"));
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
          { headers: { Authorization: `Bearer ${token}` } }
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
          <button
            onClick={toggleLanguage}
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
          >
            🌐 {i18n.language === "en" ? "বাংলা" : "EN"}
          </button>
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
                  {["user", "host", "driver"].includes(user.role) && (
                    <Link
                      to="/my-referrals"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      🎁 {t("my_referrals")}
                    </Link>
                  )}
                  <Link
                    to="/wishlist"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    ❤️ {t("wishlist")}
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
        <div className="sm:hidden">
          <button
            className={`hamburger w-8 h-8 flex flex-col justify-center items-center space-y-1 ${
              mobileOpen ? "open" : ""
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="w-6 h-0.5 bg-gray-700" />
            <span className="w-6 h-0.5 bg-gray-700" />
            <span className="w-6 h-0.5 bg-gray-700" />
          </button>
        </div>
        {mobileOpen && (
          <div className="fixed top-3 right-0 w-1/2 max-w-xs bg-white rounded-lg shadow-lg p-4 z-50 space-y-2 text-gray-700 h-[calc(100vh-60px)] overflow-y-auto sm:hidden">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2 border-b pb-2 mb-2">
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role.toUpperCase()}
                    </p>
                  </div>
                </div>

                <Link
                  to={getDashboardPath()}
                  className="block hover:text-green-600"
                >
                  {t("dashboard")}
                </Link>
                <Link to="/my-account" className="block hover:text-green-600">
                  {t("my_account")}
                </Link>
                <Link
                  to="/notifications"
                  className="block hover:text-green-600"
                >
                  🔔 {t("notifications")}{" "}
                  {unreadCount > 0 && (
                    <span className="ml-2 text-xs text-red-600 font-semibold">
                      ({unreadCount})
                    </span>
                  )}
                </Link>
                {user.role === "host" && (
                  <Link
                    to="/host/create"
                    className="block hover:text-green-600"
                  >
                    ➕ {t("create_listing")}
                  </Link>
                )}
                {user.role === "user" && (
                  <Link
                    to="/my-bookings"
                    className="block hover:text-green-600"
                  >
                    📅 {t("my_bookings")}
                  </Link>
                )}
                {["user", "host", "driver"].includes(user.role) && (
                  <Link
                    to="/my-referrals"
                    className="block hover:text-green-600"
                  >
                    🎁 {t("my_referrals")}
                  </Link>
                )}
                <Link to="/wishlist" className="block hover:text-green-600">
                  ❤️ {t("wishlist")}
                </Link>
                <Link to="/profile" className="block hover:text-green-600">
                  🙍 {t("edit_profile")}
                </Link>
                <button
                  onClick={handleRoleSwitch}
                  className="block text-left w-full text-blue-600"
                >
                  🔄 {t("switch_role")}
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                  className="block text-left w-full text-red-600"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-green-600">
                  {t("login")}
                </Link>
                <Link to="/register" className="block hover:text-green-600">
                  {t("register")}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const menuRef = useRef();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [maintenance, setMaintenance] = useState(false);

//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   const token = localStorage.getItem("token");
//   const isLoggedIn = user && token && user.isVerified;

//   const getDashboardPath = () => {
//     if (user.role === "admin") return "/admin/dashboard";
//     if (user.role === "host") return "/host/dashboard";
//     if (user.role === "driver") return "/dashboard/driver";
//     return "/dashboard";
//   };
//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/config`)
//       .then((res) => res.json())
//       .then((data) => setMaintenance(data.maintenanceMode));
//   }, []);

//   const getRoleInfo = () => {
//     switch (user.role) {
//       case "admin":
//         return { icon: "🛡️", badgeColor: "bg-red-100 text-red-800" };
//       case "host":
//         return { icon: "🏠", badgeColor: "bg-indigo-100 text-indigo-800" };
//       default:
//         return { icon: "🙋‍♂️", badgeColor: "bg-green-100 text-green-800" };
//     }
//   };

//   const handleRoleSwitch = async () => {
//     try {
//       const res = await axios.patch(
//         `${import.meta.env.VITE_API_URL}/api/auth/switch-role`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const newRole = res.data.newRole;
//       const updatedUser = { ...user, role: newRole };
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       toast.success(`✅ Switched to ${newRole.toUpperCase()} role`);
//       if (newRole === "admin") navigate("/admin/dashboard");
//       else if (newRole === "host") navigate("/host/dashboard");
//       else navigate("/dashboard");
//     } catch (err) {
//       toast.error("❌ Failed to switch role");
//     }
//   };

//   useEffect(() => {
//     const close = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);

//   useEffect(() => {
//     const scrollHandler = () => setIsScrolled(window.scrollY > 30);
//     window.addEventListener("scroll", scrollHandler);
//     return () => window.removeEventListener("scroll", scrollHandler);
//   }, []);

//   useEffect(() => {
//     const fetchUnread = async () => {
//       if (maintenance) return;
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/notifications/unread-count`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setUnreadCount(res.data.unread || 0);
//       } catch (err) {
//         console.error("🔔 Failed to fetch unread count", err);
//       }
//     };
//     if (isLoggedIn) fetchUnread();
//   }, [isLoggedIn]);

//   return (
//     <header
//       className={`sticky top-0 z-50 px-4 py-3 transition-all duration-300 backdrop-blur-md ${
//         isScrolled ? "bg-white/80 shadow-sm" : "bg-white"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         {/* Desktop Nav */}
//         <nav className="hidden sm:flex items-center space-x-6 text-gray-700">
//           {isLoggedIn && (
//             <Link to="/notifications" className="relative group">
//               <span className="text-xl">🔔</span>
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5 py-0.5">
//                   {unreadCount}
//                 </span>
//               )}
//             </Link>
//           )}

//           {isLoggedIn ? (
//             <div className="relative" ref={menuRef}>
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="hover:text-green-600 font-medium flex items-center space-x-2"
//               >
//                 <img
//                   src={user?.avatar || "/default-avatar.png"}
//                   alt="Profile"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <span>{user.name}</span>
//                 <svg
//                   className="w-4 h-4 ml-1"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                 >
//                   <path d="M19 9l-7 7-7-7" />
//                 </svg>
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 min-w-[13rem] bg-white border rounded shadow-lg z-50 whitespace-nowrap">
//                   <div
//                     className={`px-4 py-2 text-sm font-semibold ${
//                       getRoleInfo().badgeColor
//                     }`}
//                   >
//                     {user.role.toUpperCase()}
//                   </div>
//                   {user.role !== "admin" && (
//                     <button
//                       onClick={handleRoleSwitch}
//                       className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
//                     >
//                       🔄 Switch to {user.role === "host" ? "User" : "Host"} Mode
//                     </button>
//                   )}
//                   <Link
//                     to={getDashboardPath()}
//                     className="block px-4 py-2 text-sm hover:bg-gray-100"
//                   >
//                     Dashboard
//                   </Link>
//                   <Link
//                     to="/my-account"
//                     className="block px-4 py-2 text-sm hover:bg-gray-100"
//                   >
//                     👤 My Account
//                   </Link>
//                   {user.role === "host" && (
//                     <Link
//                       to="/host/create"
//                       className="block px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       ➕ Create Listing
//                     </Link>
//                   )}
//                   {user.role === "user" && (
//                     <Link
//                       to="/my-bookings"
//                       className="block px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       📅 My Bookings
//                     </Link>
//                   )}
//                   {["user", "host", "driver"].includes(user.role) && (
//                     <Link
//                       to="/my-referrals"
//                       className="block px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       🎁 My Referrals
//                     </Link>
//                   )}

//                   <Link
//                     to="/wishlist"
//                     className="block px-4 py-2 text-sm hover:bg-gray-100"
//                   >
//                     ❤️ My Wishlist
//                   </Link>
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-sm hover:bg-gray-100"
//                   >
//                     🙍 Edit Profile
//                   </Link>
//                   <button
//                     onClick={() => {
//                       localStorage.clear();
//                       navigate("/login");
//                     }}
//                     className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link to="/login" className="hover:text-green-600">
//                 Login
//               </Link>
//               <Link to="/register" className="hover:text-green-600">
//                 Register
//               </Link>
//             </>
//           )}
//         </nav>

//         {/* Mobile Hamburger */}
//         <div className="sm:hidden">
//           <button
//             className={`hamburger w-8 h-8 flex flex-col justify-center items-center space-y-1 ${
//               mobileOpen ? "open" : ""
//             }`}
//             onClick={() => setMobileOpen(!mobileOpen)}
//           >
//             <span className="w-6 h-0.5 bg-gray-700" />
//             <span className="w-6 h-0.5 bg-gray-700" />
//             <span className="w-6 h-0.5 bg-gray-700" />
//           </button>
//         </div>
//       </div>

//       {/* Mobile Dropdown */}
//       {mobileOpen && (
//         <div className="fixed top-[60px] right-0 w-1/2 max-w-xs bg-white rounded-lg shadow-lg p-4 z-50 space-y-2 text-gray-700 h-[calc(100vh-60px)] overflow-y-auto sm:hidden">
//           {isLoggedIn ? (
//             <>
//               <div className="flex items-center space-x-2 border-b pb-2 mb-2">
//                 <img
//                   src={user.avatar || "/default-avatar.png"}
//                   alt="Avatar"
//                   className="w-8 h-8 rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="text-sm font-semibold text-green-700">
//                     {user.name}
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {user.role.toUpperCase()}
//                   </p>
//                 </div>
//               </div>

//               <Link
//                 to={getDashboardPath()}
//                 className="block hover:text-green-600"
//               >
//                 Dashboard
//               </Link>
//               <Link to="/my-account" className="block hover:text-green-600">
//                 My Account
//               </Link>
//               <Link to="/notifications" className="block hover:text-green-600">
//                 🔔 Notifications{" "}
//                 {unreadCount > 0 && (
//                   <span className="ml-2 text-xs text-red-600 font-semibold">
//                     ({unreadCount})
//                   </span>
//                 )}
//               </Link>
//               {user.role === "host" && (
//                 <Link to="/host/create" className="block hover:text-green-600">
//                   ➕ Create Listing
//                 </Link>
//               )}
//               {user.role === "user" && (
//                 <Link to="/my-bookings" className="block hover:text-green-600">
//                   📅 My Bookings
//                 </Link>
//               )}
//               {["user", "host", "driver"].includes(user.role) && (
//                 <Link
//                   to="/my-referrals"
//                   className="block px-4 py-2 text-sm hover:bg-gray-100"
//                 >
//                   🎁 My Referrals
//                 </Link>
//               )}

//               <button
//                 onClick={handleRoleSwitch}
//                 className="block text-left w-full text-blue-600"
//               >
//                 🔄 Switch Role
//               </button>

//               <button
//                 onClick={() => {
//                   localStorage.clear();
//                   navigate("/login");
//                 }}
//                 className="block text-left w-full text-red-600"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="block hover:text-green-600">
//                 Login
//               </Link>
//               <Link to="/register" className="block hover:text-green-600">
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;
