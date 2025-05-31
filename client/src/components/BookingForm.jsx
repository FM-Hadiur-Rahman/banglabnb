import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BookingForm = ({ listingId, price, maxGuests }) => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);
  const [serviceFee, setServiceFee] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  const [bookedRanges, setBookedRanges] = useState([]);

  useEffect(() => {
    const { startDate, endDate } = range[0];
    const diff = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const validNights = diff > 0 ? diff : 0;
    const subtotal = price * validNights;
    const sFee = Math.round(subtotal * 0.15);
    const t = Math.round(subtotal * 0.1);

    setNights(validNights);
    setServiceFee(sFee);
    setTax(t);
    setTotal(subtotal + sFee + t);
  }, [range, price]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/bookings/listing/${listingId}`)
      .then((res) => {
        const blocked = res.data.map((b) => ({
          startDate: new Date(b.dateFrom),
          endDate: new Date(b.dateTo),
          key: "blocked", // key is required by react-date-range
          color: "#ccc",
          disabled: true,
        }));
        setBookedRanges(blocked);
      })
      .catch((err) => {
        console.error("❌ Failed to load booking dates", err);
      });
  }, [listingId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          listingId,
          dateFrom: range[0].startDate,
          dateTo: range[0].endDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Booking request sent!");
    } catch (err) {
      if (err.response?.status === 409) {
        alert(
          "❌ These dates are already booked. Please choose different ones."
        );
      } else {
        alert("❌ Booking failed.");
      }
      console.error("❌ Booking error:", err);
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

      <DateRange
        editableDateInputs={true}
        onChange={(item) => setRange([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={range}
        minDate={new Date()}
      />

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
