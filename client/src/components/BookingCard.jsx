import React from "react";

const BookingCard = ({ booking, onCheckIn, onCheckOut, onLeaveReview }) => {
  const now = new Date();
  const dateFrom = new Date(booking.dateFrom);
  const dateTo = new Date(booking.dateTo);

  const canCheckIn = now >= dateFrom && !booking.checkInAt;
  const canCheckOut = now >= dateTo && booking.checkInAt && !booking.checkOutAt;
  const canReview = booking.checkOutAt && !booking.hasReviewed;

  return (
    <div className="border border-gray-200 rounded-lg shadow bg-white p-4 space-y-2">
      <h3 className="text-lg font-semibold">{booking.listingId?.title}</h3>
      <p className="text-sm text-gray-500">{booking.listingId?.location}</p>
      <p className="text-sm text-gray-600">
        📅 {dateFrom.toLocaleDateString()} → {dateTo.toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-600">
        💰 ৳{booking.listingId?.price} / night
      </p>

      <div className="flex gap-2 mt-3 flex-wrap">
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
