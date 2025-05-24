import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const MainLayout = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700">
          <Link to="/">BanglaBnB</Link>
        </h1>

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
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
                  <Link
                    to="/dashboard"
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
              <Link
                to="/register"
                className="text-gray-700 hover:text-green-600"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-green-700 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} BanglaBnB. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
