import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";

const AdminUserBreakdown = () => {
  const [stats, setStats] = useState({
    total: 0,
    guests: 0,
    hosts: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/user-breakdown`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("❌ Failed to load user breakdown", err));
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">👥 User Breakdown</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-600">Guests</h3>
          <p className="text-3xl font-bold text-green-600">{stats.guests}</p>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-600">Hosts</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.hosts}</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserBreakdown;
