import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import ListingCard from "./ListingCard";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (user?.role === "host") {
      axios
        .get(`http://localhost:3000/api/listings/host/${user._id}`)
        .then((res) => setListings(res.data))
        .catch((err) => console.error("❌ Error fetching listings:", err));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2">Welcome, {user?.name}!</h2>
      <p className="mb-4">Email: {user?.email}</p>

      <button
        onClick={handleLogout}
        className="mb-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
      >
        Logout
      </button>

      {user?.role === "host" && (
        <div>
          <Link
            to="/host/create"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-block mb-4"
          >
            ➕ Create New Listing
          </Link>

          <h3 className="text-xl font-semibold mb-2">Your Listings</h3>
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have no listings yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
