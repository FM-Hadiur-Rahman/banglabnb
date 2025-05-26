import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
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

      <footer className="bg-green-700 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} BanglaBnB. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
