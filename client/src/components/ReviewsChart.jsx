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
const ReviewsChart = () => {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const reviewsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/stats/reviews`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = reviewsRes.data;

        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.warn("⚠️ Expected array, got:", data);
          setReviews([]); // fallback to avoid crash
        }
      } catch (err) {
        console.error("❌ Error loading chart data:", err);
        setReviews([]); // fallback
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Reviews */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">🌟 Monthly Reviews</h3>
        <ResponsiveContainer width="100%" height={300}>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            <BarChart data={Array.isArray(reviews) ? reviews : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          ) : (
            <div className="text-gray-500 text-sm p-4">
              No data available for chart.
            </div>
          )}
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ReviewsChart;
