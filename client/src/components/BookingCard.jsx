import React from "react";
import { useState } from "react";

const BookingCard = ({
  booking,
  onCheckIn,
  onCheckOut,
  onLeaveReview,
  onRequestModification,
}) => {
  const [showModifyForm, setShowModifyForm] = useState(false);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const now = new Date();
  const dateFrom = new Date(booking.dateFrom);
  const dateTo = new Date(booking.dateTo);

  const canCheckIn = now >= dateFrom && !booking.checkInAt;
  const canCheckOut = now >= dateTo && booking.checkInAt && !booking.checkOutAt;
  const canReview = booking.checkOutAt && !booking.hasReviewed;
  const canModify =
    booking.status === "pending" &&
    booking.modificationRequest?.status !== "requested";

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
          🔄 Date change requested:{" "}
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
          ✅ Your date change was accepted
        </p>
      )}
      {booking.modificationRequest?.status === "rejected" && (
        <p className="text-sm text-red-600 mt-2">
          ❌ Your date change was rejected
        </p>
      )}

      <p className="text-sm text-gray-600">
        💰 ৳{booking.listingId?.price} / night
      </p>

      <div className="flex gap-2 mt-3 flex-wrap">
        {canModify && (
          <>
            <button
              onClick={() => setShowModifyForm(!showModifyForm)}
              className="px-3 py-1 bg-purple-500 text-white text-sm rounded"
            >
              ✏️ Request Date Change
            </button>
            {showModifyForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onRequestModification(booking._id, newFrom, newTo);
                  setShowModifyForm(false);
                }}
                className="w-full mt-2 space-y-2"
              >
                <input
                  type="date"
                  value={newFrom}
                  onChange={(e) => setNewFrom(e.target.value)}
                  className="border p-1 rounded w-full"
                  required
                />
                <input
                  type="date"
                  value={newTo}
                  onChange={(e) => setNewTo(e.target.value)}
                  className="border p-1 rounded w-full"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Submit Request
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
            ✅ Check In
          </button>
        )}
        {canCheckOut && (
          <button
            className="px-3 py-1 bg-green-600 text-white text-sm rounded"
            onClick={() => onCheckOut(booking._id)}
          >
            ✅ Check Out
          </button>
        )}
        {canReview && (
          <button
            className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
            onClick={() => onLeaveReview(booking)}
          >
            ✍️ Leave Review
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
