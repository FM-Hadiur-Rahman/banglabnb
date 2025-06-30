import React, { useEffect, useState } from "react";
import axios from "axios";
import { DateRange } from "react-date-range";
import { isWithinInterval } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const BookingCard = ({
  booking,
  onCheckIn,
  onCheckOut,
  onLeaveReview,
  onRequestModification,
}) => {
  const { t } = useTranslation();
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [newRange, setNewRange] = useState([
    {
      startDate: new Date(booking.dateFrom),
      endDate: new Date(booking.dateTo),
      key: "selection",
    },
  ]);
  const [bookedRanges, setBookedRanges] = useState([]);

  const now = new Date();
  const dateFrom = new Date(booking.dateFrom);
  const dateTo = new Date(booking.dateTo);

  const canCheckIn = now >= dateFrom && !booking.checkInAt;
  const canCheckOut = now >= dateTo && booking.checkInAt && !booking.checkOutAt;
  const canReview = booking.checkOutAt && !booking.hasReviewed;
  const canModify =
    (booking.status === "pending" || booking.status === "confirmed") &&
    !booking.checkInAt &&
    booking.modificationRequest?.status !== "requested";

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/bookings/listing/${
          booking.listingId._id
        }`
      )
      .then((res) => {
        const ranges = res.data
          .filter((b) => b._id !== booking._id)
          .map((b) => ({
            startDate: new Date(b.dateFrom),
            endDate: new Date(b.dateTo),
          }));
        setBookedRanges(ranges);
      })
      .catch((err) => {
        console.error("❌ Failed to load blocked dates", err);
      });
  }, [booking]);

  const isDateBlocked = (date) => {
    return bookedRanges.some((range) =>
      isWithinInterval(date, { start: range.startDate, end: range.endDate })
    );
  };

  const initiateExtraPayment = async (bookingId, amount) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/extra`,
        { bookingId, amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(t("booking.payment_url_missing"));
      }
    } catch (err) {
      toast.error(t("booking.extra_payment_failed"));
      console.error(err);
    }
  };

  const handleClaimRefund = async (bookingId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/claim-refund`,
        { bookingId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(t("booking.refund_claimed"));
      window.location.reload();
    } catch (err) {
      console.error(t("booking.refund_failed"), err);
      toast.error(t("booking.refund_failed"));
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow bg-white p-4 space-y-2">
      <h3 className="text-lg font-semibold">{booking.listingId?.title}</h3>
      <p className="text-sm text-gray-500">
        {booking.listingId?.location?.address}
      </p>
      <p className="text-sm text-gray-600">
        📅 {dateFrom.toLocaleDateString()} → {dateTo.toLocaleDateString()}
      </p>

      {booking.modificationRequest?.status === "requested" && (
        <p className="text-sm text-yellow-600 mt-2">
          🔄 {t("booking.requested_change")}:{" "}
          {new Date(
            booking.modificationRequest.requestedDates.from
          ).toLocaleDateString()}{" "}
          →{" "}
          {new Date(
            booking.modificationRequest.requestedDates.to
          ).toLocaleDateString()}
        </p>
      )}
      {booking.modificationRequest?.status === "accepted" && (
        <p className="text-sm text-green-600 mt-2">
          ✅ {t("booking.change_accepted")}
        </p>
      )}
      {booking.modificationRequest?.status === "rejected" && (
        <p className="text-sm text-red-600 mt-2">
          ❌ {t("booking.change_rejected")}
        </p>
      )}

      <p className="text-sm text-gray-600">
        💰 ৳{booking.listingId?.price} / {t("price_per_night_unit")}
      </p>

      {booking.extraPayment?.required &&
        booking.extraPayment?.status === "pending" && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded text-sm">
            🛎{" "}
            {t("booking.extra_required", {
              amount: booking.extraPayment.amount,
            })}
            <button
              onClick={() =>
                initiateExtraPayment(booking._id, booking.extraPayment.amount)
              }
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded ml-3"
            >
              {t("booking.pay_now")}
            </button>
          </div>
        )}

      {booking.extraPayment?.status === "refund_pending" && (
        <div className="bg-green-100 text-green-700 p-3 rounded text-sm mt-2">
          💸{" "}
          {t("booking.refund_notice", {
            amount: Math.abs(booking.extraPayment.amount),
          })}
        </div>
      )}
      {booking.extraPayment?.status === "refund_pending" &&
        !booking.extraPayment?.refundClaimed && (
          <button
            onClick={() => handleClaimRefund(booking._id)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded mt-2"
          >
            💸 {t("booking.claim_refund")}
          </button>
        )}

      <div className="flex gap-2 mt-3 flex-wrap">
        {canModify && (
          <>
            <button
              onClick={() => setShowModifyForm(!showModifyForm)}
              className="px-3 py-1 bg-purple-500 text-white text-sm rounded"
            >
              ✏️ {t("booking.request_change")}
            </button>

            {showModifyForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onRequestModification(
                    booking._id,
                    newRange[0].startDate,
                    newRange[0].endDate
                  );
                  setShowModifyForm(false);
                }}
                className="w-full mt-3 space-y-3"
              >
                <DateRange
                  ranges={newRange}
                  onChange={(item) => setNewRange([item.selection])}
                  minDate={new Date()}
                  disabledDay={isDateBlocked}
                  rangeColors={["#f43f5e"]}
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                >
                  {t("booking.submit_change")}
                </button>
              </form>
            )}
          </>
        )}

        {canCheckIn && (
          <button
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
            onClick={() => onCheckIn(booking._id)}
          >
            ✅ {t("booking.check_in")}
          </button>
        )}
        {canCheckOut && (
          <button
            className="px-3 py-1 bg-green-600 text-white text-sm rounded"
            onClick={() => onCheckOut(booking._id)}
          >
            ✅ {t("booking.check_out")}
          </button>
        )}
        {canReview && (
          <button
            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
            onClick={() => onLeaveReview(booking)}
          >
            ✍️ {t("booking.leave_review")}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
