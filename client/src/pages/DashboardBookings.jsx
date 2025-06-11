import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingCard from "../components/BookingCard";
import { authHeader } from "../utils/authHeader";
import { toast } from "react-toastify";

const DashboardBookings = () => {
  const [bookings, setBookings] = useState([]);
  const handleRequestModification = async (id, from, to) => {
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_API_URL
        }/api/bookings/${id}/request-modification`,
        { from, to },
        authHeader()
      );
      toast.success("📅 Modification request sent");
      fetchBookings(); // refresh state
    } catch (err) {
      toast.error("❌ Failed to send request");
    }
  };

  const fetchBookings = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/bookings/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("❌ Failed to load bookings", err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCheckIn = async (id) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/bookings/${id}/checkin`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    fetchBookings();
  };

  const handleCheckOut = async (id) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/bookings/${id}/checkout`,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    fetchBookings();
  };

  const handleLeaveReview = (booking) => {
    // e.g. open modal or navigate to /review page
    console.log("Leave review for:", booking);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">📋 My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onLeaveReview={handleLeaveReview}
              onRequestModification={handleRequestModification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardBookings;
