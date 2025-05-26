import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HostBookingActions from "../components/HostBookingActions";
import BookingStatusBadge from "../components/BookingStatusBadge";

const HostListingBookingsPage = () => {
  const { id } = useParams(); // listing ID
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/host`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const filtered = res.data.filter((b) => b.listingId._id === id);
      setBookings(filtered);
    } catch (err) {
      console.error("❌ Error loading bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        Bookings for this Listing
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li
              key={b._id}
              className="p-4 border rounded bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p>
                  <strong>Guest:</strong> {b.guestId.name}
                </p>
                <p>
                  <strong>📅 Dates:</strong>{" "}
                  {new Date(b.dateFrom).toLocaleDateString("en-GB")} →{" "}
                  {new Date(b.dateTo).toLocaleDateString("en-GB")}
                </p>
                <p className="mt-1">
                  <strong>Status:</strong>{" "}
                  <BookingStatusBadge status={b.status} />
                </p>
              </div>

              {b.status === "pending" && (
                <HostBookingActions bookingId={b._id} refresh={fetchBookings} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HostListingBookingsPage;
