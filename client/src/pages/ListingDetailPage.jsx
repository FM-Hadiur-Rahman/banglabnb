// export default ListingDetailPage;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../components/BookingForm";
import ReviewList from "../components/ReviewList";

const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`)
      .then((res) => setListing(res.data))
      .catch((err) => console.error("Failed to load listing:", err));

    if (id) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`)
        .then((res) => setReviews(res.data))
        .catch((err) => console.error("Failed to load reviews:", err));
    }
  }, [id]);

  if (!listing) return <p className="text-center">Loading listing...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Image Gallery and Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {listing.images?.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Image ${idx + 1}`}
              className="w-full h-52 object-cover rounded"
            />
          ))}
        </div>

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
      </div>
      {reviews.length > 0 && (
        <div className="lg:col-span-2 mt-8 space-y-4">
          <div className="text-xl font-semibold">
            ⭐{" "}
            {(
              reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            ).toFixed(1)}{" "}
            · {reviews.length} review{reviews.length > 1 && "s"}
          </div>
          <ReviewList reviews={reviews} />
        </div>
      )}

      {/* Right: Booking Box */}
      <div className="bg-white border rounded-lg p-6 shadow-md h-fit sticky top-20">
        <BookingForm
          listingId={listing._id}
          price={listing.price}
          maxGuests={listing.maxGuests}
        />
      </div>
    </div>
  );
};

export default ListingDetailPage;
