// pages/AdminListings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminListings = () => {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/listings`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setListings(res.data);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">All Listings</h2>
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
    </AdminLayout>
  );
};

export default AdminListings;
