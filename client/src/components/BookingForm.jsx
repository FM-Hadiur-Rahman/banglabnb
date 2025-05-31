// // === Frontend example component === //
// // 📁 src/components/BookingForm.jsx
// import React, { useState } from "react";
// import axios from "axios";

// const BookingForm = ({ listingId }) => {
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/bookings`,
//         { listingId, dateFrom, dateTo },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Booking request sent!");
//     } catch (err) {
//       alert("Booking failed.");
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-2">
//       <input
//         type="date"
//         value={dateFrom}
//         onChange={(e) => setDateFrom(e.target.value)}
//         className="border p-2 w-full"
//         required
//       />
//       <input
//         type="date"
//         value={dateTo}
//         onChange={(e) => setDateTo(e.target.value)}
//         className="border p-2 w-full"
//         required
//       />
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Book Now
//       </button>
//     </form>
//   );
// };

// export default BookingForm;

import React, { useState } from "react";
import axios from "axios";

const BookingForm = ({ listingId, price }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          listingId,
          checkIn,
          checkOut,
          guests,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Booking request sent!");
    } catch (err) {
      alert("❌ Booking failed.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-2xl font-semibold">৳{price} / night</div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Check-in
        </label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Check-out
        </label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Guests
        </label>
        <input
          type="number"
          value={guests}
          min="1"
          onChange={(e) => setGuests(e.target.value)}
          required
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
      >
        Reserve
      </button>
    </form>
  );
};

export default BookingForm;
