import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const RideResults = ({
  trips = [],
  onReserve,
  onCancel,
  selectedTrip,
  onSelectTrip,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!trips.length)
    return <p className="text-center text-gray-600 py-6">❌ No rides found.</p>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => {
        const isUrgent = dayjs(trip.date).diff(dayjs(), "hour") < 24;
        const isVerified = trip.driverId?.verified;
        const vehicleEmoji = trip.vehicleType === "car" ? "🚗" : "🏍️";

        const reservedSeats = trip.passengers?.reduce(
          (sum, p) => sum + (p.status !== "cancelled" ? p.seats || 1 : 0),
          0
        );
        const seatsLeft = (trip.totalSeats || 0) - reservedSeats;

        const hasReserved = trip.passengers?.some(
          (p) =>
            (p.user === user?._id || p.user?._id === user?._id) &&
            p.status !== "cancelled"
        );

        return (
          <Link
            key={trip._id}
            to={`/trips/${trip._id}`}
            className="block border rounded-lg shadow hover:shadow-lg hover:border-green-500 transition-all bg-white overflow-hidden group"
          >
            {trip.location?.coordinates && (
              <iframe
                title="Mini Map"
                className="w-full h-32 object-cover"
                src={`https://maps.google.com/maps?q=${trip.location.coordinates[1]},${trip.location.coordinates[0]}&z=12&output=embed`}
              ></iframe>
            )}

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  {trip.from} ➡ {trip.to}
                </h2>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  ৳{trip.farePerSeat}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap text-sm">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {vehicleEmoji} {trip.vehicleType.toUpperCase()}
                </span>
                {isVerified && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    ✅ Verified Driver
                  </span>
                )}
                {isUrgent && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full animate-pulse">
                    🔥 Urgent
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {trip.date.slice(0, 10)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Time:</strong> {trip.time}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Seats:</strong> {seatsLeft} of {trip.totalSeats}{" "}
                available
              </p>

              {!user ? (
                <span className="block mt-2 text-blue-500 text-sm font-medium">
                  🔒 Login to reserve a ride
                </span>
              ) : onReserve ? (
                seatsLeft > 0 ? (
                  <>
                    <input
                      type="number"
                      min="1"
                      max={seatsLeft}
                      defaultValue={1}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        (trip.selectedSeats = parseInt(e.target.value))
                      }
                      className="border mt-2 px-2 py-1 w-full rounded text-sm"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onReserve(trip, trip.selectedSeats || 1);
                      }}
                      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
                    >
                      📩 Reserve {trip.selectedSeats || 1} Seat
                      {(trip.selectedSeats || 1) > 1 ? "s" : ""}
                    </button>
                  </>
                ) : (
                  <span className="block mt-2 text-red-500 font-medium">
                    Fully booked
                  </span>
                )
              ) : (
                <></> // no cancel/reserve shown if not passed
              )}

              {onSelectTrip && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectTrip(trip);
                  }}
                  className={`mt-2 w-full ${
                    selectedTrip?._id === trip._id
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  } py-2 rounded text-sm font-medium`}
                >
                  {selectedTrip?._id === trip._id
                    ? "✅ Selected for Booking"
                    : "Select This Ride"}
                </button>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RideResults;
