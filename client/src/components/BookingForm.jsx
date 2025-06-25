// ✅ BookingForm.jsx — Full Version with Promocode Support

import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const BookingForm = ({
  listingId,
  price,
  maxGuests,
  blockedDates,
  bookingMode = "stay",
  selectedTrip = null,
}) => {
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
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  const isDateBooked = (date) =>
    bookedRanges.some((r) => date >= r.startDate && date <= r.endDate);

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
        const booked = res.data.map((b) => ({
          startDate: new Date(b.dateFrom),
          endDate: new Date(b.dateTo),
          key: "booked",
          color: "#9ca3af",
          disabled: true,
        }));

        const blocked = blockedDates.map((r) => ({
          startDate: new Date(r.from),
          endDate: new Date(r.to),
          key: "blocked",
          color: "#9333ea",
          disabled: true,
        }));

        setBookedRanges([...booked, ...blocked]);
      })
      .catch((err) => {
        toast.error("❌ Failed to load unavailable dates");
        console.error(err);
      });
  }, [listingId, blockedDates]);

  const handleApplyPromo = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/promocode/validate`,
        {
          code: promoCode,
          type: bookingMode === "combined" ? "both" : "stay",
          totalAmount: total,
        }
      );
      setPromoDiscount(res.data.discount);
      setPromoMessage(`✅ Discount Applied: ৳${res.data.discount}`);
    } catch (err) {
      setPromoDiscount(0);
      setPromoMessage(err.response?.data?.message || "❌ Invalid promo code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const finalAmount =
      total -
      promoDiscount +
      (bookingMode === "combined" && selectedTrip
        ? selectedTrip.farePerSeat
        : 0);

    if (bookingMode === "combined" && selectedTrip) {
      try {
        const bookingRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/combined-bookings`,
          {
            listingId,
            dateFrom: range[0].startDate,
            dateTo: range[0].endDate,
            guests,
            combined: true,
            tripId: selectedTrip._id,
            promoCode: promoCode || null,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { bookingId, amount } = bookingRes.data;

        const combinedRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/combined-payment/initiate`,
          { bookingId, amount: finalAmount },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (combinedRes.data?.gatewayUrl) {
          toast.success("✅ Redirecting to combined payment...");
          window.location.href = combinedRes.data.gatewayUrl;
        } else {
          toast.error("❌ Combined payment URL not received.");
        }
      } catch (err) {
        toast.error("❌ Failed to initiate combined booking payment");
        console.error(err);
      }
      return;
    }

    // Stay-only flow
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          listingId,
          dateFrom: range[0].startDate,
          dateTo: range[0].endDate,
          guests,
          promoCode: promoCode || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const booking = res.data;

      const paymentRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/initiate`,
        {
          amount: finalAmount,
          bookingId: booking._id,
          customer: {
            name: user.name,
            email: user.email,
            address: user.address || "Bangladesh",
            phone: user.phone,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentRes.data?.url) {
        toast.success("✅ Redirecting to payment gateway...");
        window.location.href = paymentRes.data.url;
      } else {
        toast.error("❌ Payment URL not received.");
      }
    } catch (err) {
      const msg =
        err?.response?.status === 409
          ? "These dates are unavailable. Try another range."
          : "Something went wrong. Please try again.";
      toast.error(msg);
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-4 rounded space-y-4"
    >
      <ToastContainer />
      <div className="text-2xl font-semibold">
        ৳{price} <span className="text-sm">night</span>
      </div>

      <DateRange
        ranges={range}
        onChange={(item) => setRange([item.selection])}
        minDate={new Date()}
        rangeColors={["#f43f5e"]}
        disabledDay={isDateBooked}
        editableDateInputs={true}
        months={1}
        direction="vertical"
      />

      <div className="flex gap-4 text-sm mt-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#f43f5e] rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-[#9333ea] rounded"></div>
          <span>Unavailable</span>
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
          Maximum {maxGuests} guest{maxGuests > 1 && "s"} allowed
        </p>
      </div>

      {/* Promo Code */}
      <div className="mt-4">
        <label className="block text-sm font-medium">Promo Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Apply
          </button>
        </div>
        {promoMessage && (
          <p className="text-sm mt-1 text-green-600">{promoMessage}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
      >
        Reserve
      </button>

      {nights > 0 && (
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              ৳{price} x {nights} night{nights > 1 && "s"}
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
          {promoDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo Discount</span>
              <span>- ৳{promoDiscount}</span>
            </div>
          )}
          <div className="border-t pt-2 font-semibold flex justify-between text-lg">
            <span>Total</span>
            <span>৳{total - promoDiscount}</span>
          </div>
        </div>
      )}

      {bookingMode === "combined" && selectedTrip && (
        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Ride Fare (1 seat)</span>
            <span>৳{selectedTrip.farePerSeat}</span>
          </div>
          <div className="border-t pt-2 font-semibold flex justify-between text-lg">
            <span>Combined Total</span>
            <span>৳{total - promoDiscount + selectedTrip.farePerSeat}</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default BookingForm;
