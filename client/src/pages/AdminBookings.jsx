// pages/AdminBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/bookings`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setBookings(res.data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th>Guest</th>
            <th>Listing</th>
            <th>Status</th>
            <th>Check-in</th>
            <th>Check-out</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id} className="border-t">
              <td>
                {b.guestId?.name} ({b.guestId?.email})
              </td>
              <td>{b.listingId?.title}</td>
              <td>{b.status}</td>
              <td>{new Date(b.checkIn).toLocaleDateString()}</td>
              <td>{new Date(b.checkOut).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default AdminBookings;
