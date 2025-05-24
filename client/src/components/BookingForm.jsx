// === Frontend example component === //
// 📁 src/components/BookingForm.jsx
import React, { useState } from "react";
import axios from "axios";

const BookingForm = ({ listingId }) => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        { listingId, dateFrom, dateTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking request sent!");
    } catch (err) {
      alert("Booking failed.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;
