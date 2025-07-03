import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EarningsChart from "../components/EarningsChart";
import ReviewsChart from "../components/ReviewsChart";

const HostDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [listings, setListings] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [earningsData, setEarningsData] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      // 1. Fetch listings
      const listingsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/listings/host/${user._id}`
      );
      if (Array.isArray(listingsRes.data)) {
        setListings(listingsRes.data);
      } else {
        console.warn("⚠️ Listings response not an array:", listingsRes.data);
        setListings([]);
      }

      // 2. Fetch bookings
      const bookingsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/host`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (Array.isArray(bookingsRes.data)) {
        const future = bookingsRes.data.filter(
          (b) => new Date(b.dateFrom) >= new Date()
        );
        setCheckIns(future);
      } else {
        console.warn("⚠️ Bookings response not an array:", bookingsRes.data);
        setCheckIns([]);
      }

      // 3. Count reviews
      let reviewCount = 0;
      listingsRes.data?.forEach((listing) => {
        if (listing.reviews) {
          reviewCount += listing.reviews.length;
        }
      });
      setTotalReviews(reviewCount);

      // 4. Fetch earnings and reviews chart data
      const statsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/stats/host/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEarningsData(statsRes.data?.earnings || []);
      setReviewsData(statsRes.data?.reviews || []);
    } catch (err) {
      console.error("❌ Error loading dashboard data:", err);
    }
  };

  useEffect(() => {
    if (user?.role === "host") fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setListings((prev) => prev.filter((l) => l._id !== id));
      alert("✅ Listing deleted!");
    } catch (err) {
      alert("❌ Could not delete listing.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link
            to="/dashboard/host/chats"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            💬 Guest Chats
          </Link>
          <Link
            to="/host/create"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            ➕ Create New Listing
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-bold">{listings.length}</h2>
          <p className="text-gray-600">Total Listings</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-bold">{checkIns.length}</h2>
          <p className="text-gray-600">Upcoming Bookings</p>
        </div>
        <div className="bg-white shadow rounded p-4 text-center">
          <h2 className="text-xl font-bold">{totalReviews}</h2>
          <p className="text-gray-600">Total Reviews</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <EarningsChart data={earningsData} />
        <ReviewsChart data={reviewsData} />
      </div>

      {/* Upcoming Check-ins */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">🛎 Upcoming Check-Ins</h3>
        {Array.isArray(checkIns) && checkIns.length === 0 ? (
          <p className="text-gray-500">No upcoming check-ins.</p>
        ) : (
          <ul className="space-y-2">
            {Array.isArray(checkIns) &&
              checkIns.map((b) => (
                <li key={b._id} className="border p-3 rounded bg-white shadow">
                  <div className="font-semibold">{b.listingId?.title}</div>
                  <div className="text-sm text-gray-600">
                    📅 {new Date(b.dateFrom).toLocaleDateString()} →{" "}
                    {new Date(b.dateTo).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    👤 Guest ID: {b.guestId._id?.name || "Unknown"}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Listings */}
      <div>
        <h3 className="text-xl font-semibold mb-2">🏡 Your Listings</h3>
        {Array.isArray(listings) && listings.length === 0 ? (
          <p className="text-gray-500">You have no listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.isArray(listings) &&
              listings.map((listing) => (
                <div
                  key={listing._id}
                  className="border p-4 rounded shadow bg-white flex flex-col"
                >
                  <img
                    src={listing.images?.[0]}
                    alt={listing.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                  <h3 className="text-lg font-bold mb-1">{listing.title}</h3>
                  <p className="text-gray-500 mb-1">
                    📍 {listing.location?.address}
                  </p>
                  <p className="text-green-600 font-semibold mb-3">
                    ৳{listing.price}/night
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    <Link
                      to={`/host/edit/${listing._id}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </Link>

                    <Link
                      to={`/host/listings/${listing._id}/bookings`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      View Bookings
                    </Link>

                    <Link
                      to={`/host/listings/${listing._id}/blocked-dates`}
                      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    >
                      Manage Availability
                    </Link>

                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
