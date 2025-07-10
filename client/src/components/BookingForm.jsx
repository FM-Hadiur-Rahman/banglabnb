// BookingForm.jsx — Final i18n + Bangla number support
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { formatBanglaNumber } from "../utils/formatBanglaNumber";

import "react-toastify/dist/ReactToastify.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { enUS, bn } from "date-fns/locale";

const BookingForm = ({
  listingId,
  price,
  maxGuests,
  blockedDates,
  bookingMode = "stay",
  selectedTrip = null,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === "bn";

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

  const format = (num) => (isBn ? formatBanglaNumber(num) : num);

  const isDateBooked = (date) =>
    bookedRanges.some((r) => date >= r.startDate && date <= r.endDate);

  useEffect(() => {
    const { startDate, endDate } = range[0];
    const diff = (endDate - startDate) / (1000 * 60 * 60 * 24);
    const validNights = diff > 0 ? diff : 0;
    const subtotal = price * validNights;
    const sFee = Math.round(subtotal * 0.1);
    const t = Math.round(sFee * 0.15);

    setNights(validNights);
    setServiceFee(sFee);
    setTax(t);
    setTotal(subtotal + sFee);
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
        toast.error(t("error_loading_dates"));
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
      setPromoMessage(
        t("booking_form.discount_applied", {
          discount: format(res.data.discount),
        })
      );
    } catch (err) {
      setPromoDiscount(0);
      setPromoMessage(
        err.response?.data?.message || t("booking_form.invalid_code")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    // ⛔ Check if selectedTrip is in the past
    if (
      bookingMode === "combined" &&
      selectedTrip &&
      new Date(selectedTrip.date) < new Date()
    ) {
      toast.error(
        "🚫 Selected trip is in the past. Please choose a valid trip."
      );
      return;
    }

    const finalAmount =
      total -
      promoDiscount +
      (bookingMode === "combined" && selectedTrip
        ? selectedTrip.farePerSeat
        : 0);

    try {
      if (bookingMode === "combined" && selectedTrip) {
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
          {
            bookingId,
            amount,
            customer: {
              name: user.name,
              email: user.email,
              address: user.address || "Bangladesh",
              phone: user.phone,
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (combinedRes.data?.gatewayUrl) {
          toast.success("✅ Redirecting to combined payment...");
          window.location.href = combinedRes.data.gatewayUrl;
        } else {
          toast.error("❌ Combined payment URL not received.");
        }

        return;
      }

      // Stay only
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
      toast.error(
        err?.response?.status === 409
          ? t("booking_form.dates_unavailable") || "These dates are unavailable"
          : "Something went wrong. Please try again."
      );
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
        ৳{format(price)}{" "}
        <span className="text-sm">
          {t("booking_form.price_per_night", { price: format(price) })}
        </span>
      </div>
      {/* 
      <DateRange
        ranges={range}
        onChange={(item) => setRange([item.selection])}
        minDate={new Date()}
        rangeColors={["#f43f5e"]}
        disabledDay={isDateBooked}
        editableDateInputs={true}
        months={1}
        direction="vertical"
        locale={i18n.language === "bn" ? bn : enUS}
      /> */}
      <div className="w-full sm:max-w-md">
        <DateRange
          ranges={range}
          onChange={(item) => setRange([item.selection])}
          minDate={new Date()}
          rangeColors={["#f43f5e"]}
          disabledDay={isDateBooked}
          editableDateInputs={true}
          months={1}
          direction="vertical"
          locale={isBn ? bn : enUS}
        />
      </div>

      <div className="flex gap-4 text-sm mt-2">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>{t("booking_form.selected")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>{t("booking_form.unavailable")}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">
          {t("booking_form.guests")}
        </label>
        <input
          type="number"
          value={guests}
          min="1"
          max={maxGuests}
          onChange={(e) => setGuests(Number(e.target.value))}
          required
          className="w-full border px-3 py-2 rounded"
          placeholder={t("booking_form.guests_placeholder")}
        />

        <p className="text-sm text-gray-500">
          {t("booking_form.max_guests_note", {
            max: format(maxGuests),
          })}
        </p>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium">
          {t("booking_form.promo_code")}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder={t("booking_form.promo_placeholder")}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            {t("booking_form.apply")}
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
        {t("booking_form.reserve")}
      </button>

      {nights > 0 && (
        <div className="border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>
              {t("booking_form.summary.subtotal", {
                price: format(price),
                nights: format(nights),
              })}
            </span>
            <span>৳{format(price * nights)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("booking_form.summary.service_fee")}</span>
            <span>৳{format(serviceFee)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>{t("booking_form.summary.tax_note")}</span>
            <span>৳{format(tax)}</span>
          </div>

          {promoDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{t("booking_form.summary.promo_discount")}</span>
              <span>- ৳{format(promoDiscount)}</span>
            </div>
          )}
          <div className="border-t pt-2 font-semibold flex justify-between text-lg">
            <span>{t("booking_form.summary.total")}</span>
            <span>৳{format(total - promoDiscount)}</span>
          </div>
        </div>
      )}

      {bookingMode === "combined" && selectedTrip && (
        <div className="mt-4 border-t pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t("booking_form.ride_fare")}</span>
            <span>৳{format(selectedTrip.farePerSeat)}</span>
          </div>
          <div className="border-t pt-2 font-semibold flex justify-between text-lg">
            <span>{t("booking_form.summary.combined_total")}</span>
            <span>
              ৳{format(total - promoDiscount + selectedTrip.farePerSeat)}
            </span>
          </div>
        </div>
      )}
    </form>
  );
};

export default BookingForm;
