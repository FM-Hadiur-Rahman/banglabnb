import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
const EarningsChart = () => {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const earningsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/stats/earnings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setEarnings(earningsRes.data); // array of { month, total }
      } catch (err) {
        console.error("Error loading chart data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Earnings */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">📈 Monthly Earnings</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earnings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default EarningsChart;
