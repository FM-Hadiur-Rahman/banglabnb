import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminRevenue = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTax: 0,
    totalPlatformFee: 0,
    totalHostPayout: 0,
    topListings: [],
    topHosts: [],
    monthly: {},
  });

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/revenue`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("📊 Revenue data received:", res.data);
        setStats(res.data);
      } catch (err) {
        console.error("❌ Revenue fetch failed:", err);
      }
    };

    fetchRevenue();
  }, []);

  const monthlyData = Array.isArray(stats.monthly)
    ? stats.monthly
    : Object.entries(stats.monthly || {}).map(([month, value]) => ({
        month,
        revenue: value,
      }));

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">🧾 Revenue Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={`৳ ${(stats.totalRevenue ?? 0).toLocaleString()}`}
        />
        <StatCard
          title="Govt. Tax (5%)"
          value={`৳ ${(stats.totalTax ?? 0).toLocaleString()}`}
        />
        <StatCard
          title="Platform Fee (10%)"
          value={`৳ ${(stats.totalPlatformFee ?? 0).toLocaleString()}`}
        />
        <StatCard
          title="Host Payout"
          value={`৳ ${(stats.totalHostPayout ?? 0).toLocaleString()}`}
        />
      </div>

      {/* Monthly Revenue Line Chart */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">📈 Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={Array.isArray(monthlyData) ? monthlyData : []}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Listings and Hosts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TableCard
          title="🏆 Top Listings"
          data={Array.isArray(stats.topListings) ? stats.topListings : []}
          type="listing"
        />
        <TableCard
          title="💼 Top Hosts"
          data={Array.isArray(stats.topHosts) ? stats.topHosts : []}
          type="host"
        />
      </div>
    </AdminLayout>
  );
};

// Reusable Stat Card
const StatCard = ({ title, value }) => (
  <div className="bg-white rounded shadow p-4 text-center">
    <h4 className="text-sm text-gray-500">{title}</h4>
    <p className="text-xl font-bold text-gray-800">{value}</p>
  </div>
);

// Reusable Table Card with map guard
const TableCard = ({ title, data, type }) => (
  <div className="bg-white p-4 rounded shadow">
    <h4 className="text-lg font-semibold mb-4">{title}</h4>
    <ul className="space-y-2">
      {Array.isArray(data) && data.length > 0 ? (
        data.map((item) => (
          <li
            key={item.id || item._id}
            className="flex justify-between text-sm"
          >
            <span>{type === "listing" ? item.title : item.name}</span>
            <span className="font-semibold">
              ৳ {(item.total ?? 0).toLocaleString()}
            </span>
          </li>
        ))
      ) : (
        <li className="text-gray-500 text-sm">No data available</li>
      )}
    </ul>
  </div>
);

export default AdminRevenue;
