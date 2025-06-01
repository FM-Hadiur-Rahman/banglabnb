import React, { useEffect, useState } from "react";
import axios from "axios";
import ListingCard from "./ListingCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [listings, setListings] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [stats, setStats] = useState({ earnings: [], reviews: [] });

  useEffect(() => {
    if (user?.role === "host") {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/listings/host/${user._id}`)
        .then((res) => setListings(res.data))
        .catch((err) => console.error("❌ Error fetching listings:", err));

      axios
        .get(`${import.meta.env.VITE_API_URL}/api/bookings/host`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => {
          const future = res.data.filter(
            (b) => new Date(b.dateFrom) >= new Date()
          );
          setCheckIns(future);
        })
        .catch((err) => console.error("❌ Error fetching check-ins:", err));
    }
  }, [user]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
      <p className="mb-4">Email: {user?.email}</p>

      <div className="flex gap-6 flex-wrap mb-6">
        <Link
          to="/dashboard/bookings"
          className="text-blue-600 hover:underline text-lg"
        >
          🗓 My Bookings
        </Link>
        <Link to="/profile" className="text-blue-600 hover:underline text-lg">
          🙍 Edit Profile
        </Link>
        <Link
          to="/host/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ➕ Create New Listing
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">📈 Monthly Earnings</h3>
          <img
            src="/charts/earnings.png"
            alt="Earnings chart"
            className="w-full rounded"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">🌟 Monthly Reviews</h3>
          <img
            src="/charts/reviews.png"
            alt="Reviews chart"
            className="w-full rounded"
          />
        </div>
      </div>

      {/* Upcoming check-ins */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">🛎 Upcoming Check-Ins</h3>
        {checkIns.length === 0 ? (
          <p className="text-gray-500">No upcoming check-ins.</p>
        ) : (
          <ul className="space-y-2">
            {checkIns.map((b) => (
              <li key={b._id} className="border p-3 rounded bg-white shadow">
                <div className="font-semibold">{b.listingId?.title}</div>
                <div className="text-sm text-gray-600">
                  📅 {new Date(b.dateFrom).toLocaleDateString()} →{" "}
                  {new Date(b.dateTo).toLocaleDateString()}
                </div>
                <div className="text-sm">👤 Guest ID: {b.guestId}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Listings */}
      <div>
        <h3 className="text-xl font-semibold mb-2">🏡 Your Listings</h3>
        {listings.length === 0 ? (
          <p className="text-gray-500">You have no listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
