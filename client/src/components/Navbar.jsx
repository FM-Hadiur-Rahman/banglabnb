// client/src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef();

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

      {user ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-gray-700 hover:text-green-600 font-medium flex items-center space-x-1"
          >
            <span>👤 {user.name}</span>
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
            <div className="absolute right-0 mt-2 min-w-[12rem] bg-white border rounded shadow-lg z-50 whitespace-nowrap">
              <Link
                to="/host/dashboard"
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
                  Create Listing
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
