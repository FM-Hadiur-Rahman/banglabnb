// src/components/ReviewsChart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ReviewsChart = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/stats/reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("✅ API returned:", res.data);

        // Safely extract reviews array
        const incoming = res.data;
        if (Array.isArray(incoming)) {
          setReviews(incoming);
        } else if (Array.isArray(incoming.reviews)) {
          setReviews(incoming.reviews);
        } else if (Array.isArray(incoming.data)) {
          setReviews(incoming.data);
        } else {
          console.error("❌ Unexpected response shape:", incoming);
          setReviews([]);
        }
      } catch (err) {
        console.error("❌ Error loading reviews chart:", err);
        setReviews([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">🌟 Monthly Reviews</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={Array.isArray(reviews) ? reviews : []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReviewsChart;
