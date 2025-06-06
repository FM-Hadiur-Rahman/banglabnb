import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Header with scroll effect */}
      <header
        className={`sticky top-0 z-40 py-3 px-6 flex justify-between items-center shadow-md backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "bg-white/80" : "bg-white"
        }`}
      >
        <Link to="/" className="flex items-center space-x-2" title="Go to Home">
          <img
            src="/banglabnb-logo.png"
            alt="BanglaBnB Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-green-700 font-bold text-lg">BanglaBnB</span>
        </Link>
        <Navbar />
      </header>

      {/* Main */}
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
