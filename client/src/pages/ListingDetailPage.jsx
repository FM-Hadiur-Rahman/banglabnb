// 📁 src/pages/ListingDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../components/BookingForm";

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error("Failed to load listing:", err));
  }, [id]);

  if (!listing) return <p className="text-center">Loading listing...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      <p className="text-gray-600 mb-1">{listing.location}</p>
      <p className="text-green-700 font-semibold text-lg mb-4">
        ৳{listing.price} / night
      </p>

      <h2 className="text-xl font-bold mb-2">Book this stay</h2>
      <BookingForm listingId={listing._id} />
    </div>
  );
};

export default ListingDetailPage;
