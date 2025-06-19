// ListingDetailPage.safe.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../components/BookingForm";
import ReviewList from "../components/ReviewList";
import RideResults from "../components/RideResults";

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [suggestedTrips, setSuggestedTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error("Failed to load listing:", err));
  }, [id]);
  useEffect(() => {
    if (!listing?.district) return;

    setLoadingTrips(true); // 🟢 START loading

    // 🧪 TEMPORARY HARDCODED TEST LOCATION IN BANGLADESH (Dhaka)
    const isDev = true; // set false in production

    if (isDev) {
      const latitude = 23.8103;
      const longitude = 90.4125;

      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/trips/suggestions?to=${
            listing.district
          }&lat=${latitude}&lng=${longitude}`
        )
        .then((res) => setSuggestedTrips(res.data))
        .catch((err) => console.error("❌ Trip suggestion fetch error", err))
        .finally(() => setLoadingTrips(false));
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          axios
            .get(
              `${import.meta.env.VITE_API_URL}/api/trips/suggestions?to=${
                listing.district
              }&lat=${latitude}&lng=${longitude}`
            )
            .then((res) => setSuggestedTrips(res.data))
            .catch((err) =>
              console.error("❌ Trip suggestion fetch error", err)
            )
            .finally(() => setLoadingTrips(false));
        },
        (err) => {
          console.error("❌ Geolocation failed:", err);
          setLoadingTrips(false);
        }
      );
    }
  }, [listing]);

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
          blockedDates={listing.blockedDates || []}
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
      {loadingTrips ? (
        <p className="text-center text-gray-500 mt-6">
          🔄 Finding nearby rides...
        </p>
      ) : suggestedTrips.length > 0 ? (
        <div className="mt-10 border-t pt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            🚗 Suggested Rides
          </h3>
          <RideResults trips={suggestedTrips} />
        </div>
      ) : null}
    </div>
  );
};

export default ListingDetailPage;
