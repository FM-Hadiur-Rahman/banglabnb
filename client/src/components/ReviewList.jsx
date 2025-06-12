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
          console.warn("Expected array but got:", res.data);
          setReviews([]);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to load reviews:", err);
        setReviews([]);
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  if (loading) return <p>Loading reviews...</p>;

  if (reviews.length === 0)
    return (
      <p className="text-gray-600 italic">
        No reviews yet. Be the first to review!
      </p>
    );

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="border p-3 rounded">
          <div className="font-semibold">{r.guestId?.name || "Anonymous"}</div>
          <div>Rating: {r.rating} ★</div>
          <p>{r.text}</p>
          {r.response && (
            <p className="text-sm text-gray-600">💬 Host reply: {r.response}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
