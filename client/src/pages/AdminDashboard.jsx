import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    bookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error("❌ Failed to load admin stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">BanglaBnB Admin</h2>
        <nav className="flex flex-col space-y-2">
          <a href="/admin/dashboard" className="hover:underline">
            Dashboard
          </a>
          <a href="/admin/users" className="hover:underline">
            Users
          </a>
          <a href="/admin/listings" className="hover:underline">
            Listings
          </a>
          <a href="/admin/bookings" className="hover:underline">
            Bookings
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold">👥 Total Users</h2>
            <p className="text-3xl">{stats.users}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold">🏡 Total Listings</h2>
            <p className="text-3xl">{stats.listings}</p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold">📆 Total Bookings</h2>
            <p className="text-3xl">{stats.bookings}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
