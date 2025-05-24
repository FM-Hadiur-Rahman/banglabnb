import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HostDashboard = () => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const hostId = user?._id;

    if (!hostId) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/host/${hostId}`)
      .then((res) => setListings(res.data))
      .catch((err) => console.error("❌ Error loading listings:", err));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setListings((prev) => prev.filter((listing) => listing._id !== id));
      alert("✅ Listing deleted!");
    } catch (err) {
      console.error("❌ Delete failed:", err.response || err.message);
      alert("❌ Could not delete listing.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Listings</h2>
        <Link
          to="/host/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Create New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <div key={listing._id} className="border p-4 rounded shadow">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="text-lg font-bold">{listing.title}</h3>
            <p className="text-gray-500">{listing.location}</p>
            <p className="text-green-600 font-semibold">
              ৳{listing.price}/night
            </p>

            <div className="flex space-x-2 mt-3">
              <Link
                to={`/host/edit/${listing._id}`}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Edit
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
    </div>
  );
};

export default HostDashboard;
