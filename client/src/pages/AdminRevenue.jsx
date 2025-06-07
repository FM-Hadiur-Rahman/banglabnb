// pages/AdminRevenue.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminRevenue = () => {
  const [data, setData] = useState({
    total: 0,
    monthly: {},
    topListings: [],
    topHosts: [],
  });

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/revenue`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("❌ Revenue fetch failed:", err));
  }, []);

  const chartData = Object.entries(data.monthly).map(([month, total]) => ({
    month,
    revenue: total,
  }));

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">🧾 Revenue Analytics</h2>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">📊 Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4F46E5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">💰 Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            ৳ {data.total.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">🏆 Top Listings</h3>
          <ul className="list-disc ml-4">
            {data.topListings.map((l) => (
              <li key={l.id}>
                {l.title} — ৳ {l.total.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h3 className="text-xl font-semibold mb-2">👑 Top Hosts</h3>
          <ul className="list-disc ml-4">
            {data.topHosts.map((h) => (
              <li key={h.id}>
                {h.name} — ৳ {h.total.toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRevenue;
