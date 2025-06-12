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

        if (Array.isArray(reviewsRes.data)) {
          setReviews(reviewsRes.data);
        } else {
          console.error("Invalid reviews data:", reviewsRes.data);
          setReviews([]); // fallback to avoid BarChart crash
        }
      } catch (err) {
        console.error("Error loading chart data:", err);
        setReviews([]); // prevent crash on error
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Reviews */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">🌟 Monthly Reviews</h3>
        {Array.isArray(reviews) && reviews.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
};

export default ReviewsChart;
