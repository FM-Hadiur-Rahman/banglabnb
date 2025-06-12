import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminListings = () => {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/listings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("📦 Listings response:", res.data);

      if (Array.isArray(res.data)) {
        setListings(res.data);
      } else {
        console.warn("⚠️ Unexpected listings format:", res.data);
        setListings([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch listings:", err);
      setListings([]);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">All Listings</h2>
      {Array.isArray(listings) && listings.length > 0 ? (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th>Title</th>
              <th>Location</th>
              <th>Host</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l._id} className="border-t">
                <td>{l.title}</td>
                <td>{l.location?.address}</td>
                <td>
                  {l.hostId?.name} ({l.hostId?.email})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 italic">No listings found.</p>
      )}
    </AdminLayout>
  );
};

export default AdminListings;
