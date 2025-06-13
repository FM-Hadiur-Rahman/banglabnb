import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with shrinking effect */}
      <header
        className={`sticky top-0 z-40 px-6 flex justify-between items-center shadow-md backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "bg-green-600 bg-opacity-95 py-2" : "bg-white-600 py-6"
        }`}
      >
        <Link
          to="/"
          className="flex items-center space-x-2 transition-all duration-300"
          title="Go to Home"
        >
          <img
            src="/banglabnb-logo.png"
            alt="BanglaBnB Logo"
            className={`object-contain transition-all duration-300 ${
              isScrolled ? "w-6 h-6" : "w-10 h-10"
            }`}
          />
          <span
            className={`font-bold transition-all duration-300 ${
              isScrolled ? "text-base" : "text-xl"
            }`}
          >
            <span className="text-green-600">Bangla</span>
            <span className="text-red-600">BnB</span>
          </span>
        </Link>
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Trust Badge */}
      <div className="fixed bottom-6 right-6 z-50 bg-green-700 text-white shadow-lg rounded-lg px-4 py-3 text-sm w-64">
        <h4 className="font-semibold mb-1">✅ Verified & Trusted</h4>
        <ul className="list-disc list-inside space-y-1 text-xs text-white/90">
          <li>Verified by National ID</li>
          <li>Secure Payments</li>
          <li>Comfortable Stays</li>
        </ul>
      </div>
    </div>
  );
};

export default MainLayout;
