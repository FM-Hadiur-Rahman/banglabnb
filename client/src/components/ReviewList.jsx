import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewList = ({ listingId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/reviews/listing/${listingId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("❌ Load reviews:", err));
  }, [listingId]);

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r._id} className="border p-3 rounded">
          <div className="font-semibold">{r.guest?.name || "Anonymous"}</div>
          <div>Rating: {r.rating} ★</div>
          <p>{r.text}</p>
          {r.hostReply && (
            <p className="text-sm text-gray-600">
              💬 Host reply: {r.hostReply}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
