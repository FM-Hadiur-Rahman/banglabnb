// ListingDetailPage.safe.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../components/BookingForm";
import ReviewList from "../components/ReviewList";

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error("Failed to load listing:", err));
  }, [id]);

  if (!listing) return <p className="text-center">Loading listing...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Image Gallery and Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* 🖼 Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Array.isArray(listing.images) &&
            listing.images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Image ${idx + 1}`}
                className="w-full h-52 object-cover rounded cursor-pointer hover:opacity-90 transition-transform hover:scale-105"
                onClick={() => setSelectedImage(url)}
              />
            ))}
        </div>

        {/* 🧾 Listing Details */}
        <div>
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <p className="text-gray-600 mt-1">{listing.location?.address}</p>
          <p className="text-green-600 font-bold text-lg">
            ৳{listing.price} / night
          </p>
          <p className="mt-4 text-gray-700">
            This cozy place can host up to {listing.maxGuests} guests.
          </p>
        </div>

        {/* ⭐ Reviews */}
        <div className="mt-8 space-y-4">
          <ReviewList listingId={listing._id} />
        </div>
      </div>

      {/* Right: Booking Form */}
      <div className="bg-white border rounded-lg p-6 shadow-md h-fit sticky top-20">
        <BookingForm
          listingId={listing._id}
          price={listing.price}
          maxGuests={listing.maxGuests}
        />
      </div>

      {/* ✅ Modal Image Viewer */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Full preview"
              className="w-full h-auto rounded shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;
