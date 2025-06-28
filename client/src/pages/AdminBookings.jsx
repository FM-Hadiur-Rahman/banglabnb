import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
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
      <h2 className="text-2xl font-bold mb-4">📅 All Bookings</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 whitespace-nowrap">Guest</th>
              <th className="text-left px-4 py-2 whitespace-nowrap">Listing</th>
              <th className="text-left px-4 py-2 whitespace-nowrap">Status</th>
              <th className="text-left px-4 py-2 whitespace-nowrap">
                Check-in
              </th>
              <th className="text-left px-4 py-2 whitespace-nowrap">
                Check-out
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  {b.guestId?.name} <br />
                  <span className="text-xs text-gray-500">
                    {b.guestId?.email}
                  </span>
                </td>
                <td className="px-4 py-2">{b.listingId?.title}</td>
                <td className="px-4 py-2 capitalize">{b.status}</td>
                <td className="px-4 py-2">
                  {b.dateFrom
                    ? new Date(b.dateFrom).toLocaleDateString("en-GB")
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  {b.dateTo
                    ? new Date(b.dateTo).toLocaleDateString("en-GB")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
