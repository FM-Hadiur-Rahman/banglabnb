import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingForm = ({ listingId, price, maxGuests }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const [serviceFee, setServiceFee] = useState(0);
  const [tax, setTax] = useState(0);
  const [nights, setNights] = useState(0);
  const [total, setTotal] = useState(0);
  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = (end - start) / (1000 * 60 * 60 * 24);
      const validNights = diff > 0 ? diff : 0;

      const subtotal = price * validNights;
      const dynamicServiceFee = Math.round(subtotal * 0.15);
      const dynamicTax = Math.round(subtotal * 0.1);

      setNights(validNights);
      setServiceFee(dynamicServiceFee);
      setTax(dynamicTax);
      setTotal(subtotal + dynamicServiceFee + dynamicTax);
    }
  }, [checkIn, checkOut, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          listingId,
          dateFrom: checkIn,
          dateTo: checkOut,
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
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-4 rounded space-y-4"
    >
      <div className="text-2xl font-semibold">
        ৳{price} <span className="text-sm">night</span>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-medium">Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            required
            min={todayStr}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium">Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || todayStr}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Guests</label>
        <input
          type="number"
          value={guests}
          min="1"
          max={maxGuests}
          onChange={(e) => setGuests(Number(e.target.value))}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <p className="text-sm text-gray-500">
          Maximum {maxGuests} {maxGuests === 1 ? "guest" : "guests"} allowed
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
      >
        Reserve
      </button>

      <p className="text-center text-gray-500 text-sm">
        You won’t be charged yet
      </p>

      {nights > 0 && (
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              ৳{price} x {nights} nights
            </span>
            <span>৳{price * nights}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee</span>
            <span>৳{serviceFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>৳{tax}</span>
          </div>
          <div className="border-t pt-2 font-semibold flex justify-between text-lg">
            <span>Total</span>
            <span>৳{total}</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default BookingForm;
