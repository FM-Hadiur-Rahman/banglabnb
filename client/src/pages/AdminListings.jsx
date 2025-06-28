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
      if (Array.isArray(res.data)) {
        setListings(res.data);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch listings:", err);
      setListings([]);
    }
  };

  const handleRestore = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/listings/${id}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchListings();
    } catch (err) {
      console.error("❌ Failed to restore listing:", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!confirm("Are you sure you want to soft-delete this listing?")) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/listings/${id}/soft-delete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchListings();
    } catch (err) {
      console.error("❌ Failed to soft-delete listing:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">🏠 All Listings</h2>

      <div className="overflow-x-auto bg-white rounded shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left whitespace-nowrap">Title</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">
                Location
              </th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Host</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Status</th>
              <th className="px-4 py-2 text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listings.map((l) => (
              <tr
                key={l._id}
                className={`hover:bg-gray-50 ${
                  l.isDeleted ? "bg-red-50 text-gray-500 line-through" : ""
                }`}
              >
                <td className="px-4 py-2">{l.title}</td>
                <td className="px-4 py-2">{l.location?.address}</td>
                <td className="px-4 py-2">
                  {l.hostId?.name}
                  <br />
                  <span className="text-xs text-gray-500">
                    {l.hostId?.email}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {l.isDeleted ? "Deleted" : "Active"}
                </td>
                <td className="px-4 py-2">
                  {l.isDeleted ? (
                    <button
                      onClick={() => handleRestore(l._id)}
                      className="text-green-600 hover:underline"
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(l._id)}
                      className="text-red-500 hover:underline"
                    >
                      Soft Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {listings.length === 0 && (
        <p className="text-gray-500 italic mt-4">No listings found.</p>
      )}
    </AdminLayout>
  );
};

export default AdminListings;
