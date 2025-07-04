import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setListing(res.data))
      .catch((err) => {
        console.error("Failed to fetch listing", err);
        setListing(null);
      });
  }, [id]);

  if (!listing)
    return (
      <AdminLayout>
        <p className="text-gray-500">❌ Listing not found.</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">🏠 Listing Details</h2>
      <div className="bg-white p-4 shadow rounded">
        <p>
          <strong>Title:</strong> {listing.title}
        </p>
        <p>
          <strong>Price:</strong> ৳{listing.price}
        </p>
        <p>
          <strong>Max Guests:</strong> {listing.maxGuests}
        </p>
        <p>
          <strong>Location:</strong> {listing.location?.address}
        </p>
        <p>
          <strong>Division:</strong> {listing.division}
        </p>
        <p>
          <strong>District:</strong> {listing.district}
        </p>
        <p>
          <strong>Host:</strong> {listing.hostId?.name} ({listing.hostId?.email}
          )
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {listing.isDeleted ? "❌ Deleted" : "✅ Active"}
        </p>
        {listing.images?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {listing.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Listing"
                className="h-40 w-full object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminListingDetails;
