import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ReviewsChart = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/stats/reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const incoming = res.data;
        console.log("✅ Incoming reviews data =", incoming);

        if (Array.isArray(incoming)) {
          setReviews(incoming);
        } else {
          console.warn("⚠️ Invalid reviews data. Fallback to empty array.");
          setReviews([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch reviews data:", err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">🌟 Monthly Reviews</h3>

      {Array.isArray(reviews) && reviews.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reviews}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 italic">No reviews data available.</p>
      )}
    </div>
  );
};

export default ReviewsChart;
