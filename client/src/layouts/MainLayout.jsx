import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-700">
          <Link to="/">BanglaBnB</Link>
        </h1>
        <Navbar />
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />
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
