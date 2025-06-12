import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewList = ({ listingId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/reviews/listing/${listingId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setReviews(res.data);
        } else {
          console.warn("⚠️ Expected reviews to be an array but got:", res.data);
          setReviews([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load reviews:", err);
        setReviews([]);
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading)
    return <p className="text-gray-500 italic">Loading reviews...</p>;

  if (!Array.isArray(reviews) || reviews.length === 0)
    return (
      <p className="text-gray-600 italic">
        No reviews yet. Be the first to review!
      </p>
    );

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="border p-3 rounded shadow-sm">
          <div className="font-semibold">{r.guestId?.name || "Anonymous"}</div>
          <div className="text-yellow-600 font-medium">
            Rating: {r.rating} ★
          </div>
          <p className="text-gray-800">{r.text}</p>
          {r.response && (
            <p className="text-sm text-gray-600 mt-1">
              💬 Host reply: <em>{r.response}</em>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
